import { Request, Response } from "express"
import CustomError from "./CustomError"

const clientErrorHandler = (req: Request, res: Response) => {
  throw new CustomError(404, "Not found !")
}

export default clientErrorHandler
