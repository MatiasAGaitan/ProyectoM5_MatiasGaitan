import { afterEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { GitHubAPIError } from "../../src/errors/index.js"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("getRepository", () => {
    it("consulta el repositorio y devuelve sus datos principales", async () => {
        const octokit = new Octokit()

        const getMock = vi
            .spyOn(octokit.rest.repos, "get")
            .mockImplementation(
                vi.fn().mockResolvedValue({
                    data: {
                        full_name: "octocat/demo",
                        default_branch: "main",
                        has_issues: true
                    }
                })
            )

        const github = createGitHubOperations(octokit)

        const result = await github.getRepository("octocat", "demo")

        expect(getMock).toHaveBeenCalledTimes(1)

        expect(getMock).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo"
        })

        expect(result).toEqual({
            full_name: "octocat/demo",
            default_branch: "main",
            has_issues: true
        })
    })

    it("devuelve un GitHubAPIError cuando el repositorio no se encuentra", async () => {
        const octokit = new Octokit()

        const getMock = vi
            .spyOn(octokit.rest.repos, "get")
            .mockRejectedValue({
                status: 404,
                message: "Not Found"
            })

        const github = createGitHubOperations(octokit)

        const result = github.getRepository("octocat", "demo")

        await expect(result).rejects.toBeInstanceOf(GitHubAPIError)

        expect(getMock).toHaveBeenCalledTimes(1)
    })
})