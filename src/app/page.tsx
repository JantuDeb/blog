import { Button } from 'components/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'components/card'
import Link from 'next/link'

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between p-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="h2">Login</CardTitle>
                    <CardDescription className="text-base">
                        Login to add new or view your saved interests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="default" asChild className="w-full">
                        <Link href="/login">Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    )
}
