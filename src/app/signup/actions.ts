'use server'

import { postRequest } from 'lib/network'
import { ILogin, ISignUp, IVerify } from 'lib/utils/auth'
import { cookies } from 'next/headers'

function setCookie(cookie: string) {
    const [cookieNameValue] = cookie.split(';')
    const [name, value] = cookieNameValue.split('=')
    cookies().set(name, value)
}
export async function login(formValues: ILogin) {
    const {
        data,
        message,
        status,
        status_code,
        cookie = '',
    } = await postRequest('login', formValues)
    setCookie(cookie)
    return { message, data, status, status_code }
}

export async function signup(formValues: ISignUp) {
    const {
        data,
        message,
        status,
        cookie = '',
    } = await postRequest('signup', formValues)
    setCookie(cookie)
    return { message, data, status }
}

export async function verify(formValues: IVerify) {
    const {
        status,
        message,
        cookie = '',
    } = await postRequest('verify_email', formValues)
    setCookie(cookie)
    return { message, status }
}
