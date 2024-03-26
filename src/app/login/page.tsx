import { Card } from "components/card"
import SignUpForm from "./login"

export default function SignUp() {
  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-w-md w-full p-8">
        <SignUpForm
          primaryActionText="Create Account"
          handleSubmit={async function (values: {
            email: string
            password: string
          }) {
            "use server"
            console.log(values)
          }}
        />
      </Card>
    </main>
  )
}
