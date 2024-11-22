import type { Request, Response } from "express";
import {hashData, compareHash} from "../utils/hashHelper"
import { createToken } from "../utils/jwtHelper";
import {prisma} from "@repo/db"




export const signup = async (req : Request, res: Response) =>{
    const {username, password} = req.body;

    if(!(username || password)){
        return res.status(400).json({
            message:"Need all the credentials"
        })
    }

    const hashedPassword = await hashData(password);

    const createUser = await prisma.user.create({
        data:{
            username:username,
            password:hashedPassword,
            role:"Admin"
        }
    })

    if (createUser){
        return res.status(201).json({message:"user created",userId:createUser.id})
    }

    return res.status(401).json({message:"Failed to create the user"})
}

export const signin = async(req:Request, res:Response) =>{
    const {username, password} = req.body;

    if(!(username || password)){
        return res.status(400).json({
            message:"username or password is missing"
        })
    }

    const user = await prisma.user.findFirst({
        where:{
            username
        }
    })

    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    if(!(await compareHash(password,user.password))){
        return res.status(400).json({message:"Invalid password"})
    }

     const token = createToken({id:user.id})
    return res.status(200).json({token:token})
}
