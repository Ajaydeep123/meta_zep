import { asyncHandler } from "../utils/asyncHandler";
import {Response, Request} from "express"
import { prisma } from "@repo/db";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema,  } from "../validators/space.validator";



export const createSpace = asyncHandler(async (req:Request,res:Response)=>{
    /* 
    1. parseData, if invalid then return error response
    2. !mapId in parsedData -> create an empty space 
    3. If mapId exists -> find respective map from db, extract it's dimensions, all the elements present in the map --> [mapElements]
    4. Now, create a transaction where -> we make a db operation to create the space with same dimensions like that of the map and and
       Another db operation to insert all the extracted elements of the map into the mapElements table.
    5. Return the spaceId
    */
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    if(!parsedData.success){
        return res.status(400).json({
            success: false,
            message:"Validation failed"
        })
    }
// --------------------- Case 1 ---------------------
    if(!parsedData.data.mapId){
        const space = await prisma.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0] ?? ''),
                height: parseInt(parsedData.data.dimensions.split("x")[1] ?? ''),
                creatorId: req.userId!
            }
        });

        return res.status(200).json({  
            success: true,
            message: "Space created successfully",
            spaceId: space.id
        })
    }

// --------------------- Case 2 ---------------------
    const map = await prisma.map.findUnique({
        where:{
            id: parsedData.data.mapId
        }, select:{
            mapElements:true,
            height:true,
            width:true,
        }
    })
    
    if(!map){
        return res.status(400).json({
            success: false,
            message: "Map not found"
        })
    }

    let newSpace = await prisma.$transaction(async ()=>{
        // ----------- Create Space -----------
        const space = await prisma.space.create({
            data:{
                name: parsedData.data.name,
                width:map?.width,
                height:map?.height,
                creatorId: req.userId!
            }
        })
        // ----------- Create spaceElements -----------

            await prisma.spaceElements.createMany({
                data: map.mapElements.map(mapElement =>({
                    spaceId:space.id,
                    elementId:mapElement.elementId,
                    x:mapElement.x!,
                    y:mapElement.y!
                }))
            })

            return space;
    });

    return res.status(200).json({
        success:true,
        message:"Space created successfully",
        spaceId:newSpace.id
    })
})

export const getAllSpaces = asyncHandler(async (req:Request,res:Response)=>{
    const spaces = await prisma.space.findMany({
        where:{
            creatorId : req.userId!
        }
    });

    return res.status(200).json({
        spaces : spaces.map(space =>({
            id:space.id,
            name:space.name,
            thumbnail:space.thumbnail,
            dimensions:`${space.width}x${space.height}`,
        }))
    })
    
})

export const getSpace = asyncHandler(async (req:Request,res:Response)=>{
    const space = await prisma.space.findUnique({
        where:{
            id: req.params.spaceId
        },
        include:{
            elements:{
                include:{
                    element:true
                }
            },
        }
    })

    if(!space){
        return res.status(400).json({
            success:false,
            message:"Space not found!"
        })
    }

    return res.status(200).json({
        "dimensions":`${space.width}x${space.height}`,
        "elements": space.elements.map(e=>({
            id:e.id,
            element:{
                id:e.element.id,
                imageUrl: e.element.imageUrl,
                static:e.element.static,
                height:e.element.height,
                width:e.element.width
            },
            x:e.x,
            y:e.y
        })),
    })

})

export const deleteSpace = asyncHandler(async (req:Request,res:Response)=>{
    const space = await prisma.space.findUnique({
        where:{
            id : req.params.spaceId
        },select:{
            creatorId: true
        }
    })

    if(!space){
        return res.status(400).json({
            success:false,
            message:"Space not found!"
        })
    }

    if(space.creatorId !== req.userId ){
        return res.status(403).json({
            success:false,
            message:"Unauthorized"
        })
    }

        await prisma.space.delete({
            where:{
                id:req.params.spaceId
            }
        })

    return res.status(200).json({
        success:true,
        message:"Space deleted!"
    })
})


export const deleteElement = asyncHandler(async (req:Request,res:Response)=>{
    const elementData = DeleteElementSchema.safeParse(req.body)
    if(!elementData.success){
        return res.status(400).json({message:"Validation failed"})
    }
    const spaceElement = await prisma.spaceElements.findFirst({
        where:{
            id:elementData.data.id
        },include:{
            space:true
        }
    })
    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        return res.status(403).json({message:"Unauthorized"})
    }

    await prisma.spaceElements.delete({
        where: {
            id: elementData.data.id
        }
    })  
    
    return res.status(200).json({
        message:"Element has been deleted from the space!"
    })
})

export const addElement = asyncHandler(async (req:Request,res:Response)=>{
    const elementData = AddElementSchema.safeParse(req.body);

    if(!elementData.success){
        return res.status(400).json({
            success:"false",
            message: "Validation failed"})
    }

    const space = await prisma.space.findUnique({
        where:{
            id:elementData.data.spaceId,
            creatorId:req.userId!
        }, select:{
            width:true,
            height:true
        }
    })

  
    if(elementData.data.x<0 || elementData.data.y<0 || elementData.data.x>space?.width! || elementData.data.y>space?.height!){
        return res.status(400).json({
            success:"false",
            message: "Point is outside of the space boundary"
        })
    }

    await prisma.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    return res.status(200).json({
        success:"true",
        message:"Element added to the space!"
    })

})