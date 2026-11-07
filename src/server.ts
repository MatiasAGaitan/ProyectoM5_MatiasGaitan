import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import type { McpTool } from "./types/index.js"
import { ValidationError, fail } from "./errors/index.js"
import { logger } from "./utils/logging.js"
import { createOctokit } from "./github/client.js"
import { createGitHubOperations } from "./github/operations.js"
import { ListRepositoriesTool, CreateIssueTool, CreateCommitTool } from "./tools/index.js"


const INFO_SERVER = { name: "github-mcp-server", version: "1.0.0" }

const github = createGitHubOperations(createOctokit())

const tools: McpTool[] = [

    ListRepositoriesTool(github),
    CreateIssueTool(github),
    CreateCommitTool(github)
]

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

async function main() {

    if (!process.env.GITHUB_TOKEN) {
        logger.warn("GITHUB_TOKEN no esta configurado. Revisa el archivo .env")
    }

    await server.connect(new StdioServerTransport())

    logger.info("Server iniciado", { ...INFO_SERVER, tool: tools.map((t) => t.definition.name) })
}

main().catch((err) => {

    logger.error("El serviodr se pudo iniciar", { message: err instanceof Error ? err.message : String(err) })

    process.exit(1)
})


