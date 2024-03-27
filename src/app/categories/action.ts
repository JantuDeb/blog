'use server'

import { postRequest } from 'lib/network'
import { IUserCategory } from 'lib/types'
import { ILogin, ISignUp, IVerify } from 'lib/utils/auth'
import { cookies } from 'next/headers'

function setCookie(cookie: string) {
    const [cookieNameValue] = cookie.split(';')
    const [name, value] = cookieNameValue.split('=')
    cookies().set(name, value)
}
export async function updateUserCategory(formValues: IUserCategory) {
    const {
        message,
        status,
        status_code,
        cookie = '',
    } = await postRequest('user_categories', formValues)
    setCookie(cookie)
    return { message, status, status_code }
}
