import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Octokit } from "@octokit/rest"
import { createGitHubOperations } from "../../src/github/operations.js"
import { GitHubAPIError } from "../../src/errors/index.js"

let octokit: Octokit

beforeEach(() => {
    octokit = new Octokit()

    vi.spyOn(octokit.rest.git, "getRef").mockImplementation(
        vi.fn().mockResolvedValue({
            data: {
                object: { sha: "commit-base" }
            }
        })
    )

    vi.spyOn(octokit.rest.git, "getCommit").mockImplementation(
        vi.fn().mockResolvedValue({
            data: {
                tree: { sha: "tree-base" }
            }
        })
    )

    vi.spyOn(octokit.rest.git, "createBlob").mockImplementation(
        vi.fn().mockResolvedValue({
            data: { sha: "blob-nuevo" }
        })
    )

    vi.spyOn(octokit.rest.git, "createTree").mockImplementation(
        vi.fn().mockResolvedValue({
            data: { sha: "tree-nuevo" }
        })
    )

    vi.spyOn(octokit.rest.git, "createCommit").mockImplementation(
        vi.fn().mockResolvedValue({
            data: {
                sha: "commit-nuevo",
                html_url: "https://github.com/octocat/demo/commit/commit-nuevo"
            }
        })
    )

    vi.spyOn(octokit.rest.git, "updateRef").mockImplementation(
        vi.fn().mockResolvedValue({})
    )
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("createCommitWithFile", () => {
    it("crea los objetos Git y actualiza la rama sin forzar", async () => {
        const github = createGitHubOperations(octokit)

        const result = await github.createCommitWithFile({
            owner: "octocat",
            repo: "demo",
            branch: "main",
            path: "a.md",
            content: "Hola",
            message: "Agrega archivo"
        })

        expect(octokit.rest.git.getRef).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            ref: "heads/main"
        })

        expect(octokit.rest.git.getCommit).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            commit_sha: "commit-base"
        })

        expect(octokit.rest.git.createBlob).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            content: "SG9sYQ==",
            encoding: "base64"
        })

        expect(octokit.rest.git.createTree).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            base_tree: "tree-base",
            tree: [
                {
                    path: "a.md",
                    mode: "100644",
                    type: "blob",
                    sha: "blob-nuevo"
                }
            ]
        })

        expect(octokit.rest.git.createCommit).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            message: "Agrega archivo",
            tree: "tree-nuevo",
            parents: ["commit-base"]
        })

        expect(octokit.rest.git.updateRef).toHaveBeenCalledWith({
            owner: "octocat",
            repo: "demo",
            ref: "heads/main",
            sha: "commit-nuevo",
            force: false
        })

        expect(result).toEqual({
            commit_sha: "commit-nuevo",
            commit_url: "https://github.com/octocat/demo/commit/commit-nuevo",
            branch: "main",
            path: "a.md",
            file_url: "https://github.com/octocat/demo/blob/main/a.md"
        })
    })

    it("devuelve un error y detiene el flujo si la rama no existe", async () => {
        vi.mocked(octokit.rest.git.getRef).mockRejectedValue({
            status: 404,
            message: "Not Found"
        })

        const github = createGitHubOperations(octokit)

        const result = github.createCommitWithFile({
            owner: "octocat",
            repo: "demo",
            branch: "main",
            path: "a.md",
            content: "Hola",
            message: "Agrega archivo"
        })

        await expect(result).rejects.toBeInstanceOf(GitHubAPIError)

        expect(octokit.rest.git.getRef).toHaveBeenCalledTimes(1)
        expect(octokit.rest.git.getCommit).not.toHaveBeenCalled()
        expect(octokit.rest.git.createBlob).not.toHaveBeenCalled()
        expect(octokit.rest.git.createTree).not.toHaveBeenCalled()
        expect(octokit.rest.git.createCommit).not.toHaveBeenCalled()
        expect(octokit.rest.git.updateRef).not.toHaveBeenCalled()
    })
})