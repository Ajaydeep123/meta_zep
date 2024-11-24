import { verifyToken } from "../utils/jwtHelper";
import { NextFunction, Request, Response } from "express";


export const userMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Missing or invalid authorization header" });
    }
    
    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token as string)

        if(!decoded){
            return res.status(403).json({ 
                success:false,
                message: "Something went wrong" 
            });
        }
        req.role = decoded.role;
        req.userId = decoded.userId;    
        next()    
    } catch (error) {
        return res.status(403).json({
            success:false,
            message: "Invalid or expired token" });        
    }
}