import { AppError } from "../errors/index.js"
import { logger } from "./logging.js"

export interface RetryOptions {
    maxRetries: number
    baseDelayMs: number
    maxDelayMs: number
}

export const DEFAULT_RETRY: RetryOptions = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10_000
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function withRetry<T>(

    fn: () => Promise<T>,
    toError: (err: unknown) => AppError,
    opts: RetryOptions = DEFAULT_RETRY,
    retryOn: (err: AppError) => boolean = (err) => err.retryable

): Promise<T> {

    for (let attempt = 0; ; attempt++) {
        try {

            return await fn()

        } catch (raw) {

            const err = toError(raw)

            if (!retryOn(err) || attempt >= opts.maxRetries) throw err

            const retryAfter = Number(err.details?.["retryAfter"])

            const reset = Number(err.details?.["reset"])

            const backoff = Math.min(
                opts.baseDelayMs * 2 ** attempt,
                opts.maxDelayMs
            )

            const resetDelayMs = reset * 1000 - Date.now()

            let waitMs = backoff

            if (Number.isFinite(retryAfter) && retryAfter > 0) {
                waitMs = Math.max(backoff, retryAfter * 1000)
            } else if (Number.isFinite(resetDelayMs) && resetDelayMs > 0) {
                waitMs = Math.max(backoff, resetDelayMs)
            }

            logger.warn("reintentando request", { attempt: attempt + 1, waitMs, code: err.code, status: err.status })

            await sleep(waitMs)
        }
    }
} 