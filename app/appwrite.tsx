import { Client, Account, Databases, ID, AppwriteException } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);
export const database = new Databases(client);

export async function createAccount(email: string, password: string) {
    try {
        const promise = await account.create(ID.unique(), password, email);
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

export async function login() {
    try {
        const promise = account.createEmailSession('test@test.com', 'aabbccdd');
        return promise;
    } catch (error) {
        if (error instanceof AppwriteException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}