import { default as jwt } from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

export function decodeAndAttachJWT(req: Request, res: Response, next:NextFunction): void {

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
     res.status(401).json({ message: "Authorization header missing" });
     return
  }

  const token = authHeader.split(" ")[1]; //
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
      (req as any).userId = (decoded as any).userId;
      next();
    } else {
      res.status(401).json({ message: "Invalid or expired token" });
    }

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}