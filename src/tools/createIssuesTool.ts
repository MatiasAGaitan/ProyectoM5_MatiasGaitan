import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../github/operations.js"
import { CreateIssueSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, GitHubAPIError, fail } from "../errors/index.js"

export function CreateIssueTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "create_issue",
            description: `
            Crea un Issue nuevo en un repositorio de GitHub, requiere owner, repo y title.
            Si no sabes el owner o el nombre exacto de repositorio utilia list_repositories.
            Escribe en GitHuby, el issue queda publicado, no sirve para modificar ni cerrar issues existentes`,
            inputSchema: toJsonSchema(CreateIssueSchema)
        },

        async handler(args) {

            const parsed = CreateIssueSchema.safeParse(args)

            if (!parsed.success) return fail("create_issue", fromZodError(parsed.error))

            const { owner, repo } = parsed.data

            try {

                const info = await github.getRepository(owner, repo)

                if (!info.has_issues) {
                    throw new GitHubAPIError(`El repositorio ${owner}/${repo} tiene los issues descativados`, {
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