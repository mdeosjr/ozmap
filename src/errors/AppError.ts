export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: STATUS_CODE,
  ) {
    super(message);
    this.name = "AppError";
  }
}
