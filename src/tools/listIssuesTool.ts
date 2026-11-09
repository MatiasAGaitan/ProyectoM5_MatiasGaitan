import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { ListIssuesSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function ListIssuesTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "list_issues",
            description: `
                        Lista los issues de un repositorio existente de GitHub.
                        Usar cuando el usuario solicite consultar, buscar o revisar issues.

                        Requiere owner y repo.
                        Opcionales: state (open, closed, all; default open),
                        sort (created, updated, comments; default created),
                        direction (asc, desc; default desc) y per_page (1-100; default 50).

                        Si no conocés el propietario o repositorio, utilizar list_repositories.
                        No inventar datos faltantes.

                        Esta operación es de SOLO LECTURA, no modifica GitHub.
                        NO usar para crear, modificar, comentar, cerrar o eliminar issues.
                        NO utilizar para listar repositorios ni pull requests.
                        `,
            inputSchema: toJsonSchema(ListIssuesSchema)
        },

        async handler(args) {

            const parsed = ListIssuesSchema.safeParse(args)

            if (!parsed.success) return fail("list_issues", fromZodError(parsed.error))

            try {

                const issues = await github.listIssues(parsed.data)

                const data = { issues }

                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data }

            } catch (err) {

                return fail("list_issues", err)

            }
        }
    }
}