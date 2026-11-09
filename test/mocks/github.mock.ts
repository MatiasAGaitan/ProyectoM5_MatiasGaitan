import { vi } from "vitest"
import type { GitHubOperations } from "../../src/types/gitHubTypes.js"

export function fakeGitHub(
    overrides: Partial<GitHubOperations> = {}
): GitHubOperations {
    return {
        listRepositories: vi.fn<GitHubOperations["listRepositories"]>()
            .mockResolvedValue([]),

        getRepository: vi.fn<GitHubOperations["getRepository"]>()
            .mockResolvedValue({
                full_name: "octocat/demo",
                default_branch: "main",
                has_issues: true
            }),

        createIssue: vi.fn<GitHubOperations["createIssue"]>()
            .mockResolvedValue({
                number: 1,
                title: "Bug",
                state: "open",
                html_url: "https://github.com/octocat/demo/issues/1",
                labels: []
            }),

        createCommitWithFile: vi.fn<GitHubOperations["createCommitWithFile"]>()
            .mockResolvedValue({
                commit_sha: "abc",
                commit_url: "https://github.com/octocat/demo/commit/abc",
                branch: "main",
                path: "a.md",
                file_url: "https://github.com/octocat/demo/blob/main/a.md"
            }),

        createRepository: vi.fn<GitHubOperations["createRepository"]>()
            .mockResolvedValue({
                full_name: "octocat/demo",
                owner: "octocat",
                name: "demo",
                private: false,
                description: null,
                html_url: "https://github.com/octocat/demo"
            }),

        listIssues: vi.fn<GitHubOperations["listIssues"]>()
            .mockResolvedValue([]),

        ...overrides
    }
}