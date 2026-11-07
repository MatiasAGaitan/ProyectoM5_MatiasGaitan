import { z } from "zod"

export const owner = z.string().trim().min(1, "owner es requerido").describe("Dueño del repositorio: usuario u organización de GitHub. Ej: octocat")

export const repo = z.string().trim().min(1, "repo es requerido").describe("Nombre del repositorio, sin el owner. Ej: Hello-World")


export function toJsonSchema(schema: z.ZodType): Record<string, unknown> {

    const { $schema: _ignorado, ...json } = z.toJSONSchema(schema, { io: "input" }) as Record<string, unknown>

    return json
}