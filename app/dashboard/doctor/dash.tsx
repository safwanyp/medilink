'use client';

import { client, executeRequestAccessToPatientDoc, getPatientDocument, getPatientDocId } from "@/app/appwrite";
import Navbar from "@/app/components/navbar";
import { Access } from "@/models/patient_doc";
import { Loading } from "@nextui-org/react";
import { Models } from "appwrite";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import artwork from '@/public/assets/doctor-dash-art.png'
import Image from "next/image";

export default function DoctorDash({acc, setAcc}: {acc: any, setAcc: any}) {
    const router = useRouter();

    const [patientEmail, setPatientEmail] = useState<string>('');
    const [step, setStep] = useState<{1: boolean, 2: boolean, 3: boolean}>({
        1: true,
        2: false,
        3: false,
    });
    const [patientDocId, setPatientDocId] = useState<string>('');

    async function viewPatientDetails(patient_id: string) {
        router.push(`/dashboard/view-patient/${patient_id}?doctor=${acc.$id}`);
    }

    async function listenForAccessRequests(docId: string) {
        // listen for access requests
        console.log(`listening for changes on databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`);
        client.subscribe(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`,
            response => {
                console.log('realtime response: ', response.payload as Models.Document);
                const doc = response.payload as Models.Document;

                const perms = doc.$permissions;
                for (let i = 0; i < perms.length; i++) {
                    const perm = perms[i];
                    if (perm === `read("user:${acc.$id}")`) {
                        console.log('access granted');
                        setPatientDocId(docId);
                        setStep({
                            1: true,
                            2: true,
                            3: true,
                        });
                    }
                }
            });
    }

    async function handleSubmit(patient_email: string) {
        setStep({
            1: true,
            2: true,
            3: false,
        });

        const newViewAccessRequest = new Access(
            acc.$id,
            acc.name,
            'patient_id',
            'patient_name',
            'View',
            dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        );

        const promise = await executeRequestAccessToPatientDoc(newViewAccessRequest, patient_email);
        const patient_doc_id = JSON.parse(promise?.response as string).patient_doc_id;

        listenForAccessRequests(patient_doc_id);
    }

    return (
        <>
            <Navbar mode="doctorDash" />
            <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-5 md:hidden">
                <span className="text-center">The doctor dashboard is not available on mobile devices.</span>
            </div>
            <div className="hidden md:flex w-full h-full flex-row gap-8">
                <div className="w-9/12 h-full flex flex-col gap-5 justify-start py-3">
                    <span className="font-satoshi-med text-dark-grey text-xl">
                        Welcome back, <span className="font-satoshi-med text-orange text-xl">{`${acc?.name.split(' ')[0]} ${acc?.name.split(' ')[1]}`}</span>
                    </span>
                    <div className="w-full h-auto flex flex-col gap-5 justify-start">
                        <div className="w-full h-auto gap-2 flex flex-col">
                            <span className="font-cool text-dark-grey text-xl">Step 1</span>
                            {step[1] === true ? <div className="flex flex-row justify-between items-center gap-5">
                                <span className="font-satoshi-med text-dark-grey text-lg whitespace-nowrap">Enter the patient&apos;s email and press <i className="text-orange">Enter</i></span>
                                <input 
                                    disabled={step[2] === true}
                                    required
                                    type="text"
                                    placeholder="Patient Registered Email"
                                    className="w-full p-3 rounded-md bg-orange bg-opacity-30 text-lg font-satoshi-med text-dark-grey border-b border-shadow outline-none focus:border-orange focus:border placeholder:font-satoshi-med placeholder:text-dark-grey placeholder:opacity-30 disabled:text-gray-600"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(patientEmail) }}
                                    value={patientEmail}
                                    onChange={(e) => setPatientEmail(e.target.value)}
                                />
                            </div>: null}

                            {step[2] === true ? <div className="w-full h-auto gap-2 flex flex-col">
                                <span className="font-cool text-dark-grey text-xl">Step 2</span>
                                <div className="flex flex-row items-center gap-5">
                                    <span className="font-satoshi-med text-dark-grey text-lg whitespace-nowrap">Wait for patient to give you one-time access</span>
                                    <div className="flex flex-row gap-3 items-center">
                                        {step[3] === false ? <Loading color="warning" /> : null}
                                        {step[3] === false ? <span className="font-satoshi-med text-orange-light text-lg whitespace-nowrap">Waiting for Access</span> : null}
                                        {step[3] === true ? <span className="font-satoshi-med text-orange text-lg whitespace-nowrap">Access Received ✅</span> : null}
                                    </div>
                                </div>
                            </div> : null}

                            {step[3] === true ? <div className="w-full h-auto flex flex-col">
                                <span className="font-cool text-dark-grey text-xl">Step 3</span>
                                <span className="text-lg text-dark-grey">Click the button below to view the patient&apos;s details</span>
                                <button 
                                    className="mt-2 flex flex-row w-fit gap-1 flex-nowrap items-baseline py-3 px-6 bg-orange-light rounded-md transition-all duration-200 hover:drop-shadow-[0_4px_0px_#EE976A]"
                                    onClick={() => viewPatientDetails(patientDocId)}
                                >
                                    <span className="text-lg font-satoshi-med text-dark-grey">View Patient Details</span>
                                </button>
                            </div> : null}
                        </div>
                    </div>
                </div>
                <div className="w-3/12 h-full flex flex-col gap-5 items-center justify-center py-3">
                    <Image src={artwork} height={300} alt="doctor-dash-img" />
                </div>
            </div>
        </>
    );
}