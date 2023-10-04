import { NextFunction, Request, Response } from "express"
import CustomError from "./CustomError"

const serverErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "Something went wrong!",
    status_code: res.statusCode,
  })
}

export default serverErrorHandler
