import z from "zod";

export const SignupSchema = z.object({
    username:z.string().min(3).max(255),
    password:z.string().min(6).max(255),
    type: z.enum(["user","admin"])
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(6).max(255),
})

