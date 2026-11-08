import { z } from "zod"

export const CreateRepositorySchema = z.object({
    name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre es demasiado largo, como maximo 100 caracteres").
        regex(/^[a-zA-Z0-9-]+$/, "El nombre del repositorio solo puede contener letras, numeros y guiones").describe("Es el nombre del repositorio, ejemplo: Mi-repositorio"),
    description: z.string().trim().max(350, "La descripcion es demasiado larga. Admite como maximo 350 caracteres").optional().describe("Es la descripcion del repositorio, de que se va a tratar y que tareas cumple"),
    private: z.boolean().default(false).describe("Define si va a ser un repositorio privado o publico. FALSE: PUBLICO, TRUE:PRIVADO "),
    auto_init: z.boolean().default(true).describe("Define si se va a crear un archivo README.md inicializado. FALSE: NO CREA EL README, TRUE: CREA EL README")
})


export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>