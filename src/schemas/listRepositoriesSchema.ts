import { z } from "zod"

export const ListRepositoriesSchema = z.object({

    type: z.enum(["all", "public", "private"]).default("public").describe("Que repositorios queremos listar?: todos, publicos o privados"),
    sort: z.enum(["created", "updated", "pushed", "full_name"]).default("updated").describe("Orden del listado de repositorios"),
    per_page: z.number().int().min(1).max(50).default(20).describe("Cantidad de repos a devolver (1 a 50) por paguina")
})

export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>