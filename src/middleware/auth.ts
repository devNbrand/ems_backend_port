import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../DB/dbconfig.js";

dotenv.config();
export const verifyToken:any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting the token from various sources
    const token =
      req.cookies.token || req.body.token || req.headers.authorization;
  
    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verifying the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as any) as any;
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });
      // Use 'as string' for type assertion
      req.user = payload; // Assign the decoded user to the request object
    } catch (error) {
      // Verification issue
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};
