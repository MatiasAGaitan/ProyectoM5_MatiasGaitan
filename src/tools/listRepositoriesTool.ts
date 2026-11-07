import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../github/operations.js"
import { ListRepositoriesSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function ListRepositoriesTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "list_repositories",
            description: `
            Lista los repositorios del usuario dueño del token (usuario autenticado).
            Usala para descubrir que repos existen y obtener el owner y el nombre exacto
            antes de crear issues o commits. Solo Lectura. No lista repositorios de otros usuarios ni muestras issues.`,
            inputSchema: toJsonSchema(ListRepositoriesSchema)
        },

        async handler(args) {

            const parsed = ListRepositoriesSchema.safeParse(args)
            if (!parsed.success) return fail("list_repositories", fromZodError(parsed.error))

            try {

                const repositories = await github.listRepositories(parsed.data)

                const data = { count: repositories.length, repositories }

                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data }

            } catch (err) {
                return fail("list_repositories", err)
            }
        }
    }
}

