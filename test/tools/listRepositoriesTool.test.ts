import { describe, expect, it } from "vitest"
import { ListRepositoriesTool } from "../../src/tools/listRepositoriesTool.js"
import { fakeGitHub } from "../mocks/github.mock.js"

describe("ListRepositoriesTool", () => {
    it("consulta con los filtros predeterminados y devuelve el listado", async () => {
        const github = fakeGitHub()
        const tool = ListRepositoriesTool(github)

        const result = await tool.handler({})

        expect(github.listRepositories).toHaveBeenCalledTimes(1)

        expect(github.listRepositories).toHaveBeenCalledWith({
            type: "public",
            sort: "updated",
            per_page: 20
        })

        expect(result.isError).not.toBe(true)

        expect(result.structuredContent).toEqual({
            count: 0,
            repositories: []
        })
    })

    it("devuelve un error y no consulta GitHub si per_page supera el máximo", async () => {
        const github = fakeGitHub()
        const tool = ListRepositoriesTool(github)

        const result = await tool.handler({
            per_page: 51
        })

        expect(result.isError).toBe(true)
        expect(github.listRepositories).not.toHaveBeenCalled()
    })
})