import { Card } from "components/card"
import VerifyOtp from "./verify"

export default function Verify() {
  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-w-md w-full p-8">
        <VerifyOtp
          primaryActionText="Verify"
          handleSubmit={async function (values: { code: string }) {
            "use server"
            console.log(values)
          }}
        />
      </Card>
    </main>
  )
}
