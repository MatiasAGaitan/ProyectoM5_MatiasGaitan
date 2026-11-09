import { afterEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { AuthenticationError } from "../../src/errors/index.js"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("listRepositories", () => {
    it("devuelve una lista vacía cuando GitHub no devuelve repositorios", async () => {
        const octokit = new Octokit()

        const listMock = vi
            .spyOn(octokit.rest.repos, "listForAuthenticatedUser")
            .mockResolvedValue({
                status: 200,
                url: "https://api.github.com/user/repos",
                headers: {},
                data: []
            })

        const github = createGitHubOperations(octokit)

        const result = await github.listRepositories({
            type: "all",
            sort: "updated",
            per_page: 20
        })

        expect(result).toEqual([])

        expect(listMock).toHaveBeenCalledTimes(1)

        expect(listMock).toHaveBeenCalledWith({
            type: "all",
            sort: "updated",
            per_page: 20
        })
    })

    it("devuelve un AuthenticationError cuando GitHub rechaza las credenciales", async () => {
        const octokit = new Octokit()

        const listMock = vi
            .spyOn(octokit.rest.repos, "listForAuthenticatedUser")
            .mockRejectedValue({
                status: 401,
                message: "Bad credentials"
            })

        const github = createGitHubOperations(octokit)

        const result = github.listRepositories({
            type: "all",
            sort: "updated",
            per_page: 20
        })

        await expect(result).rejects.toBeInstanceOf(AuthenticationError)

        expect(listMock).toHaveBeenCalledTimes(1)
    })
})