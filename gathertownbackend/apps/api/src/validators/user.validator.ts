import z from "zod";

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})
