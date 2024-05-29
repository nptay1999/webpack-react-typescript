import { AxiosError } from 'axios'

export class ApiError extends Error {
  message: string
  status: number
  data?: Object

  constructor(message: string, status: number = 0, data?: Object) {
    super('')
    this.message = message
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const HandleResponseError = <D>(
  error: AxiosError<{ message: string; data: Object }, D>
) => {
  if (typeof error?.response?.data?.message === 'string') {
    throw new ApiError(
      error.response.data.message,
      error.response?.status,
      error?.response?.data?.data
    )
  }

  throw new ApiError('Unknown', 400)
}
