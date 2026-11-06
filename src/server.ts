import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import type { McpTool } from "./types/mcp_types.js"
import { ValidationError, fail } from "./errors/index.js"
import { logger } from "./utils/logging.js"

const INFO_SERVER = { name: "github-mcp-server", version: "1.0.0" }

const tools: McpTool[] = []

const server = new Server(INFO_SERVER, { capabilities: { tools: {} } })

server.setRequestHandler(ListToolsRequestSchema, async () => ({

    tools: tools.map((t) => t.definition)
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {

    const { name, arguments: args } = request.params

    const tool = tools.find((t) => t.definition.name === name)

    if (!tool) {
        return fail(name, new ValidationError(`La tool ${name} no existe. Las tools disponibles son ${tools.map((t) => t.definition.name).join(", ")}.`))
    }

    return tool.handler(args ?? {})
})

function resumirArgs(args: unknown): unknown {

    if (!args || typeof args != "object") return args

    return Object.fromEntries(
        Object.entries(args).map(([k, v]) => [k, typeof v === "string" && v.length > 80 ? v.slice(0, 80) + "…" : v])
    )
}

async function main() {

    await server.connect(new StdioServerTransport())

    logger.info("Server iniciado", { ...INFO_SERVER, tool: tools.map((t) => t.definition.name) })
}

main().catch((err) => {
    logger.error("El serviodr se pudo iniciar", { message: err instanceof Error ? err.message : String(err) })

    process.exit(1)
})


