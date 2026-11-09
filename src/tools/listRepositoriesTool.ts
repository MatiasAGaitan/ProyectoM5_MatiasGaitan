import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { ListRepositoriesSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function ListRepositoriesTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "list_repositories",
            description: `
                            Lista los repositorios accesibles del usuario autenticado en GitHub.
                            Usar para consultar repositorios y obtener su owner y nombre exacto
                            antes de crear issues, commits u otras operaciones.

                            Esta operación es de SOLO LECTURA, no modifica GitHub.
                            NO usar para crear, modificar o eliminar repositorios,
                            ni para listar issues o archivos.
                            `,
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

