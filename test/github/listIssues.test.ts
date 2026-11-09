import { afterEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { GitHubAPIError } from "../../src/errors/index.js"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("listIssues", () => {
    it("devuelve los issues y excluye los pull requests", async () => {
        const octokit = new Octokit()

        const listMock = vi
            .spyOn(octokit.rest.issues, "listForRepo")
            .mockImplementation(
                vi.fn().mockResolvedValue({
                    data: [
                        {
                            number: 1,
                            title: "Bug",
                            state: "open",
                            html_url: "https://github.com/octocat/demo/issues/1",
                            labels: [{ name: "bug" }]
                        },
                        {
                            number: 2,
                            title: "Actualizar README",
                            pull_request: {
                                url: "https://api.github.com/repos/octocat/demo/pulls/2"
                            }
                        }
                    ]
                })
            )

        const github = createGitHubOperations(octokit)

        const input = {
            owner: "octocat",
            repo: "demo",
            state: "open" as const,
            sort: "created" as const,
            direction: "desc" as const,
            per_page: 50
        }

        const result = await github.listIssues(input)

        expect(listMock).toHaveBeenCalledTimes(1)
        expect(listMock).toHaveBeenCalledWith(input)

        expect(result).toEqual([
            {
                number: 1,
                title: "Bug",
                state: "open",
                html_url: "https://github.com/octocat/demo/issues/1",
                labels: ["bug"]
            }
        ])
    })

    it("devuelve un GitHubAPIError cuando GitHub deniega el acceso", async () => {
        const octokit = new Octokit()

        const listMock = vi
            .spyOn(octokit.rest.issues, "listForRepo")
            .mockRejectedValue({
                status: 403,
                message: "Forbidden"
            })

        const github = createGitHubOperations(octokit)

        const result = github.listIssues({
            owner: "octocat",
            repo: "demo",
            state: "open",
            sort: "created",
            direction: "desc",
            per_page: 50
        })

        await expect(result).rejects.toBeInstanceOf(GitHubAPIError)

        expect(listMock).toHaveBeenCalledTimes(1)
    })
})