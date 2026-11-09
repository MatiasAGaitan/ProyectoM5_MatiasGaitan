import { describe, expect, it } from "vitest"
import { fromZodError, ValidationError } from "../../src/errors/index.js"

describe("fromZodError", () => {
    it("convierte un problema de campo en un ValidationError", () => {
        const error = {
            issues: [
                {
                    path: ["title"],
                    message: "El titulo es requerido"
                }
            ]
        }

        const result = fromZodError(error)

        expect(result).toBeInstanceOf(ValidationError)

        expect(result.details).toEqual({
            issues: [
                {
                    path: "title",
                    message: "El titulo es requerido"
                }
            ]
        })

        expect(result.message).toBe(
            "Input inválido: title: El titulo es requerido. No se llamó a GitHub."
        )
    })

    it("identifica como input un problema sin ruta de campo", () => {
        const error = {
            issues: [
                {
                    path: [],
                    message: "La entrada debe ser un objeto"
                }
            ]
        }

        const result = fromZodError(error)

        expect(result.details).toEqual({
            issues: [
                {
                    path: "input",
                    message: "La entrada debe ser un objeto"
                }
            ]
        })

        expect(result.message).toBe(
            "Input inválido: input: La entrada debe ser un objeto. No se llamó a GitHub."
        )
    })
})