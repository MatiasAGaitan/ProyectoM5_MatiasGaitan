import { describe, expect, it, vi } from "vitest"
import { CreateIssueTool } from "../../src/tools/createIssuesTool.js"
import { fakeGitHub } from "../mocks/github.mock.js"

describe("CreateIssueTool", () => {
    it("consulta el repositorio y solicita crear el issue si están habilitados", async () => {
        const github = fakeGitHub()
        const tool = CreateIssueTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo",
            title: "Bug"
        })

        expect(github.getRepository).toHaveBeenCalledTimes(1)
        expect(github.getRepository).toHaveBeenCalledWith("octocat", "demo")

        expect(github.createIssue).toHaveBeenCalledTimes(1)
        expect(github.createIssue).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            title: "Bug"
        })

        expect(result.isError).not.toBe(true)

        expect(result.structuredContent).toEqual({
            issue: {
                number: 1,
                title: "Bug",
                state: "open",
                html_url: "https://github.com/octocat/demo/issues/1",
                labels: []
            }
        })
    })

    it("devuelve un error y no crea el issue si están deshabilitados", async () => {
        const github = fakeGitHub()

        vi.mocked(github.getRepository).mockResolvedValue({
            full_name: "octocat/demo",
            default_branch: "main",
            has_issues: false
        })

        const tool = CreateIssueTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo",
            title: "Bug"
        })

        expect(github.getRepository).toHaveBeenCalledWith("octocat", "demo")
        expect(result.isError).toBe(true)
        expect(github.createIssue).not.toHaveBeenCalled()
    })
})