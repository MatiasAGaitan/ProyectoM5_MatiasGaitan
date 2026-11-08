import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { CreateIssueSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, GitHubAPIError, fail } from "../errors/index.js"

export function CreateIssueTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "create_issue",
            description: `
                        Crea y publica un issue nuevo en un repositorio existente de GitHub.
                        Usar para reportar bugs, solicitar mejoras o registrar tareas pendientes.
                        
                        Requiere owner, repo y title. Body es opcional.
                        Si no conocés el repositorio o propietario, utilizar list_repositories.
                        No inventar datos faltantes.

                        Esta operación escribe en GitHub.
                        NO usar para listar, modificar, comentar o cerrar issues existentes.
                        NO crear issues duplicados.
                            `,
            inputSchema: toJsonSchema(CreateIssueSchema)
        },

        async handler(args) {

            const parsed = CreateIssueSchema.safeParse(args)

            if (!parsed.success) return fail("create_issue", fromZodError(parsed.error))

            const { owner, repo } = parsed.data

            try {

                const info = await github.getRepository(owner, repo)

                if (!info.has_issues) {
                    throw new GitHubAPIError(`El repositorio ${owner}/${repo} tiene los issues desactivados`, {
                        hint: "Activalos en GitHub: Settings -> General -> Features -> Issues"
                    })
                }

                const issue = await github.createIssue(parsed.data)

                const data = { issue }

                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data }

            } catch (err) {

                return fail("create_issue", err)
            }
        }
    }
}