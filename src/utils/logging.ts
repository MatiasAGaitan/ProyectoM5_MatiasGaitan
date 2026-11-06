export type Level = "debug" | "info" | "warn" | "error"

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }

function writeLog(level: Level, message: string, context: Record<string, unknown> = {}): void {

    const min = process.env.LOG_LEVEL ?? "info"

    if (min === "silent") return

    if (ORDER[level] < (ORDER[min as Level] ?? ORDER.info)) return

    const line = { ts: new Date().toISOString(), level, message, ...context }

    process.stderr.write(JSON.stringify(line) + "\n")
}

export const logger = {
    debug: (message: string, context?: Record<string, unknown>) => writeLog("debug", message, context),
    info: (message: string, context?: Record<string, unknown>) => writeLog("info", message, context),
    warn: (message: string, context?: Record<string, unknown>) => writeLog("warn", message, context),
    error: (message: string, context?: Record<string, unknown>) => writeLog("error", message, context)
}