import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { CreateCommitSchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function CreateCommitTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "create_commit",
            description: `
                        Crea o modifica un archivo de texto en un repositorio existente de GitHub mediante un commit.
                        Usar cuando el usuario solicite agregar un archivo o actualizar su contenido.

                        Requiere owner, repo, path, content y message.
                        Branch es opcional; por defecto utiliza la rama principal del repositorio.

                        IMPORTANTE: Si el archivo ya existe, reemplaza TODO su contenido.
                        Esta operación escribe directamente en GitHub y registra un commit.
                        NO usar para consultar archivos, crear repositorios, issues ni modificar varios archivos a la vez.
                        `,
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