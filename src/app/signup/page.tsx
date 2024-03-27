import { Card } from "components/card"
import SignUpForm from "./signup"
import { ISignUp } from "lib/utils/auth"
import { signup } from "./actions"
import { Status } from "lib/types/response"
import { redirect } from "next/navigation"

export default function SignUp() {
  async function handleSignUp(values: ISignUp) {
    "use server"
    const { status, message } = await signup(values)
    if (status === Status.Success) redirect("/verify")
    return {
      status,
      message,
    }
  }
  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-w-md w-full p-8">
        <SignUpForm
          primaryActionText="Create Account"
          handleSubmit={handleSignUp}
        />
      </Card>
    </main>
  )
}
