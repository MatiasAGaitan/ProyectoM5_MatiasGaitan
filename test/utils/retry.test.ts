import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { withRetry } from "../../src/utils/retry.js"
import { GitHubAPIError, NetworkError } from "../../src/errors/index.js"

beforeEach(() => {
    vi.useFakeTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("withRetry", () => {
    const options = {
        maxRetries: 1,
        baseDelayMs: 1000,
        maxDelayMs: 10_000
    }

    it("devuelve el resultado cuando la operación funciona en el reintento", async () => {
        const error = new NetworkError()

        const operation = vi.fn()
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce("Resultado correcto")

        const result = withRetry(operation, () => error, options)

        await vi.advanceTimersByTimeAsync(1000)

        expect(await result).toBe("Resultado correcto")
        expect(operation).toHaveBeenCalledTimes(2)
    })

    it("devuelve el error cuando se agotan los reintentos", async () => {
        const error = new NetworkError()

        const operation = vi.fn().mockRejectedValue(error)

        const result = withRetry(operation, () => error, options)

        const rejection = expect(result).rejects.toBe(error)

        await vi.advanceTimersByTimeAsync(1000)

        await rejection
        expect(operation).toHaveBeenCalledTimes(2)
    })

    it("respeta retryAfter aunque supere el máximo del backoff", async () => {
        const error = new GitHubAPIError("Rate limit alcanzado", {
            status: 429,
            retryable: true,
            hint: "Esperar antes de reintentar",
            details: {
                retryAfter: 60
            }
        })

        const operation = vi.fn()
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce("Resultado correcto")

        const result = withRetry(operation, () => error, options)

        await vi.advanceTimersByTimeAsync(10_000)

        expect(operation).toHaveBeenCalledTimes(1)

        await vi.advanceTimersByTimeAsync(49_000)

        expect(operation).toHaveBeenCalledTimes(1)

        await vi.advanceTimersByTimeAsync(1000)

        expect(await result).toBe("Resultado correcto")
        expect(operation).toHaveBeenCalledTimes(2)
    })
})