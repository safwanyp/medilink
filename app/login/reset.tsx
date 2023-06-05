import { Loading } from "@nextui-org/react";
import { useState } from "react";
import { createPasswordRecovery } from "../appwrite";
import { AppwriteException } from "appwrite";

export default function ResetPasswordModal({setShow = (val: boolean) => {}}) {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    async function handleSubmit() {
        setLoading(true);

        try {
            await createPasswordRecovery(email);
        } catch (error) {
            if (error instanceof AppwriteException) {
                console.log(error.message);
            } else {
                console.log(error);
            }
        }
        
        setLoading(false);
        setSubmitted(true);
    }


    return (
        <div className="absolute w-screen h-screen bg-black bg-opacity-60 z-50 grid place-items-center">
            <div className="w-1/3 h-auto p-5 bg-cream rounded-md flex flex-col gap-5 items-center">
                <span className="font-cool text-dark-grey text-2xl">Reset Password</span>
                {
                    submitted === true
                        ? <span className="font-satoshi-med text-dark-grey text-xl">If the email exists in our system, you will receive an email with a link to reset your password.</span>
                        : <span className="font-satoshi-med text-dark-grey text-xl text-left">Please enter your registered email address</span>
                }
                {
                    submitted === true 
                        ? null
                        : <input
                            required
                            type="text"
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-5 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30"
                        />
                }
                <button className="w-full p-3 bg-orange rounded-md grid place-items-center shadow-[0px_4px_0px_0px_rgba(238,151,106,1)] hover:shadow-none transition-all duration-300" onClick={submitted ? () => setShow(false) :handleSubmit}>
                    {
                        loading === true
                            ? <Loading color='white' type='points' />
                            : <span className="text-lg font-satoshi-med text-dark-grey">
                                {
                                    submitted ? 'Close' : 'Submit'
                                }
                            </span>
                    }
                </button>
            </div>
        </div>
    );
}

{/* <span className="font-satoshi-med text-dark-grey text-xl text-left">Please check your email for the link to reset your password.</span>
                <span className="font-satoshi-med text-dark-grey text-xl text-left">Make sure to check your spam/junk folder as well!</span> */}