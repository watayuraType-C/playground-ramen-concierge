// src/lib/CustomError.ts
export class CustomError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string
  ) {
    super(message);
    this.name = "CustomError";
  }
}