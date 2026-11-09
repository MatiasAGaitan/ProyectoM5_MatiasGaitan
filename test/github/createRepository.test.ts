import { afterEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { GitHubAPIError } from "../../src/errors/index.js"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("createRepository", () => {
    it("envía los datos de creación y devuelve el repositorio", async () => {
        const octokit = new Octokit()

        const createMock = vi
            .spyOn(octokit.rest.repos, "createForAuthenticatedUser")
            .mockImplementation(
                vi.fn().mockResolvedValue({
                    data: {
                        full_name: "octocat/demo",
                        owner: { login: "octocat" },
                        name: "demo",
                        private: true,
                        description: "Repositorio de prueba",
                        html_url: "https://github.com/octocat/demo"
                    }
                })
            )

        const github = createGitHubOperations(octokit)

        const input = {
            name: "demo",
            description: "Repositorio de prueba",
            private: true,
            auto_init: true
        }

        const result = await github.createRepository(input)

        expect(createMock).toHaveBeenCalledTimes(1)
        expect(createMock).toHaveBeenCalledWith(input)

        expect(result).toEqual({
            full_name: "octocat/demo",
            owner: "octocat",
            name: "demo",
            private: true,
            description: "Repositorio de prueba",
            html_url: "https://github.com/octocat/demo"
        })
    })

    it("devuelve un GitHubAPIError cuando GitHub rechaza la creación", async () => {
        const octokit = new Octokit()

        const createMock = vi
            .spyOn(octokit.rest.repos, "createForAuthenticatedUser")
            .mockRejectedValue({
                status: 422,
                message: "Validation Failed"
            })

        const github = createGitHubOperations(octokit)

        const result = github.createRepository({
            name: "demo",
            private: false,
            auto_init: true
        })

        await expect(result).rejects.toBeInstanceOf(GitHubAPIError)

        expect(createMock).toHaveBeenCalledTimes(1)
    })
})