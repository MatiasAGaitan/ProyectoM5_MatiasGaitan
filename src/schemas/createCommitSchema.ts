import { z } from "zod"
import { owner, repo } from "./commonSchema.js"

export const CreateCommitSchema = z.object({
    owner,
    repo,
    path: z.string().trim().min(1, "path es requerido").refine((p) => !p.startsWith("/"), "path no puede empezar con /").refine((p) => !p.split("/").includes(".."), "path no puede contener ..").describe("Ruta del archivo dentro del repo, sin / al inicio. Ej: docs/notas.md"),
    content: z.string().describe("Contenido COMPLETO del archivo (texto). Si el archivo existe, se reemplaza entero"),
    message: z.string().trim().min(1, "message es requerido").max(500).describe("Mensaje del commit. Ej: Agrega notas de la reunión"),
    branch: z.string().trim().min(1).optional().describe("Rama donde commitear. Si no se indica, se usa la rama principal del repo")
})

export interface CommitFileInput {
    owner: string;
    repo: string;
    branch: string;
    path: string;
    content: string;
    message: string;
}