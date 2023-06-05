'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Loading } from "@nextui-org/react";
import { confirmEmail, resetPassword } from "../appwrite";
import { AppwriteException } from "appwrite";

export default function RecoverPassword() {
    const [verified, setVerified] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setUserId(urlParams.get('userId') as string);
        setSecret(urlParams.get('secret') as string);
    }, []);

    async function handleSubmit() {
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        } else if (form.password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        } else {
            try {
                const response = await resetPassword(userId, secret, form.password, form.confirmPassword);
                alert('Password reset successfully');
                window.location.href = '/login';
            } catch (error) {
                if (error instanceof AppwriteException) {
                    alert(error.message);
                } else {
                    alert(error);
                }
            }
        }
    }


    return (
        <div className="w-screen h-screen flex flex-col justify-between px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
            <Navbar mode="home"/>
            <div className="w-full h-auto p-5 flex flex-col gap-5 items-center">
                <span className="font-cool text-dark-grey text-2xl">
                    Please enter your new password below
                </span>
                
                <div className="w-full flex flex-col gap-5 justify-center items-center">
                    <input
                        required
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        className="w-1/3 p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                    />
                    <input
                        required
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        className="w-1/3 p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                    />
                    <button className="w-1/3 p-3 bg-orange rounded-md grid place-items-center shadow-[0px_4px_0px_0px_rgba(238,151,106,1)] hover:shadow-none transition-all duration-300">
                        <span className="text-lg font-satoshi-med text-dark-grey" onClick={handleSubmit}>Reset Password</span>
                    </button>
                </div>

            </div>
            <Footer />
        </div>
    );
}
