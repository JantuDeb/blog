export enum Status {
  Success = "SUCCESS",
  Failure = "FAILURE",
  OtpPending = "OTP_PENDING",
}

export type ApiResponse<T> = {
  status: Status
  message?: string
  data?: T
  status_code?: number
  cookie?:string
}
