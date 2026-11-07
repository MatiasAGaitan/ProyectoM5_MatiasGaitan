import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface McpTool {
    definition: {
        name: string,
        description: string,
        inputSchema: Record<string, unknown>
    }

    handler: (args: unknown) => Promise<CallToolResult>
}

