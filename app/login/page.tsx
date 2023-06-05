'use client';

import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { createSession } from "../appwrite";
import { Loading } from "@nextui-org/react";
import { AppwriteException } from "appwrite";


export default function LoginPage() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    async function handleSubmit() {
        setLoading(true);
        var response = await createSession(form.email, form.password);
        //check if response is a object of Account type
        if (response instanceof AppwriteException) {
            setError(response.message);
            setLoading(false);
        } else {
            setError('');
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-screen h-screen flex flex-col justify-between px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
                <Navbar mode="home"/>
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-2/5 h-full flex flex-col gap-5 justify-center items-center">
                        <h2 className="font-satoshi-bold text-dark-grey">Please login to continue</h2>
                        <input 
                            required
                            type="text"
                            placeholder="Email Address"
                            className="w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                            
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                        />
                        <div className="flex items-center gap-3 w-full rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus-within:border"> 
                            <input 
                                required
                                type={passwordHidden ? "password" : "text"}
                                placeholder="Password"
                                className="bg-transparent w-full h-full p-5 outline-none text-lg font-satoshi-med text-dark-grey placeholder:text-dark-grey placeholder:opacity-30 placeholder:font-satoshi-med"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                            />
                            {
                                passwordHidden 
                                ? <MdOutlineVisibilityOff
                                    className="text-2xl text-dark-grey cursor-pointer self-center mr-3"
                                    onClick={() => setPasswordHidden(false)}
                                />
                                : <MdOutlineVisibility
                                    className="text-2xl text-dark-grey cursor-pointer self-center mr-3"
                                    onClick={() => setPasswordHidden(true)}
                                />
                            }
                        </div>
                        <div className="flex flex-col w-full h-auto gap-3 mt-10 justify-center items-center">
                            {
                                error !== '' && <span className="text-base text-red-500 font-satoshi-med">{error}</span>
                            }
                            <button className="w-full p-3 bg-orange rounded-md grid place-items-center shadow-[0px_4px_0px_0px_rgba(238,151,106,1)] hover:shadow-none transition-all duration-300" onClick={handleSubmit}>
                                {
                                    !loading ? <span className="text-lg font-satoshi-med text-dark-grey">Login</span>
                                    : <span className="text-lg font-satoshi-med text-dark-grey">
                                        <Loading color='white' type='points' />
                                    </span>
                                }
                            </button>
                            <span className="text-base text-orange font-satoshi-med cursor-pointer">Forgot Password?</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
