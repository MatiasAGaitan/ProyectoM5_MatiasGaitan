import { describe, expect, it } from "vitest"
import { ListIssuesTool } from "../../src/tools/listIssuesTool.js"
import { fakeGitHub } from "../mocks/github.mock.js"

describe("ListIssuesTool", () => {
    it("consulta los issues abiertos por defecto y devuelve el listado", async () => {
        const github = fakeGitHub()
        const tool = ListIssuesTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo"
        })

        expect(github.listIssues).toHaveBeenCalledTimes(1)

        expect(github.listIssues).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            state: "open",
            sort: "created",
            direction: "desc",
            per_page: 50
        })

        expect(result.isError).not.toBe(true)

        expect(result.structuredContent).toEqual({
            issues: []
        })
    })

    it("devuelve un error y no consulta GitHub si el estado es inválido", async () => {
        const github = fakeGitHub()
        const tool = ListIssuesTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo",
            state: "pending"
        })

        expect(result.isError).toBe(true)
        expect(github.listIssues).not.toHaveBeenCalled()
    })
})