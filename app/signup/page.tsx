'use client';

import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { createAccount, createSession, executeTeamsFunction, sendVerificationEmail } from "../appwrite";
import CheckEmail from "./checkEmail";


export default function SignupPage({mode = 'patient'}) {
    const [accMode, setAccMode] = useState<string>(mode);
    const [form, setForm] = useState({
        mode: accMode,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
    const [showVerification, setShowVerification] = useState<boolean>(false);

    async function handleSubmit() {
        // first check if passwords match
        // then call createAccount and sendVerificationEmail
        // after email is sent, show a message to the user to check their email
        
        /* ========= TODO: execution function to create correct team membership ========= */

        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match!');
            return;
        } else {
            await createAccount(form.email, form.password.toString(), form.name);   // create user account
            await createSession(form.email, form.password.toString());              // create user session
            await sendVerificationEmail('http://localhost:3000/verification');      // send verification email
            setShowVerification(true);                                              // show verification message
            await executeTeamsFunction(                                             // execute function to create correct team membership
                process.env.NEXT_PUBLIC_TEAM_FUNCTION_ID as string, 
                form.mode, 
                form.email
            );
        }
    }

    return (
        <>
            {showVerification ? <CheckEmail setShow={setShowVerification} /> : null}
            <div className="w-screen h-screen flex flex-col justify-between px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
                <Navbar mode="home"/>
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-2/5 h-full flex flex-col gap-5 justify-center items-center">
                        <h2 className="font-satoshi-bold text-dark-grey">Sign up for a free account</h2>
                        <div className="w-full flex justify-start gap-5">
                            <span className="text-lg font-satoshi-med text-dark-grey">I am a </span>
                            <span 
                                className={accMode === 'patient' ? 'transition-all duration-300 cursor-pointer font-satoshi-bold text-orange underline underline-offset-4 text-lg' : 'transition-all duration-300 cursor-pointer font-satoshi-med text-orange-light text-lg'}
                                onClick={() => setAccMode('patient')}
                            >
                                Patient
                            </span>
                            <span 
                                className={accMode === 'doctor' ? 'transition-all duration-300 cursor-pointer font-satoshi-bold text-orange underline underline-offset-4 text-lg' : 'transition-all duration-300 cursor-pointer font-satoshi-med text-orange-light text-lg'}
                                onClick={() => setAccMode('doctor')}
                            >
                                Doctor
                            </span>
                        </div>
                        <input 
                            required
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                        <input 
                            required
                            type="text"
                            placeholder="Email Address"
                            className="w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                            
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                        />
                        <div className="flex items-center gap-3 w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus-within:border"> 
                            <input 
                                required
                                type={passwordHidden ? "password" : "text"}
                                placeholder="Password"
                                className="bg-transparent w-full h-full  outline-none text-lg font-satoshi-med text-dark-grey placeholder:text-dark-grey placeholder:opacity-30 placeholder:font-satoshi-med"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                            />
                            {
                                passwordHidden 
                                ? <MdOutlineVisibilityOff
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(false)}
                                />
                                : <MdOutlineVisibility
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(true)}
                                />
                            }
                        </div>
                        <div className="flex items-center gap-3 w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus-within:border"> 
                            <input 
                                required
                                type={passwordHidden ? "password" : "text"}
                                placeholder="Confirm Password"
                                className="bg-transparent w-full h-full  outline-none text-lg font-satoshi-med text-dark-grey placeholder:text-dark-grey placeholder:opacity-30 placeholder:font-satoshi-med"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            />
                            {
                                passwordHidden 
                                ? <MdOutlineVisibilityOff
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(false)}
                                />
                                : <MdOutlineVisibility
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(true)}
                                />
                            }
                        </div>
                        <button className="w-full p-3 bg-orange rounded-md grid place-items-center shadow-[0px_4px_0px_0px_rgba(238,151,106,1)] hover:shadow-none transition-all duration-300" onClick={handleSubmit}>
                            <span className="text-lg font-satoshi-med text-dark-grey">Sign Up</span>
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}