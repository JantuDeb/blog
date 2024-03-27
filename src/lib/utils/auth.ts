import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Must be a valid email",
  }),
  password: z.string().min(6, {
    message: "Email must be at least 6 characters.",
  }),
})

export type ISignUp = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  //   name: z.string().min(3, {
  //     message: "Name must be at least 3 characters.",
  //   }),
  email: z.string().email({
    message: "Must be a valid email",
  }),
  password: z.string().min(6, {
    message: "Email must be at least 6 characters.",
  }),
})

export type ILogin = z.infer<typeof loginSchema>

export const verifySchema = z.object({
  code: z.string().length(8, "In valid code"),
})

export type IVerify = z.infer<typeof verifySchema>
