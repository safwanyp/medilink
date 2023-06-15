'use client';

import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { createAccount, createSession, createUserDocument, executeTeamsFunction, getAccount, sendVerificationEmail } from "../appwrite";
import CheckEmail from "./checkEmail";
import { Loading } from "@nextui-org/react";

export default function SignupPage() {
    const [accMode, setAccMode] = useState('patient');
    
    async function checkLogin() {
        const acc = await getAccount();
        if (acc) {
            window.location.href = '/dashboard';
        } else {
            return;
        }
    }

    useEffect(() => {
        
    }, []);

    useEffect(() => {
        checkLogin();
        const urlParams = new URLSearchParams(window.location.search);
        setAccMode(urlParams.get('mode') as string || 'patient');
    }, []);

    const [form, setForm] = useState({
        mode: accMode,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit() {
        setLoading(true);
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match!');
            setLoading(false);
            return;
        } else if (form.mode === '' || form.name === '' || form.email === '' || form.password === '' || form.confirmPassword === '') {
            alert('Please fill out all fields!');
            setLoading(false);
            return;
        } else if (form.password.length < 8) {
            alert('Password must be at least 8 characters long!');
            setLoading(false);
            return;
        } else {
            await createAccount(form.email, form.password.toString(), form.name);
            await createSession(form.email, form.password.toString());
            setShowVerification(true);
            await sendVerificationEmail(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/verification`);
            await executeTeamsFunction(
                process.env.NEXT_PUBLIC_TEAM_FUNCTION_ID as string, 
                form.mode, 
                form.email
            );
            await createUserDocument(form.mode);
            setLoading(false);
        }
    }

    return (
        <>
            {showVerification ? <CheckEmail setShow={setShowVerification} /> : null}
            <div className="w-screen h-screen flex flex-col justify-between px-3 md:px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
                <Navbar mode="home"/>
                <div className="w-full h-full flex justify-center items-center">
                    <div className="px-11/12 md:w-2/5 h-full flex flex-col gap-5 justify-center items-center">
                        <h2 className="font-satoshi-bold text-dark-grey">Sign up for a free account</h2>
                        <div className="w-full flex justify-start gap-5">
                            <span className="text-lg font-satoshi-med text-dark-grey">I am a </span>
                            <span 
                                className={accMode === 'patient' ? 'transition-all duration-300 cursor-pointer font-satoshi-bold text-orange underline underline-offset-4 text-lg' : 'transition-all duration-300 cursor-pointer font-satoshi-med text-orange-light text-lg'}
                                onClick={() => {
                                    setAccMode('patient');
                                    setForm({...form, mode: 'patient'});
                                }}
                            >
                                Patient
                            </span>
                            <span 
                                className={accMode === 'doctor' ? 'transition-all duration-300 cursor-pointer font-satoshi-bold text-orange underline underline-offset-4 text-lg' : 'transition-all duration-300 cursor-pointer font-satoshi-med text-orange-light text-lg'}
                                onClick={() => {
                                    setAccMode('doctor');
                                    setForm({...form, mode: 'doctor'});}}
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
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(false)}
                                />
                                : <MdOutlineVisibility
                                    className="text-2xl text-dark-grey cursor-pointer self-center"
                                    onClick={() => setPasswordHidden(true)}
                                />
                            }
                        </div>
                        <div className="flex items-center gap-3 w-full rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus-within:border"> 
                            <input 
                                required
                                type={passwordHidden ? "password" : "text"}
                                placeholder="Confirm Password"
                                className="bg-transparent w-full h-full p-5 outline-none text-lg font-satoshi-med text-dark-grey placeholder:text-dark-grey placeholder:opacity-30 placeholder:font-satoshi-med"
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
                            {
                                !loading ? <span className="text-lg font-satoshi-med text-dark-grey">Sign Up</span>
                                : <span className="text-lg font-satoshi-med text-dark-grey">
                                    <Loading color='white' type='points' />
                                </span>
                            }
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
