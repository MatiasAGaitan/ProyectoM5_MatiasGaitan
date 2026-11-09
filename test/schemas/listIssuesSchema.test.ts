import { describe, expect, it } from "vitest"
import { ListIssuesSchema } from "../../src/schemas/listIssuesSchema.js"

describe("ListIssuesSchema", () => {
    it("acepta un repositorio y aplica los filtros predeterminados", () => {
        const result = ListIssuesSchema.safeParse({
            owner: "usuario-ejemplo",
            repo: "demo-mcp"
        })

        expect(result.success).toBe(true)

        if (!result.success) {
            throw new Error("Se esperaba una entrada válida")
        }

        expect(result.data).toEqual({
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            state: "open",
            sort: "created",
            direction: "desc",
            per_page: 50
        })
    })

    it("rechaza un estado que no pertenece a los valores permitidos", () => {
        const result = ListIssuesSchema.safeParse({
            owner: "usuario-ejemplo",
            repo: "demo-mcp",
            state: "pending"
        })

        expect(result.success).toBe(false)
    })
})