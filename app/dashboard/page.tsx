'use client';

import { ReactNode, useEffect, useState } from "react"
import { client, executeDoctorAccessRejectFunction, executeRevokeDoctorAccessFunction, getAccount, getPatientAccessLogs, getPatientAuthAccessLogs, getPatientCurrentAccess, getPatientDocument, getUserDocId, teams, userDocId } from "../appwrite";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AppwriteException, Models } from "appwrite";
import { FiArrowUpRight } from "react-icons/fi";
import { TbClick } from "react-icons/tb";
import { BiInfoCircle } from "react-icons/bi";
import { Button, Loading, Popover, Table, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { Access } from "@/models/patient_doc";
import { IsoDateToString } from "@/helpers/dateTimeFormat";
import AuthActionElement from "./patient/authActionElement";
import { flushSync } from "react-dom";

import Image from "next/image";
import PatientDash from "./patient/dash";
import DoctorDash from "./doctor/dash";
import LoadingIndicator from "../components/loading";


export default function Dashboard() {
    const [firstLoadDone, setFirstLoadDone] = useState<boolean>(false);
    const [acc, setAcc] = useState<Models.Account<Models.Preferences>>();
    const [dashType, setDashType] = useState<'patient' | 'doctor'>('doctor');
    const [loading, setLoading] = useState<boolean>(true);

    const patientTeamId = '64774215aa9ed23501bb';
    const doctorTeamId = '6477421aa6b8b7215108';


    async function init() {
        //show loading indicator while fetching data, hide when done
        setLoading(true);
        // const acc = await getAccount();
        setAcc(await getAccount());
        setFirstLoadDone(true);

        // check if user is in patient team
        try {
            const promise = await teams.listMemberships(doctorTeamId);
            console.log('TeamMembership: ', promise);
            setDashType('doctor');
        } catch (e) {
            if (e instanceof AppwriteException) {
                console.log(e.message);
                setDashType('patient');
            } else {
                console.log(e);
            }
        }
        setLoading(false);
    }


    useEffect(() => {
        init();
    }, []);

    if (loading) return <LoadingIndicator />

    return (
        <div className="w-screen h-screen flex flex-col justify-between px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-none">
            { dashType === 'patient' && <PatientDash acc={acc} setAcc={setAcc} /> }
            { dashType === 'doctor' && <DoctorDash acc={acc} setAcc={setAcc} /> }
            <Footer />
        </div>
    )
}
