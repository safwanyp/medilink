'use client';

import Image from "next/image";
import logo from "../../public/assets/Logo.svg";
import { useEffect, useState } from "react";
import { Models } from "appwrite";
import { getAccount } from "../appwrite";
import { BsPerson } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import Link from "next/link";

export default function Navbar({mode = 'home'}) {
    const [acc, setAcc] = useState<Models.Account<Models.Preferences>>();

    useEffect(() => {
        getAccount().then((res) => {
            setAcc(res);
        });
    }, []);

    const homeDefaultNavbar = (
        <>
            <Link href={'/'}>
                <Image 
                    src={logo}
                    alt="MediLink Logo"
                    width={140}
                />  
            </Link>
            <div className="flex flex-row gap-5 text-lg items-center">
                <Link href={'/login'}>
                    <span className="cursor-pointer text-dark-grey font-satoshi-med">
                        Log In
                    </span>
                </Link>
                <Link href={'/signup'}>
                    <button className="rounded-full outline-none bg-orange px-7 py-1 shadow-[1px_4px_0px_0px_rgba(238,151,106,1)] transition-all duration-300 hover:shadow-none hover:px-9">
                        <span className="text-dark-grey font-cool-con text-xl">
                            Get Started
                        </span>
                    </button>
                </Link>
            </div>
        </>
    );

    const homeLoggedInNavbar = (
        <>
            <Link href={'/'}>
                <Image 
                    src={logo}
                    alt="MediLink Logo"
                    width={140}
                />  
            </Link>
            <Link href={'/dashboard'}>
                <div className="cursor-pointer flex flex-row gap-2 items-center">
                    <BsPerson className="text-dark-grey" />
                    <span className="text-base text-dark-grey font-satoshi-med">My Dashboard</span>
                </div>
            </Link>
        </>
    );

    const doctorDashNavbar = (
        <>
            <div className="flex gap-10 items-center">
                <Link href={'/'}>
                    <Image 
                        src={logo}
                        alt="MediLink Logo"
                        width={140}
                    />  
                </Link>
                <span className="text-light-grey font-satoshi-bold text-lg">Doctor Dashboard</span>
            </div>

            {/* TODO: Implement Logout */}
            <Link href={'/'}>
                <div className="cursor-pointer flex flex-row gap-2 items-center">
                    <TbLogout className="text-dark-grey" />
                    <span className="text-base text-dark-grey font-satoshi-med">Logout</span>
                </div>
            </Link>
        </>
    );

    const patientDetailsNavbar = (
        <>
        <div className="flex gap-10 items-center">
            <Image 
                src={logo}
                alt="MediLink Logo"
                width={140}
            />  

            {/* TODO: Get patient name */}
            <span className="text-light-grey font-satoshi-bold text-lg">Patient Details - Safwan Parkar</span>
        </div>
        </>
    );

    const patientDashNavbar = (
        <>
            <div className="flex gap-10 items-center">
                <Link href={'/'}>
                    <Image 
                        src={logo}
                        alt="MediLink Logo"
                        width={140}
                    />  
                </Link>
                <span className="text-light-grey font-satoshi-bold text-lg">Patient Dashboard</span>
            </div>

            {/* TODO: Implement Logout */}
            <Link href={'/'}>
                <div className="cursor-pointer flex flex-row gap-2 items-center">
                    <TbLogout className="text-dark-grey" />
                    <span className="text-base text-dark-grey font-satoshi-med">Logout</span>
                </div>
            </Link>
        </>
    );

    return (
        <div className="w-full py-5 flex flex-row justify-between items-center border-b-[1px] border-orange-light border-opacity-40">
            {
                mode === 'home' 
                    ? acc ? homeLoggedInNavbar : homeDefaultNavbar
                : mode === 'doctorDash' 
                    ? doctorDashNavbar
                : mode === 'patientDetails' 
                ? patientDetailsNavbar
                    : mode === 'patientDash' 
                ? patientDashNavbar
                    : null
            }
        </div>
    )

}