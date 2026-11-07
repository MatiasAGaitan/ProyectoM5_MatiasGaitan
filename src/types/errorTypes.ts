export type ErrorCode = "VALIDATION_ERROR" | "AUTH_ERROR" | "GITHUB_API_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR"

export type ErrorAction = "FIX_INPUT" | "ADD_CREDENTIALS" | "WAIT_AND_RETRY" | "CHECK_RESOURCE" | "CONTACT_SUPPORT"

export interface AppErrorOptions {
    code: ErrorCode,
    message: string,
    action: ErrorAction,
    hint: string,
    status?: number,
    retryable?: boolean,
    details?: Record<string, unknown>
}

export interface ErrorContext {
    operation: string,
    owner?: string,
    repo?: string,
    branch?: string
}



export interface OctokitLikeError {
    status?: number,
    message?: string,
    response?: {
        headers?: Record<string, string | number | undefined>
        data?: { message?: string; errors?: unknown }
    }
}

export interface ToolErrorPayload {
    code: ErrorCode,
    message: string,
    retryable: boolean,
    action: ErrorAction,
    hint: string,
    details?: Record<string, unknown>
}