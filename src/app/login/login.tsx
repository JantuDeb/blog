"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/form"
import { Input } from "components/input"
import { ILogin, loginSchema } from "lib/utils/auth"
import Link from "next/link"
import { ApiResponse } from "lib/types/response"
import { CircleIcon } from "@radix-ui/react-icons"
import Loader from "components/loader"

export default function LoginForm({
  primaryActionText,
  handleSubmit,
}: {
  primaryActionText: string
  handleSubmit: (values: ILogin) => Promise<ApiResponse<any>>
}) {
  const form = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: ILogin) {
    const { message: error_message } = await handleSubmit(values)
    if (error_message) form.setError("root", { message: error_message })
  }

  const { isLoading, isSubmitting } = form.formState

  return (
    <div>
      <div className="flex flex-col space-y-2 text-center my-4">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <h4 className="text-lg font-medium">Welcome back to ECOMMERCE</h4>
        <p className="text-sm ">The next gen business marketplace</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Password"
                    type="password"
                    showPasswordToggle
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message && (
            <p className=" text-destructive">
              {form.formState.errors.root?.message}
            </p>
          )}
          <Button
            type="submit"
            className="uppercase w-full mt-4"
            size="lg"
            disabled={isLoading || isSubmitting}>
            {primaryActionText} {(isLoading || isSubmitting) && <Loader />}
          </Button>

          <div className="border-b h-1"></div>
          <div className=" text-center">
            Don&#39;t have an Account?{" "}
            <Link href="/signup" className="font-medium uppercase">
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
