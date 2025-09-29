# HTTP Resend MCP Server

A Model Context Protocol (MCP) server built with [xMCP](https://xmcp.dev) and TypeScript, designed to provide AI tools for HTTP operations and email sending via Resend.

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ (required for compatibility)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
http-resend-mcp/
├── src/
│   ├── tools/          # Tool files (auto-discovered)
│   │   └── greet.ts    # Example greeting tool
│   ├── prompts/        # Prompt files (auto-discovered)
│   │   └── review-code.ts # Example code review prompt
│   └── middleware.ts   # Middleware for HTTP transport (optional)
├── dist/               # Built output (generated)
├── .vscode/
│   └── mcp.json       # MCP server configuration for VS Code
├── package.json
├── tsconfig.json
└── xmcp.config.ts     # xMCP configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production  
- `npm run start:stdio` - Start built STDIO server
- `npm run start:http` - Start built HTTP server

## 🔧 Configuration

### MCP Server Configuration

The MCP server can be configured in `.vscode/mcp.json`:

```json
{
  "servers": {
    "http-resend-mcp": {
      "type": "stdio",
      "command": "node", 
      "args": ["dist/stdio.js"]
    }
  }
}
```

### xMCP Configuration

Configure xMCP settings in `xmcp.config.ts`:

```typescript
import { XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: true,  // Enable HTTP transport
  stdio: true, // Enable STDIO transport
  paths: {
    tools: "src/tools",
    prompts: "src/prompts", 
    resources: false, // Disabled for this project
  },
};

export default config;
```

## 🔌 Using with MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "http-resend-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/http-resend-mcp/dist/stdio.js"]
    }
  }
}
```

### Cursor

For HTTP transport with Cursor:

```json
{
  "mcpServers": {
    "http-resend-mcp": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## 🧪 Development

### Adding New Tools

Create a new tool in `src/tools/`:

```typescript
import { z } from "zod";
import { type InferSchema } from "xmcp";

export const schema = {
  param: z.string().describe("Parameter description"),
};

export const metadata = {
  name: "tool-name",
  description: "Tool description",
  annotations: {
    title: "Tool Title",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function toolName({ param }: InferSchema<typeof schema>) {
  // Tool implementation
  return `Result: ${param}`;
}
```

### Adding New Prompts

Create a new prompt in `src/prompts/`:

```typescript
import { z } from "zod";
import { type InferSchema, type PromptMetadata } from "xmcp";

export const schema = {
  input: z.string().describe("Input description"),
};

export const metadata: PromptMetadata = {
  name: "prompt-name",
  title: "Prompt Title",
  description: "Prompt description",
  role: "user",
};

export default function promptName({ input }: InferSchema<typeof schema>) {
  return `Prompt text with ${input}`;
}
```

## 🐛 Debugging

You can debug this MCP server using VS Code:

1. Build the project: `npm run build`
2. The MCP configuration is already set up in `.vscode/mcp.json`
3. Use VS Code's debugger to step through your code

## 📝 Notes

- This project requires Node.js 22+ for proper compatibility with xMCP
- The development server may show some webpack warnings but builds successfully
- Both HTTP and STDIO transports are supported
- Tools and prompts are automatically discovered from their respective directories

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.