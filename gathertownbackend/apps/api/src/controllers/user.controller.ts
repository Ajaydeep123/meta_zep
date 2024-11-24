import { Request, Response } from "express";
import { UpdateMetadataSchema } from "../validators/user.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "@repo/db";


export const bulkmetadata = asyncHandler(async (req:Request, res:Response)=>{
    const userIdQueryString = (req.query.ids ?? "[]") as string;
    let userIds: string[] = [];
    try {
    userIds = (userIdQueryString).slice(1, userIdQueryString?.length - 1).split(",");
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameter format for 'ids'. It should be a valid JSON array."
        });
    }

    if (userIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Missing or empty 'ids' query parameter."
        });
    }

    try {
        const metadata = await prisma.user.findMany({
            where:{
                id:{
                    in: userIds
                }
            },
            select:{
                avatar:true,
                id:true
            }
        })

        return res.status(200).json({
            success:true,
            avatars:metadata.map(m=>({
                userId:m.id,
                avatarId:m.avatar?.imageUrl
            })),
            message:"Meta data fetched!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the request.",
        });    
    }
})

export const updatemetadata = asyncHandler(async (req:Request, res:Response)=>{
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    if(!parsedData.success){
        return res.status(400).json({
            success: false,
            message:"Validation failed"
        })
    }
    try {
        await prisma.user.update({
            where:{
                id:req.userId
            },
            data:{
                avatarId:parsedData.data?.avatarId
            }
        })

        res.status(200).json({
            success:true,
            message:"Metadata updated"
        })
        
    } catch (error) {
        console.error(error)
        return res.status(400).json({
            success: false,
            message: "An error occurred while processing the request.",
        });           
    }
})