import { describe, expect, it } from "vitest"
import { CreateIssueSchema } from "../../src/schemas/createIssueSchema.js"

describe("CreateIssueSchema", () => {
    it("acepta los datos válidos de un issue y recorta el título", () => {
        const result = CreateIssueSchema.safeParse({
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            title: "  Documentar instalación  ",
            body: "Agregar los pasos al README"
        })

        expect(result.success).toBe(true)

        if (!result.success) {
            throw new Error("Se esperaba una entrada válida")
        }

        expect(result.data).toEqual({
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            title: "Documentar instalación",
            body: "Agregar los pasos al README"
        })
    })

    it("rechaza un título formado únicamente por espacios", () => {
        const result = CreateIssueSchema.safeParse({
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            title: "   "
        })

        expect(result.success).toBe(false)

    })
})