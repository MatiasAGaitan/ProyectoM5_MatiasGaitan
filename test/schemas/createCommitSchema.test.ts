import { describe, expect, it } from "vitest"
import { CreateCommitSchema } from "../../src/schemas/createCommitSchema.js"

describe("CreateCommitSchema", () => {
    it("acepta un archivo válido sin indicar una rama", () => {
        const input = {
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            path: "docs/notas.md",
            content: "Primera prueba del servidor MCP",
            message: "Agrega notas de prueba"
        }

        const result = CreateCommitSchema.safeParse(input)

        expect(result.success).toBe(true)

        if (!result.success) {
            throw new Error("Se esperaba una entrada válida")
        }

        expect(result.data).toEqual(input)
        expect(result.data.branch).toBeUndefined()
    })

    it("rechaza al no tener repo", () => {
        const result = CreateCommitSchema.safeParse({
            owner: "usuario-ejemplo",
            repo: "",
            path: "docs/notas.md",
            content: "Contenido de prueba",
            message: "Agrega notas de prueba"
        })

        expect(result.success).toBe(false)
    })
})