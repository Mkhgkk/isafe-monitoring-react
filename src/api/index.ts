import { account, databases } from "@/services/appwrite";
import { Query } from "appwrite";
import apiClient from "./apiClient";

export const authService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    console.log("login");
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  },
  getMe: async () => {
    console.log("getMe");
    const me = await account.get();
    return me;
  },
  createAccount: async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    console.log("createAccount");
    const uniqueID = "iguard_" + Math.random().toString(36).substring(2);
    const response = await account.create(uniqueID, email, password, username);
    return response;
  },
  logout: async () => {
    return await account.deleteSession(
      "current" // sessionId
    );
  },
};

export const scheduleService = {
  fetchSchedules: async () => {
    const response = await databases.listDocuments(
      "isafe-guard-db",
      "66fa20d600253c7d4503",
      [Query.greaterThan("end_timestamp", Math.floor(Date.now() / 1000))]
    );
    return response.documents;
  },
  createSchedule: async (schedule: {
    description?: string;
    stream_id: string;
    start_timestamp: number;
    end_timestamp: number;
    location: string;
    model_name: string;
    stream_document_id: string;
  }) => {
    const response = await apiClient.post(
      "/api/stream/create_schedule",
      schedule
    );
    return response.data;
  },
};

export const streamService = {
  fetchStreams: async () => {
    const response = await databases.listDocuments(
      "isafe-guard-db",
      "66f504260003d64837e5"
    );
    return response.documents;
  },
};
