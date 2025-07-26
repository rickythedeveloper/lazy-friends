'use client'

import {useAuth} from "@/auth/useAuth";

export default function LogoutPage() {
    const {logout} = useAuth()

    return <button onClick={() => logout()}>Log out</button>
}