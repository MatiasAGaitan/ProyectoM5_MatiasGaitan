import { describe, expect, it } from "vitest"
import { CreateRepositorySchema } from "../../src/schemas/createRepositorySchema.js"

describe("CreateRepositorySchema", () => {
    it("acepta un nombre válido y aplica los valores predeterminados", () => {
        const result = CreateRepositorySchema.safeParse({
            name: "demo-mcp"
        })

        expect(result.success).toBe(true)

        if (!result.success) {
            throw new Error("Se esperaba una entrada válida")
        }

        expect(result.data).toEqual({
            name: "demo-mcp",
            private: false,
            auto_init: true
        })
    })

    it("rechaza un nombre con menos de 3 caracteres", () => {
        const result = CreateRepositorySchema.safeParse({
            name: "ab"
        })

        expect(result.success).toBe(false)
    })
})