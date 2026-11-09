import { afterEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { AuthenticationError } from "../../src/errors/index.js"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("createIssue", () => {
    it("envía los datos del issue y transforma la respuesta", async () => {
        const octokit = new Octokit()

        const createMock = vi
            .spyOn(octokit.rest.issues, "create")
            .mockImplementation(
                vi.fn().mockResolvedValue({
                    data: {
                        number: 1,
                        title: "Bug",
                        state: "open",
                        html_url: "https://github.com/octocat/demo/issues/1",
                        labels: [{ name: "bug" }]
                    }
                })
            )

        const github = createGitHubOperations(octokit)

        const input = {
            owner: "octocat",
            repo: "demo",
            title: "Bug",
            body: "Descripción del problema",
            labels: ["bug"]
        }

        const result = await github.createIssue(input)

        expect(createMock).toHaveBeenCalledTimes(1)
        expect(createMock).toHaveBeenCalledWith(input)

        expect(result).toEqual({
            number: 1,
            title: "Bug",
            state: "open",
            html_url: "https://github.com/octocat/demo/issues/1",
            labels: ["bug"]
        })
    })

    it("devuelve un AuthenticationError cuando las credenciales son rechazadas", async () => {
        const octokit = new Octokit()

        const createMock = vi
            .spyOn(octokit.rest.issues, "create")
            .mockRejectedValue({
                status: 401,
                message: "Bad credentials"
            })

        const github = createGitHubOperations(octokit)

        const result = github.createIssue({
            owner: "octocat",
            repo: "demo",
            title: "Bug"
        })

        await expect(result).rejects.toBeInstanceOf(AuthenticationError)

        expect(createMock).toHaveBeenCalledTimes(1)
    })
})