// define the zod schema , configurations for all of them,


import {z} from 'zod'

export const CreateUserSchema = z.object({
    email: z.string().min(3).max(20),
    password: z.string(),
    name: z.string()
})

export const SigninSchema = z.object({
    email: z.string().min(3).max(20),
    password: z.string(),
})

export const RoomSchema = z.object({
    name: z.string().min(3).max(20),
})