import { Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../validators/admin.validator";
import { prisma } from "@repo/db";

export const createMap = asyncHandler(async (req:Request,res:Response)=>{
    const mapData = CreateMapSchema.safeParse(req.body)
    if(!mapData.success){
        return res.status(400).json({
            message:"Validation failed"
        })
    }
    try {

        const map = await prisma.map.create({
            data:{
                name:mapData.data.name,
                width: parseInt(mapData.data.dimensions.split("x")[0] ?? ""),
                height: parseInt(mapData.data.dimensions.split("x")[1] ?? ""),
                thumbnail:mapData.data.thumbnail,
                mapElements:{
                    create: mapData.data.defaultElements.map(m=>({
                        elementId:m.elementId,
                        x:m.x,
                        y:m.y
                    }))
                }
            }
        })

        return res.status(200).json({
            id:map.id,
            message:"Map created"
        })

    } catch (error) {
        return res.status(400).json({
            message:"Something went wrong!"
        })
    }
 
})
export const createAvatar = asyncHandler(async (req:Request,res:Response)=>{
    const avatarData = CreateAvatarSchema.safeParse(req.body)
    if(!avatarData.success){
        return res.status(400).json({
            message:"Validation failed"
        })
    }
    
    try {
        const avatar = await prisma.avatar.create({
            data:{
                name:avatarData.data.name,
                imageUrl:avatarData.data.imageUrl
            }
        })

        return res.status(200).json({
            avatarId: avatar.id,
            message:"Avatar created"
        })
    } catch (error) {
        return res.status(400).json({
            message:"Something went wrong!"
        })
    }
})

export const createElement = asyncHandler(async (req:Request,res:Response)=>{

    const elementData = CreateElementSchema.safeParse(req.body)

    if(!elementData.success){
        return res.status(400).json({
            success:"false",
            message:"Validation failed"
        })       
    }

    try {
        const element = await prisma.element.create({
            data:{
                width:elementData.data.width,
                height:elementData.data.height,
                static:elementData.data.static,
                imageUrl:elementData.data.imageUrl
            }
        })
        return res.status(200).json({
            success:"true",
            id:element.id,
            message:"Element created"
        })
    } catch (error) {
        return res.status(400).json({
                message:"Something went wrong!"
            })
    }
})

export const updateElement = asyncHandler(async (req:Request,res:Response)=>{
    const elementData = UpdateElementSchema.safeParse(req.body)

    if(!elementData.success){
        return res.status(400).json({
            success:"false",
            message:"Validation failed"
        })
    }

    try {
        await prisma.element.update({
            where:{
                id:req.params.elementId
            },
            data:{
                imageUrl:elementData.data.imageUrl
            }
        })

        return res.status(200).json({message:"Element updated"})
        
    } catch (error) {
        return res.status(400).json({
            message:"Something went wrong!"
        })
    }
 
})