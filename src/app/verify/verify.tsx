'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from 'components/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from 'components/form'
import { IVerify, verifySchema } from 'lib/utils/auth'
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'components/otp-input'
import { ApiResponse } from 'lib/types/response'
import Loader from 'components/loader'

export default function VerifyOtp({
    primaryActionText,
    handleSubmit,
}: {
    primaryActionText: string
    handleSubmit: (values: IVerify) => Promise<ApiResponse<any>>
}) {
    const form = useForm<IVerify>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    })

    async function onSubmit(values: IVerify) {
        const data = await handleSubmit(values)
        const { message: error_message } = data || {}
        if (error_message) form.setError('root', { message: error_message })
    }

    const { isLoading, isSubmitting, errors } = form.formState

    return (
        <div>
            <div className="flex flex-col space-y-2 text-center my-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Verify you email
                </h1>
                {/* <h4 className="text-lg font-medium">Welcome back to ECOMMERCE</h4> */}
                <p className="text-sm ">
                    Enter the 8 digit code you have received on anu***@gmail.com
                </p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={8} {...field}>
                                        <InputOTPGroup>
                                            {Array(8)
                                                .fill('')
                                                .map((_, i) => (
                                                    <InputOTPSlot
                                                        key={i}
                                                        index={i}
                                                    />
                                                ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {errors.root?.message && (
                        <p className=" text-destructive">
                            {errors.root?.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="uppercase w-full mt-4"
                        size="lg"
                        disabled={isLoading || isSubmitting}
                    >
                        {primaryActionText}{' '}
                        {(isLoading || isSubmitting) && <Loader />}
                    </Button>

                    {/* <div className="border-b h-1"></div>
          <div className=" text-center">
            Don&#39;t have an Account?{" "}
            <Link href="/signup" className="font-medium uppercase">
              Verify
            </Link>
          </div> */}
                </form>
            </Form>
        </div>
    )
}
