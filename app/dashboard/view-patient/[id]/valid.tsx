import { client, executeRequestAccessToPatientDoc, executeRevokeDoctorAccessFunction, getAccount } from "@/app/appwrite";
import Navbar from "@/app/components/navbar";
import { Access } from "@/models/patient_doc";
import { Loading } from "@nextui-org/react";
import { Models } from "appwrite";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ValidAccess({patientDoc}: {patientDoc: Models.Document}) {
    const [loadingClose, setLoadingClose] = useState<boolean>(false);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
    const [doctor, setDoctor] = useState<Models.Account<Models.Preferences>>();
    const [showEdit, setShowEdit] = useState<boolean>(false);

    const searchParams = useSearchParams();

    async function listenForChangeToAccess(docId: string) {
        const doctor_id = searchParams.get('doctor');
        // listen for access requests
        console.log(`listening for changes on databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`);
        const unsub = client.subscribe(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`,
            response => {
                console.log('realtime response: ', response.payload as Models.Document);
                const doc = response.payload as Models.Document;

                const perms = doc.$permissions;
                for (let i = 0; i < perms.length; i++) {
                    const perm = perms[i];
                    if (perm === `write("user:${doctor_id}")`) {
                        console.log('access valid second');
                        setShowEdit(true);
                        unsub();
                    } else {
                        console.log('access invalid second');
                        setShowEdit(false);
                    }
                }
            });
    }

    async function handleClose() {
        setLoadingClose(true);

        await executeRevokeDoctorAccessFunction(
            patientDoc.patient_id,
            doctor?.$id as string,
            'View',
            patientDoc.full_name,
            doctor?.name as string,
        );
        window.location.href = '/dashboard';
        setLoadingClose(false);
    }

    async function handleRequestEdit() {
        setLoadingEdit(true);
        console.log('doctor: ', doctor)
        const newAccessRequest = new Access(
            doctor?.$id as string, 
            doctor?.name as string, 
            patientDoc.patient_id, 
            patientDoc.full_name, 
            'Update', 
            dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        );
        const execution = await executeRequestAccessToPatientDoc(newAccessRequest, patientDoc.registered_email);
        console.log('execution: ', execution);
        const executionResponse = execution?.response as string;
        // toast - waiting for patient to approve
        listenForChangeToAccess(patientDoc.$id);
    }

    useEffect(() => {
        const doctor = getAccount().then((res) => {
            setDoctor(res);
        });
    });

    return (
        <>
            <div className="w-full h-full flex flex-col justify-between items-center px-32">
                <Navbar mode="patientDetails" />
                {/* MAIN CONTENT */}
                <div className="w-full h-full flex flex-row py-3">
                    <div className="w-3/4 h-full flex flex-col gap-5">
                        <div className="w-full flex flex-col justify-start items-start gap-3">
                            <span className="font-cool text-2xl text-dark-grey">Personal Details</span>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Full Name
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.full_name}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Registered Email
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.registered_email}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Address
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.address}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Personal Identification No.
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.personal_id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-start items-start gap-3">
                            <span className="font-cool text-2xl text-dark-grey">Medical Details</span>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Allergies
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.allergies.map((allergy: string, index: number) => {
                                            if (index === patientDoc.allergies.length - 1) {
                                                return allergy;
                                            } else {
                                                return allergy + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Past Administered Treatments
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.past_treatments.map((treatment: string, index: number) => {
                                            if (index === patientDoc.past_treatments.length - 1) {
                                                return treatment;
                                            } else {
                                                return treatment + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Current Diagnosis
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.current_diagnosis.map((diagnosis: string, index: number) => {
                                            if (index === patientDoc.current_diagnosis.length - 1) {
                                                return diagnosis;
                                            } else {
                                                return diagnosis + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Past Diagnosis
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.past_diagnosis.map((diagnosis: string, index: number) => {
                                            if (index === patientDoc.past_diagnosis.length - 1) {
                                                return diagnosis;
                                            } else {
                                                return diagnosis + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Administered Medication
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.administered_meds.map((diagnosis: string, index: number) => {
                                            if (index === patientDoc.administered_meds.length - 1) {
                                                return diagnosis;
                                            } else {
                                                return diagnosis + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-start items-start gap-3">
                            <span className="font-cool text-2xl text-dark-grey">Financial Details</span>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Insurance Company
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.insurance_company}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Policy Number
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.policy_number}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Scope of Treatment
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.treatment_scopes.map((scopes: string, index: number) => {
                                            if (index === patientDoc.treatment_scopes.length - 1) {
                                                return scopes;
                                            } else {
                                                return scopes + ', ';
                                            }
                                        })}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Occupation
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.occupation}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Employer
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.employer}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Employer Contact Phone
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.employer_phone}
                                    </span>
                                </div>
                                <div className="w-full flex flex-row">
                                    <span className="w-2/5 text-lg font-satoshi-bold text-dark-grey">
                                        Employer Contact Email
                                    </span>
                                    <span className="w-3/5 text-lg font-satoshi-med text-orange">
                                        {patientDoc.employer_email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* FOOTER */}
                <div className="w-full h-auto flex flex-row justify-between items-end border-t">
                    <div className="w-3/4 h-full py-2 font-satoshi-med text-dark-grey text-base">
                        <p>This page is read-only, and must not be saved under any circumstances.</p>
                        <p>Doctors can add/edit info if patient authorises it.</p>
                        <p>Patient can print and share details if they consent to it.</p>
                        <p className="font-satoshi-bold-it text-2xl">Make sure to use the button to the right to close the page.</p>
                    </div>
                    <div className="w-1/4 h-full flex justify-end items-center">
                        <button 
                            onClick={() => handleClose()}
                            className="py-3 px-6 bg-orange-light rounded-md transition-all duration-200 hover:drop-shadow-[0_4px_0px_#EE976A]"
                        >
                            <span className="font-satoshi-med text-dark-grey">
                                {
                                    loadingClose ? <Loading color="white" type="points" /> : 'Close Page'
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}