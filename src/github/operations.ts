import type { Octokit } from "@octokit/rest"
import { AppError, GitHubAPIError, toAppError } from "../errors/index.js"
import type { ErrorContext } from "../types/errorTypes.js"
import { withRetry, DEFAULT_RETRY, type RetryOptions } from "../utils/retry.js"
import type { CommitDTO, IssueDTO, RepositoryDTO, RepositoryInfo } from "../types/dtosTypes.js"
import type { CreateIssueInput, ListRepositoriesInput } from "../schemas/index.js"

export interface GitHubOperations {
    listRepositories(input: ListRepositoriesInput): Promise<RepositoryDTO[]>
    createIssue(input: CreateIssueInput): Promise<IssueDTO>
    getRepository(owner: string, repo: string): Promise<RepositoryInfo>
}

const soloRateLimit = (err: AppError) => err.retryable && (err.status === 403 || err.status === 429)

export function createGitHubOperations(octokit: Octokit, retry: RetryOptions = DEFAULT_RETRY): GitHubOperations {

    function call<T>(ctx: ErrorContext, fn: () => Promise<T>, retryOn?: (err: AppError) => boolean): Promise<T> {

        return withRetry(fn, (raw) => toAppError(raw, ctx), retry, retryOn)
    }

    return {

        async listRepositories({ type, sort, per_page }) {

            const { data } = await call({ operation: "listar tus repositorios" }, () =>
                octokit.rest.repos.listForAuthenticatedUser({ type, sort, per_page })
            )

            return data.map((r) => ({

                full_name: r.full_name,
                owner: r.owner.login,
                name: r.name,
                private: r.private,
                description: r.description,
                html_url: r.html_url
            }))
        },

        async createIssue({ owner, repo, title, body, labels }) {

            const { data } = await call(
                { operation: "crear el issue", owner, repo },
                () => octokit.rest.issues.create({ owner, repo, title, ...(body ? { body } : {}), ...(labels ? { labels } : {}) }),
                soloRateLimit
            )

            return {

                number: data.number,
                title: data.title,
                state: data.state,
                html_url: data.html_url,
                labels: data.labels.map((l) => (typeof l === "string" ? l : (l.name ?? "")))
            }
        },

        async getRepository(owner, repo) {

            const { data } = await call({ operation: "consultar el repositorio", owner, repo }, () =>
                octokit.rest.repos.get({ owner, repo }),
            )
            return { full_name: data.full_name, default_branch: data.default_branch, has_issues: data.has_issues }
        }

    }
} 