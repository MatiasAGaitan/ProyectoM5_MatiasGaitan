import { describe, expect, it } from "vitest"
import { CreateRepositoryTool } from "../../src/tools/createRepositoryTool.js"
import { fakeGitHub } from "../mocks/github.mock.js"

describe("CreateRepositoryTool", () => {
    it("solicita crear el repositorio con los valores predeterminados y devuelve sus datos", async () => {
        const github = fakeGitHub()
        const tool = CreateRepositoryTool(github)

        const result = await tool.handler({
            name: "demo"
        })

        expect(github.createRepository).toHaveBeenCalledTimes(1)

        expect(github.createRepository).toHaveBeenCalledWith({
            name: "demo",
            private: false,
            auto_init: true
        })

        expect(result.isError).not.toBe(true)

        expect(result.structuredContent).toEqual({
            repository: {
                full_name: "octocat/demo",
                owner: "octocat",
                name: "demo",
                private: false,
                description: null,
                html_url: "https://github.com/octocat/demo"
            }
        })
    })

    it("devuelve un error y no solicita crear el repositorio si el nombre es inválido", async () => {
        const github = fakeGitHub()
        const tool = CreateRepositoryTool(github)

        const result = await tool.handler({
            name: "ab"
        })

        expect(result.isError).toBe(true)
        expect(github.createRepository).not.toHaveBeenCalled()
    })
})