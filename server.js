import {
  createConnection,
  TextDocuments,
  DiagnosticSeverity,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver";

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a manager for open text documents
const documents = new TextDocuments();
documents.listen(connection);

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      hoverProvider: true,
    },
  };
});

// Helper to parse .env files
function parseEnv(content) {
  const diagnostics = [];
  const hoverInfo = {};
  const keys = new Set();

  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed === "" || trimmed.startsWith("#")) {
      return;
    }

    // Validate key-value pair syntax
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(["']?)(.*?)\2$/);
    if (!match) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: index, character: 0 },
          end: { line: index, character: line.length },
        },
        message: 'Invalid syntax. Expected KEY="value" or KEY=value.',
      });
      return;
    }

    const key = match[1];
    const value = match[3];

    // Check for duplicate keys
    if (keys.has(key)) {
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { line: index, character: 0 },
          end: { line: index, character: line.length },
        },
        message: `Duplicate key "${key}".`,
      });
    } else {
      keys.add(key);
      hoverInfo[key] = `Key: ${key}\nValue: ${value}`;
    }
  });

  return { diagnostics, hoverInfo };
}

// Listen for diagnostics
documents.onDidChangeContent((change) => {
  const text = change.document.getText();
  const { diagnostics } = parseEnv(text);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// Provide hover information
connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  const content = document.getText();
  const { hoverInfo } = parseEnv(content);

  const position = params.position;
  const line = content.split("\n")[position.line];
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);

  if (match) {
    const key = match[1];
    if (hoverInfo[key]) {
      return {
        contents: {
          kind: "plaintext",
          value: hoverInfo[key],
        },
      };
    }
  }

  return null;
});

// Start the server
connection.listen();
