import { describe, expect, it } from "vitest"
import { ListRepositoriesSchema } from "../../src/schemas/listRepositoriesSchema.js"

describe("ListRepositoriesSchema", () => {
    it("acepta parámetros vacíos y aplica los valores predeterminados", () => {
        const result = ListRepositoriesSchema.safeParse({})

        expect(result.success).toBe(true)

        if (!result.success) {
            throw new Error("Se esperaba una entrada válida")
        }

        expect(result.data).toEqual({
            type: "public",
            sort: "updated",
            per_page: 20
        })
    })

    it("rechaza un tamaño de página mayor a 50", () => {
        const result = ListRepositoriesSchema.safeParse({
            per_page: 51
        })

        expect(result.success).toBe(false)
    })
})