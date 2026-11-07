export interface RepositoryDTO {
    full_name: string,
    owner: string,
    name: string,
    private: boolean,
    description: string | null,
    html_url: string
}

export interface IssueDTO {
    number: number,
    title: string,
    state: string,
    html_url: string,
    labels: string[]
}

export interface CommitDTO {
    commit_sha: string,
    commit_url: string,
    branch: string,
    file_url: string
}

export interface RepositoryInfo {
    full_name: string,
    default_branch: string,
    has_issues: boolean
}