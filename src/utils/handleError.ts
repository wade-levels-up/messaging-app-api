export function handleControllerError(error: unknown): never {
    if (error instanceof Error) {
        throw new Error(error.message);
    } else {
        throw new Error(String(error));
    }
}