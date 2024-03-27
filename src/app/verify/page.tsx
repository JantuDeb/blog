import { Card } from "components/card"
import VerifyOtp from "./verify"
import { IVerify } from "lib/utils/auth"
import { verify } from "../signup/actions"
import { Status } from "lib/types/response"
import { redirect } from "next/navigation"

export default function Verify() {

  async function handleVerify(values: IVerify) {
    "use server"
    const { status, message } = await verify(values)
    if (status === Status.Success) redirect("/categories")

    return {
      status,
      message,
    }
  }
  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-w-md w-full p-8">
        <VerifyOtp
          primaryActionText="Verify"
          handleSubmit={handleVerify}
        />
      </Card>
    </main>
  )
}
