import { ApiResponse, Status } from 'lib/types/response'
import { getFullUrl } from 'lib/utils'
import { cookies } from 'next/headers'

export async function postRequest<T, D>(
    url: string,
    details: D
): Promise<ApiResponse<T>> {
    const cookie = cookies().get('auth_token')
    try {
        const response = await fetch(getFullUrl(url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `${cookie?.name}=${cookie?.value}`,
            },
            credentials: 'include',
            body: JSON.stringify(details),
        })
        const responseData = await response.json()
        const cookies = response.headers.getSetCookie()
        return {
            ...(responseData || {}),
            cookie: cookies?.[0],
        } as ApiResponse<T>
    } catch (error: any) {
        return {
            status: Status.Failure,
            message: error.message,
            data: undefined,
        }
    }
}
export async function fetchRequest<T>(
    url: string
    // details: D
): Promise<ApiResponse<T>> {
    const cookie = cookies().get('auth_token')
    try {
        const response = await fetch(getFullUrl(url), {
            headers: {
                // "Content-Type": "application/json",
                Cookie: `${cookie?.name}=${cookie?.value}`,
            },
            credentials: 'include',
        })
        const responseData = await response.json()
        const cookies = response.headers.getSetCookie()
        return {
            ...(responseData || {}),
            cookie: cookies?.[0],
        } as ApiResponse<T>
    } catch (error: any) {
        return {
            status: Status.Failure,
            message: error.message,
            data: undefined,
        }
    }
}
