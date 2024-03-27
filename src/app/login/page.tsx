import { Card } from "components/card"
import LoginForm from "./login"
import { ILogin } from "lib/utils/auth"
import { login } from "../signup/actions"
import { Status } from "lib/types/response"
import { redirect } from "next/navigation"

export default function Login() {
  async function handleLogin(values: ILogin) {
    "use server"
    const { status, message } = await login(values)
    if (status === Status.Success) redirect("/categories")
    else if (status === Status.OtpPending) redirect("/verify")
    return {
      status,
      message,
    }
  }

  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-w-md w-full p-8">
        <LoginForm primaryActionText="LOGIN" handleSubmit={handleLogin} />
      </Card>
    </main>
  )
}
