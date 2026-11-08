import type { CommitDTO, IssueDTO, RepositoryDTO, RepositoryInfo } from "../types/index.js"
import type { CreateIssueInput, ListRepositoriesInput, CreateCommitInput, CreateRepositoryInput, ListIssuesInput } from "../schemas/index.js"

export interface GitHubOperations {
    listRepositories(input: ListRepositoriesInput): Promise<RepositoryDTO[]>
    createIssue(input: CreateIssueInput): Promise<IssueDTO>
    getRepository(owner: string, repo: string): Promise<RepositoryInfo>
    createCommitWithFile(input: CreateCommitInput): Promise<CommitDTO>
    createRepository(input: CreateRepositoryInput): Promise<RepositoryDTO>
    listIssues(input: ListIssuesInput): Promise<IssueDTO[]>
}