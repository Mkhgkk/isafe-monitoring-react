import { Client, Account, Databases } from "appwrite";

// TODO: move these variables to config file
const APPWRITE_ENDPOINT = "http://localhost/v1";
const PROJECT_ID = "66f4c2e6001ef89c0f5c";

const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const appwriteClient = client;