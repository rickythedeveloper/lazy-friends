'use client'

import {useAuth} from "@/auth/useAuth";

export default function ProfilePage() {
    const {isAuthenticated, isLoading, user} = useAuth()

    if (isLoading) {
        return <div>loading</div>
    }

    if (!isAuthenticated) {
        return <div>Not signed in</div>
    }

    return user ? <div>Hi {user.name} ({user.email})</div> : <div>Hi unknown user</div>
}