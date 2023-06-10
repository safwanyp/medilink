'use client';

import { executeDoctorAccessApproveFunction } from "@/app/appwrite";
import { Access } from "@/models/patient_doc";
import { Button } from "@nextui-org/react";

export default function AuthActionElement({ request }: { request: Access }) {
    async function approve() {
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
        console.log('reject');
    }



    return (
        <div className="flex flex-row gap-2">
            <Button 
                auto 
                css={{backgroundColor: '$green800'}}
                onClick={() => approve()}
            >   Approve
            </Button>
            <Button 
                auto 
                css={{backgroundColor: '$red600'}}
                onClick={() => reject()}
            >   Reject
            </Button>
        </div>
    );
}