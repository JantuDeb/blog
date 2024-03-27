import { ApiResponse, Status } from "lib/types/response"

export async function postRequest<T, D>(
  url: string,
  details: D
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })

    const responseData = await response.json()

    return responseData as ApiResponse<T>
  } catch (error: any) {
    return {
      status: Status.Failure,
      message: error.message,
      data: undefined,
    }
  }
}
