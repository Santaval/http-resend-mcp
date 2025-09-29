# xMCP HTTP Resend Server

This is a Model Context Protocol (MCP) server built with xMCP and TypeScript for HTTP operations and email sending functionality.

## Project Setup Complete ✅

- [x] TypeScript xMCP server with HTTP and STDIO transports
- [x] Node.js 22+ compatibility (required for xMCP)
- [x] Example tools and prompts included
- [x] VS Code debugging configuration
- [x] Build system configured
- [x] Documentation complete

## Development Guidelines

- Use TypeScript for all source code
- Follow xMCP patterns for tools and prompts
- Test with both HTTP and STDIO transports
- Ensure Node.js 22+ compatibility
- Build before testing with `npm run build`

## Architecture

- **Tools**: Auto-discovered from `src/tools/`
- **Prompts**: Auto-discovered from `src/prompts/`
- **Config**: Managed via `xmcp.config.ts`
- **Transports**: Both HTTP and STDIO enabled
- **Build Output**: Generated in `dist/`

## MCP Integration

This server can be integrated with MCP clients like Claude Desktop and Cursor using the configuration provided in `.vscode/mcp.json` and the README.md file.