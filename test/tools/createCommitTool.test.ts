import { describe, expect, it, vi } from "vitest"
import { CreateCommitTool } from "../../src/tools/createCommitTool.js"
import { AuthenticationError } from "../../src/errors/index.js"
import { fakeGitHub } from "../mocks/github.mock.js"

describe("CreateCommitTool", () => {
    it("utiliza la rama predeterminada cuando no se indica branch", async () => {
        const github = fakeGitHub()
        const tool = CreateCommitTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo",
            path: "a.md",
            content: "Contenido de prueba",
            message: "Agrega archivo de prueba"
        })

        expect(github.getRepository).toHaveBeenCalledTimes(1)
        expect(github.getRepository).toHaveBeenCalledWith("octocat", "demo")

        expect(github.createCommitWithFile).toHaveBeenCalledTimes(1)
        expect(github.createCommitWithFile).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            path: "a.md",
            content: "Contenido de prueba",
            message: "Agrega archivo de prueba",
            branch: "main"
        })

        expect(result.isError).not.toBe(true)

        expect(result.structuredContent).toEqual({
            commit: {
                commit_sha: "abc",
                commit_url: "https://github.com/octocat/demo/commit/abc",
                branch: "main",
                path: "a.md",
                file_url: "https://github.com/octocat/demo/blob/main/a.md"
            }
        })
    })

    it("devuelve un error y no crea el commit si falla la consulta del repositorio", async () => {
        const github = fakeGitHub()

        vi.mocked(github.getRepository)
            .mockRejectedValue(new AuthenticationError())

        const tool = CreateCommitTool(github)

        const result = await tool.handler({
            owner: "octocat",
            repo: "demo",
            path: "a.md",
            content: "Contenido de prueba",
            message: "Agrega archivo de prueba"
        })

        const content = result.content[0]

        if (!content || content.type !== "text") {
            throw new Error("Se esperaba un contenido de texto con el error")
        }

        const payload = JSON.parse(content.text)


        expect(github.getRepository).toHaveBeenCalledTimes(1)
        expect(github.getRepository).toHaveBeenCalledWith("octocat", "demo")

        expect(result.isError).toBe(true)
        expect(github.createCommitWithFile).not.toHaveBeenCalled()

        expect(payload).toMatchObject({
            code: "AUTH_ERROR",
            action: "ADD_CREDENTIALS",
            retryable: false
        })
    })
})