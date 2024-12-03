# onelsp.env: Language Server for `.env` Files

`onelsp.env` is a lightweight and efficient Language Server Protocol (LSP) implementation for `.env` files. It provides diagnostics, hover information, and ensures that `.env` files are validated for proper syntax and duplicate keys.

## Features

- **Diagnostics**:
  - Detects invalid syntax in `.env` files.
  - Warns about duplicate keys.
- **Hover Support**:
  - Displays detailed information about environment variables, including their values.
- **Simple and Lightweight**:
  - Built using the `vscode-languageserver` library.
  - Optimized for Neovim and other LSP clients.

---

## Getting Started

### Prerequisites

- **Node.js** (v20 or higher).
- **Neovim** with `nvim-lspconfig`, `mason.nvim`, or `zero.nvim`.

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/onexbash/onelsp.env.git
   cd onelsp.env
   ```

### Roadmap

- Improve docs and add usage examples for [lazy.nvim](https://github.com/folke/lazy.nvim), [mini.deps](https://github.com/echasnovski/mini.nvim/blob/main/readmes/mini-deps.md) and [packer](https://github.com/wbthomason/packer.nvim)
- Implement formatting capabilities
- Implement linting capabilities (?)
