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
        } else {
            console.log(error);
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