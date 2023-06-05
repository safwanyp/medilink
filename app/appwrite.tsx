import { PatientDoc, Patient } from "@/models/patient_doc";
import { Client, Account, Databases, ID, AppwriteException, Functions } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);
export const database = new Databases(client);
export const functions = new Functions(client);

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
        } else {
            console.log(error);
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
                'N/A',
                'N/A',
                ['N/A'],
                ['N/A'],
                ['N/A'],
                ['N/A'],
                ['N/A'],
                'N/A',
                'N/A',
                ['N/A'],
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                userAcc.$id,
                [JSON.stringify(accessJSON)],
                [JSON.stringify(accessJSON)],
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