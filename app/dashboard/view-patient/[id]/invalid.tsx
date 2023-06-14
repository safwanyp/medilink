'use client';

import { useRouter } from "next/navigation";

export default function InvalidAccess() {
    const router = useRouter();

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <span>⛔️</span>
            <span>You are not authorized to view this page.</span>
            <button className="mt-5" onClick={() => router.push('/dashboard')}>Go back</button>
        </div>
    )
}