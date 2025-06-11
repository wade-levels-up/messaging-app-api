import { Request } from "express";
import { validationResult } from "express-validator";

export function handleValidationError(req: Request): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessageArray: string[] = [];
        let errorMessage: string;
        errors.array().forEach((error) => {
            errorMessageArray.push(error.msg);
        });
        errorMessage = errorMessageArray.join(", ");
        throw new Error(errorMessage);
    }
}