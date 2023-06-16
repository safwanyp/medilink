import StringToJSON from "@/helpers/stringToJSON";
import { Access, Patient, PatientDoc } from "@/models/patient_doc";
import { Client, Account, Databases, ID, AppwriteException, Functions, Query, Models, Teams } from "appwrite";
import { useState } from "react";

export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);
export const database = new Databases(client);
export const functions = new Functions(client);
export const teams = new Teams(client);

export var userDocId = '';

export async function deleteSession() {
    try {
        const promise = await account.deleteSession('current');
        window.location.href = '/';
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

export async function getUserDocId() {
    try {
        const acc = await getAccount();
        if (acc) {
            const promise = await database.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID as string,
                process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string,
                [
                    Query.equal('patient_id', acc.$id)
                ]
            );
            const data = StringToJSON(JSON.stringify(promise.documents[0]));
            userDocId = data.$id;
            return data.$id;
        }
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

export async function createAccount(email: string, password: string, name: string) {
    try {
        const promise = await account.create(ID.unique(), email, password, name);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function createSession(email: string, password: string) {
    try {
        const promise = await account.createEmailSession(email, password);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return error;
        } else {
            console.log(error);
            return error;
        }
    }
}

export async function sendVerificationEmail(url: string) {
    try {
        const promise = await account.createVerification(url);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function confirmEmail(userId: string, secret: string) {
    try {
        const promise = await account.updateVerification(userId, secret);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}


export async function getAccount() {
    try {
        const promise = await account.get();
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

export async function createPasswordRecovery(email: string) {
    try {
        const promise = account.createRecovery(email, `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/recover`);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function resetPassword(userId: string, secret: string, password: string, confirmPassword: string) {
    try {
        const promise = account.updateRecovery(userId, secret, password, confirmPassword);
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return error;
        } else {
            console.log(error);
            return error;
        }
    }
}

export async function executeTeamsFunction(id: string, mode: string, email: string) {
    try {
        if (id === '') {
            return;
        } else {
            const promise = await functions.createExecution(
                id,
                `{
                    "mode": "${mode}", 
                    "email": "${email}"
                }`
            );
            return promise;
        }
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function createUserDocument(mode: string) {
    try {
        const userAcc = await getAccount();
        console.log('userAcc: ', userAcc);

        const accessJSON = {
            doctor_id: 'N/A',
            doctor_name: 'N/A',
            patient_id: 'N/A',
            patient_name: 'N/A',
            access_type: 'N/A',
            access_date_time: 'N/A'
        }

        if (userAcc) {
            const data = new Patient(
                userAcc.name,
                userAcc.email,
                '123 Baker Street',
                '42378932',
                ['Peanuts', 'Shellfish', 'Dust'],
                ['Radiation Therapy', 'Chemotherapy', 'Surgery'],
                ['Hypertenstion', 'Diabetes'],
                ['Asthma, Heart Disease'],
                ['Lanzol', 'Cefixime', 'Cefpodoxime'],
                'Worldwide Insurance',
                '5642378',
                ['Dental', 'Vision'],
                'Software Developer',
                '921001103',
                'emp@appwrite.io',
                'Appwrite',
                userAcc.$id,
                [JSON.stringify(accessJSON)],
                [JSON.stringify(accessJSON)],
                [JSON.stringify(accessJSON)]
            );

            console.log('data: ', JSON.stringify(data));

            const promise = await functions.createExecution(
                process.env.NEXT_PUBLIC_CREATE_USER_DOC_FUNCTION_ID as string,
                `{
                    "mode": "${mode}",
                    "user_id": "${userAcc.$id}",
                    "data": ${JSON.stringify(data)}
                }`
            );

            if (promise) {
                return promise;
            } else {
                return;
            }
        } else {
            console.log('userAcc is null');
        }
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function getPatientDocId(email: string) {
    try {
        console.log('email: ', email);
        const promise = await database.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string,
            [
                Query.equal('registered_email', email.toString())
            ]
        );

        console.log('promise: ', promise);

        // const doc = promise.documents[0];
        // const patient_id = doc.$id;

        // return patient_id;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

export async function getDocumentById(id: string) {
    try {
        const promise = await database.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string,
            id
        );

        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

export async function getPatientDocument() {
    try {
        const acc = await getAccount();

        if (acc) {
            const promise = await database.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID as string,
                process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string,
                [
                    Query.equal('patient_id', acc.$id)
                ]
            );
            const data = StringToJSON(JSON.stringify(promise.documents[0]));
            return data;
        }
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function getPatientAccessLogs(doc: Models.Document, limit?: number) {
    try {
        const accessArray = doc.past_access;

        var logsToReturn: Access[] = [];
        
        if (limit) {
            for (let i=0; i<accessArray.length; i++) {
                if (i > limit) {
                    accessArray.pop();
                    break;
                } else {
                    logsToReturn.push(StringToJSON(accessArray[i]));
                }
            }
            console.log('logsToReturn: ', logsToReturn);

            return logsToReturn;
        } else {
            for (let i=0; i<accessArray.length; i++) {
                logsToReturn.push(StringToJSON(accessArray[i]));
            }

            return logsToReturn;
        }
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function getPatientAuthAccessLogs(doc: Models.Document) {
    try {
        const authArray = doc.access_request;

        var logsToReturn: Access[] = [];

        for (let i=0; i<authArray.length; i++) {
            logsToReturn.push(StringToJSON(authArray[i]));
        }

        console.log('AuthAccessLogs: ', logsToReturn);

        return logsToReturn;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function getPatientCurrentAccess(doc: Models.Document) {
    try {
        const authArray = doc.current_access;

        var logsToReturn: Access[] = [];

        for (let i=0; i<authArray.length; i++) {
            logsToReturn.push(StringToJSON(authArray[i]));
        }

        console.log('CurrentAccessLogs: ', logsToReturn);

        return logsToReturn;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function executeDoctorAccessApproveFunction(patient_id: string, doctor_id: string, access_type: string, patient_name: string, doctor_name: string) {
    try {
        functions.createExecution(
            process.env.NEXT_PUBLIC_DOCTOR_ACCESS_APPROVE_FUNCTION_ID as string,
            `{
                "patient_id": "${patient_id}",
                "patient_name": "${patient_name}",
                "doctor_id": "${doctor_id}",
                "doctor_name": "${doctor_name}",
                "access_type": "${access_type}"
            }`
        );
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function executeDoctorAccessRejectFunction(patient_id: string, doctor_id: string, access_type: string, patient_name: string, doctor_name: string) {
    try {
        functions.createExecution(
            process.env.NEXT_PUBLIC_DOCTOR_ACCESS_REJECT_FUNCTION_ID as string,
            `{
                "patient_id": "${patient_id}",
                "patient_name": "${patient_name}",
                "doctor_id": "${doctor_id}",
                "doctor_name": "${doctor_name}",
                "access_type": "${access_type}"
            }`
        );
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function executeRevokeDoctorAccessFunction(patient_id: string, doctor_id: string, access_type: string, patient_name: string, doctor_name: string) {
    try {
        const execution = await functions.createExecution(
            process.env.NEXT_PUBLIC_REVOKE_DOCTOR_ACCESS_FUNCTION_ID as string,
            `{
                "patient_id": "${patient_id}",
                "patient_name": "${patient_name}",
                "doctor_id": "${doctor_id}",
                "doctor_name": "${doctor_name}",
                "access_type": "${access_type}"
            }`
        );
        return execution.response;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export async function executeRequestAccessToPatientDoc(request: Access, patient_email: string) {
    try {
        const execution = await functions.createExecution(
            process.env.NEXT_PUBLIC_REQUEST_ACCESS_TO_PATIENT_DOC_FUNCTION_ID as string,
            `{
                "patient_email": "${patient_email}",
                "doctor_id": "${request.doctor_id}",
                "doctor_name": "${request.doctor_name}",
                "patient_id": "${request.patient_id}",
                "patient_name": "${request.patient_name}",
                "access_type": "${request.access_type}",
                "access_date_time": "${request.access_date_time}"
            }`
        );

        console.log('execution: ', execution.response);
        return execution;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
            return;
        } else {
            console.log(error);
            return;
        }
    }
}

// {"doctor_id":"N/A","doctor_name":"N/A","patient_id":"N/A","patient_name":"N/A","access_type":"N/A","access_date_time":"N/A"}