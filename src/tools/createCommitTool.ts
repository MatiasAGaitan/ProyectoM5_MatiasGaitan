import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { CreateCommitSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function CreateCommitTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "create_commit",
            description: `
            Crea o modifica un único archivo de texto en un repositorio de GitHub mediante un commit, 
            por ejemplo README.md o docs/notas.md. Si el archivo ya existe, reemplaza completamente su contenido por el nuevo.
            Requiere owner, repo, path, content y message; branch es opcional y, si no se especifica, utiliza la rama principal del repositorio.
            Los cambios se guardan en GitHub y quedan registrados en el historial de commits. No sirve para crear issues ni repositorios.`,
            inputSchema: toJsonSchema(CreateCommitSchema)
        },

        async handler(args) {

            const parsed = CreateCommitSchema.safeParse(args)

            if (!parsed.success) return fail("create_commit", fromZodError(parsed.error))

            const { owner, repo, branch } = parsed.data

            try {

                const info = await github.getRepository(owner, repo)

                const commit = await github.createCommitWithFile({ ...parsed.data, branch: branch ?? info.default_branch })

                const data = { commit }

                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data }

            } catch (err) {

                return fail("create_commit", err)

            }
        }
    }
}