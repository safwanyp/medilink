'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Loading } from "@nextui-org/react";
import { confirmEmail } from "../appwrite";

export default function Verify() {
    const [verified, setVerified] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');

        if (userId && secret) {
            confirmEmail(userId, secret).then(() => {
                setVerified(true);
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            });
        }
    });


    return (
        <div className="w-screen h-screen flex flex-col justify-between px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
            <Navbar mode="home"/>
            <div className="w-full h-auto p-5 flex flex-col gap-5 items-center">
                <span className="font-cool text-dark-grey text-2xl">
                    {verified ? 'Account has been verified ✅' : 'Checking verification code...'}
                </span>
                {
                    verified ? 
                    <span className="font-satoshi-med text-dark-grey text-xl text-left">
                        You will be redirected automatically.
                    </span>
                    : <Loading type='points' color='warning' />
                }
            </div>
            <Footer />
        </div>
    );
}
