'use client';

import { executeDoctorAccessApproveFunction, executeDoctorAccessRejectFunction } from "@/app/appwrite";
import { Access } from "@/models/patient_doc";
import { Button, Loading } from "@nextui-org/react";
import { useState } from "react";

export default function AuthActionElement({ request }: { request: Access }) {
    const [loading, setLoading] = useState(false);

    async function approve() {
        setLoading(true);
        console.log('Payload: ', request);

        const execution = await executeDoctorAccessApproveFunction(
            request.patient_id as string,
            request.doctor_id as string,
            request.access_type as string,
            request.patient_name as string,
            request.doctor_name as string,
        );
        console.log('execution: ', execution);
    }

    async function reject() {
        setLoading(true);
        console.log('Payload: ', request);

        const execution = await executeDoctorAccessRejectFunction(
            request.patient_id as string, 
            request.doctor_id as string, 
            request.access_type as string,
            request.patient_name as string,
            request.doctor_name as string,
        );
        console.log('execution: ', execution);

    }



    return (
        <div className="flex flex-row gap-2 justify-center items-center">
            {loading === false ? <Button 
                auto 
                css={{backgroundColor: '$green800'}}
                onClick={() => approve()}
            >   Approve
            </Button> : null}
            {loading === false ? <Button 
                auto 
                css={{backgroundColor: '$red600'}}
                onClick={() => reject()}
            >   Reject
            </Button> : null}
            {loading ? <Loading color="warning" /> : null}
        </div>
    );
}