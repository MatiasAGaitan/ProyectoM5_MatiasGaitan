import { z } from "zod"

import { owner, repo } from "./commonSchema.js"

export const ListIssuesSchema = z.object({
    owner,
    repo,
    state: z.enum(["open", "closed", "all"]).default("open").describe("Filtra issues por estado: open (abiertos), closed (cerrados) o all (todos)"),
    sort: z.enum(["created", "updated", "comments"]).default("created").describe("Ordenar por fecha de creación (created), actualización (updated) o cantidad de comentarios (comments)"),
    direction: z.enum(["asc", "desc"]).default("desc").describe("Dirección del orden: asc (ascendente) o desc (descendente)"),
    per_page: z.number().int().min(1).max(100).default(50).describe("Cantidad de issues que se van a mostrar por pagina")
})

export type ListIssuesInput = z.infer<typeof ListIssuesSchema>