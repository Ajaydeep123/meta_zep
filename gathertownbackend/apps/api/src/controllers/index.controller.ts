import type { Request, Response } from "express";
import {hashData, compareHash} from "../utils/hashHelper"
import { createToken } from "../utils/jwtHelper";
import {prisma} from "@repo/db"
import { asyncHandler } from "../utils/asyncHandler";

import { SigninSchema, SignupSchema } from "../validators/index.validator";


export const signup = asyncHandler(async (req: Request, res: Response) => {
    const signupData = SignupSchema.safeParse(req.body);

    if (!signupData.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed!",
        });
    }

    const hashedPassword = await hashData(signupData.data?.password);

    try {
        const user = await prisma.user.create({
            data: {
                username: signupData.data.username,
                password: hashedPassword,
                role: signupData.data.type === "admin" ? "Admin" : "User",
            },
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            userId: user.id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create the user!",
        });
    }
});

export const signin = asyncHandler(async( req:Request, res:Response)=> {
    const signinData = SigninSchema.safeParse(req.body)

    if(!signinData.success){
        return res.status(400).json({
            success: false,
            message: "Validation failed!",
        });
    }

    try {

        const user = await prisma.user.findUnique({
            where:{
                username:signinData.data?.username
            }
        })

        if(!user){
            return res.status(403).json({
                success:false,
                message:"User not found!"
            })
        }
        const isPasswordValid = await compareHash(signinData.data?.password, user.password)

        if(!isPasswordValid){
            return res.status(403).json({
                success:false,
                message: "Invalid password"})           
        }

        const token = createToken({
            userId:user.id,
            role:user.role
        })
        
        res.status(200).json({
            success:true,
            data:token,
            message:"User signed in"
        })

    } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Failed to sign in !",
        });
    }
})

