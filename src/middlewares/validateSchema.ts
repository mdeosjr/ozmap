import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { STATUS_CODE } from "../errors/AppError";

export class SchemaValidation {
  public static validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError)
          res
            .status(STATUS_CODE.UNPROCESSABLE_ENTITY)
            .json({ error: error.errors });
        else
          res
            .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
      }
    };
  }
}
