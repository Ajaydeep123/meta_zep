import z from "zod";

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),  
        y: z.number(),
    }))
})


export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
})