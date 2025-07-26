'use client'

import {useAuth} from "@/auth/useAuth";

export default function LoginPage() {
    const {login} = useAuth()

    return <button onClick={() => login()}>Log in</button>
}