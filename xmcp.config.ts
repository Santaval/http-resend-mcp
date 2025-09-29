import { XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    port: 4000,
    host: '0.0.0.0'
  }, // builds your app with the HTTP transport
  stdio: true, // builds your app with the STDIO transport
  paths: {
    tools: "src/tools",
    prompts: "src/prompts",
    resources: false, // disable resources directory
  },
};

export default config;