import { z } from "zod"
import { owner, repo } from "./commonSchema.js"

export const CreateIssueSchema = z.object({
    owner,
    repo,
    title: z.string().trim().min(1, "El titulo es requerido").max(256, "El titulo debe tener menos de 256 caracteres").describe("Titulo del issue"),
    body: z.string().max(65_000, "El body es demasiado largo").optional().describe("Body de la issue"),
    labels: z.array(z.string().min(1)).max(10, "Maximo 10 Labels").optional().describe("Etiquetas que ya existen en el repositorio. Ejemplo: [\"bug\"]")
})

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>  