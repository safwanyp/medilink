'use client';

import { client, getDocumentById } from "@/app/appwrite";
import { Models } from "appwrite";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import InvalidAccess from "./invalid";
import ValidAccess from "./valid";
import LoadingIndicator from "@/app/components/loading";

export default function ViewPatientDetailsPage({ params }: {params: {id: string}}) {
    const searchParams = useSearchParams();
    const [accessValid, setAccessValid] = useState<boolean>(false);
    const [patientDoc, setPatientDoc] = useState<Models.Document>();
    const [loading, setLoading] = useState<boolean>(true);
    
    async function checkAccessAndGetDocument(docId: string) {
        const doctor_id = searchParams.get('doctor');
        console.log("docId:", params.id)
        const patient_doc = await getDocumentById(params.id);

        if (!patient_doc) {
            console.log('unauthorized');
            setAccessValid(false);
            setLoading(false);
            return;
        } else {
            setPatientDoc(patient_doc);
            const perms = patient_doc.$permissions;
            if (perms) {
                for (let i = 0; i < perms.length; i++) {
                    const perm = perms[i];
                    if (perm === `read("user:${doctor_id}")`) {
                        console.log('access valid first');
                        setAccessValid(true);
                        break;
                    } else {
                        console.log('access invalid first');
                        setAccessValid(false);
                    }
                }
            }
        }
        setLoading(false);
    }

    async function listenForChangeToAccess(docId: string) {
        const doctor_id = searchParams.get('doctor');
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
                    if (perm === `read("user:${doctor_id}")`) {
                        console.log('access valid second');
                        setAccessValid(true);
                    } else {
                        console.log('access invalid second');
                        setAccessValid(false);
                    }
                }
            });
    }

    useEffect(() => {
        checkAccessAndGetDocument(params.id);
        listenForChangeToAccess(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <LoadingIndicator />;

    return (
        <div className="w-screen h-screen bg-cream bg-opacity-20">
            {
                accessValid 
                    ? <ValidAccess patientDoc={patientDoc as Models.Document}/> 
                    : <InvalidAccess />
            }
        </div>
    );
}