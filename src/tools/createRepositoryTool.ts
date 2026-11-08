import type { McpTool } from "../types/index.js"
import type { GitHubOperations } from "../types/gitHubTypes.js"
import { CreateRepositorySchema, toJsonSchema } from "../schemas/index.js"
import { fromZodError, fail } from "../errors/index.js"

export function CreateRepositoryTool(github: GitHubOperations): McpTool {
    return {
        definition: {
            name: "create_repository",
            description: `
                        Crea un repositorio nuevo en la cuenta personal autenticada de GitHub.

                        Requiere name (3-100 caracteres, letras, números y guiones).
                        Opcionales: description, private (false = público, true = privado)
                        y auto_init (false = vacío, true = crea README).
                        
                        No requiere owner, se obtiene del token autenticado.
                        Esta operación escribe en GitHub.
                        NO usar para consultar, modificar o eliminar repositorios existentes,
                        ni para crear repositorios de organizaciones.
                        NO ejecutar si el usuario solo pide información o instrucciones.
                        `,
            inputSchema: toJsonSchema(CreateRepositorySchema)
        },

        async handler(args) {

            const parsed = CreateRepositorySchema.safeParse(args)

            if (!parsed.success) return fail("create_repository", fromZodError(parsed.error))

            try {

                const repository = await github.createRepository(parsed.data)

                const data = { repository }

                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data }

            } catch (err) {

                return fail("create_repository", err)

            }
        }
    }
}