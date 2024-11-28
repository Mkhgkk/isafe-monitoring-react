import { account, databases } from "@/services/appwrite";
import { Query } from "appwrite";
import apiClient from "./apiClient";
import { Schedule, ScheduleDocument, Stream, StreamDocument } from "@/type";
import { EventFilters } from "@/components/event/list-filter";
import moment from "moment";

export const authService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  },

  getMe: async () => {
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

  fetchAllSchedules: async () => {
    //TODO: Implement paging
    const response = await databases.listDocuments(
      "isafe-guard-db",
      "66fa20d600253c7d4503",
      [Query.orderDesc("start_timestamp")]
    );
    return response.documents as ScheduleDocument[];
  },

  createSchedule: async (
    schedule: Schedule & {
      stream_document_id: string;
    }
  ) => {
    const response = await apiClient.post(
      "/api/stream/create_schedule",
      schedule
    );
    return response.data;
  },

  deleteSchedule: async (schedule: ScheduleDocument) => {
    //TODO: Implement delete schedule
    const response = await apiClient.post(
      "/api/stream/delete_schedule",
      schedule
    );
    return response.data;
  },

  fetchScheduleById: async (id: string) => {
    const response = await databases.getDocument(
      "isafe-guard-db", // Database ID
      "66fa20d600253c7d4503", // Collection ID
      id // Document ID
    );
    return response as ScheduleDocument;
  },
};

export const streamService = {
  fetchStreams: async () => {
    const response = await databases.listDocuments(
      "isafe-guard-db",
      "66f504260003d64837e5"
    );
    return response.documents as StreamDocument[];
  },

  fetchStreamById: async (id: string) => {
    const response = await databases.getDocument(
      "isafe-guard-db",
      "66f504260003d64837e5",
      id
    );
    return response as StreamDocument;
  },

  fetchStreamByStreamId: async (streamId: string) => {
    const response = await databases.listDocuments(
      "isafe-guard-db",
      "66f504260003d64837e5",
      [Query.equal("stream_id", streamId)]
    );

    return response.documents[0] as StreamDocument;
  },

  startStream: async (streamDetails: StreamDocument) => {
    const response = await apiClient.post(
      "/api/stream/start_stream",
      streamDetails
    );
    return response.data;
  },

  updateStream: async (data: Stream & { $id: string }) => {
    const response = await apiClient.post("/api/stream/update_stream", {
      $id: data.$id,
      description: data.description,
      cam_ip: data.cam_ip,
      rtsp_link: data.rtsp_link,
      stream_id: data.stream_id,
      ptz_password: data.ptz_password,
      ptz_port: data.ptz_port ? Number(data.ptz_port) : null,
      ptz_username: data.ptz_username,
      location: data.location,
      model_name: data.model_name,
    });

    return response.data;
  },

  createStream: async (data: Stream) => {
    const response = await databases.createDocument(
      "isafe-guard-db",
      "66f504260003d64837e5",
      "unique()",
      {
        description: data.description,
        cam_ip: data.cam_ip,
        rtsp_link: data.rtsp_link,
        stream_id: data.stream_id,
        ptz_password: data.ptz_password,
        ptz_port: data.ptz_port ? Number(data.ptz_port) : null,
        ptz_username: data.ptz_username,
        location: data.location,
        model_name: data.model_name,
      }
    );

    return response;
  },

  deleteStream: async (streamId: string) => {
    const result = await databases.deleteDocument(
      "isafe-guard-db",
      "66f504260003d64837e5",
      streamId
    );

    return result;
  },
};

export const eventService = {
  fetchEvents: async (
    query: EventFilters,
    option: {
      page: number;
      limit: number;
    }
  ) => {
    const q = [
      Query.orderDesc("timestamp"),
      Query.limit(option.limit),
      Query.offset(option.page),
    ];

    if (query.stream) {
      q.push(Query.equal("stream_id", query.stream));
    }

    if (query.date) {
      const startTime = moment(query.date).startOf("day").unix();
      const endTime = moment(query.date).endOf("day").unix();

      q.push(Query.between("timestamp", startTime, endTime));
    }

    const response = await databases.listDocuments(
      "isafe-guard-db",
      "670d337f001f9ab7ff34",
      q
    );

    return response.documents;
  },
  fetchAllEvents: async (
    query: EventFilters,
    option: {
      page: number;
      limit: number;
    }
  ) => {
    const q = [
      Query.orderDesc("timestamp"),
      Query.limit(option.limit),
      Query.offset(option.page),
    ];

    if (query.stream) {
      q.push(Query.equal("stream_id", query.stream));
    }

    if (query.dateRange && query.dateRange.from && query.dateRange.to) {
      const startTime = moment(query.dateRange.from).startOf("day").unix();
      const endTime = moment(query.dateRange.to).endOf("day").unix();

      q.push(Query.between("timestamp", startTime, endTime));
    }

    const response = await databases.listDocuments(
      "isafe-guard-db",
      "670d337f001f9ab7ff34",
      q
    );

    return response.documents;
  },
  fetchEventById: async (id: string) => {
    const event = await databases.getDocument(
      "isafe-guard-db",
      "670d337f001f9ab7ff34",
      id
    );

    const related = await databases.listDocuments(
      "isafe-guard-db",
      "670d337f001f9ab7ff34",
      [
        Query.equal("stream_id", event.stream_id),
        Query.between(
          "timestamp",
          event.timestamp - 60 * 60 * 1000,
          event.timestamp + 60 * 60 * 1000
        ),
        Query.limit(4),
      ]
    );

    return { event, related: related.documents };
  },
};

type Coord = [number, number];

export const configService = {
  getHazardTargetImage: async (streamId: string) => {
    const response = await apiClient.post("/api/stream/get_current_frame", {
      stream_id: streamId,
    });

    return response.data;
  },
  setDangerZone: async (data: {
    image: string;
    coords: [Coord, Coord, Coord, Coord];
    streamId: string;
  }) => {
    const response = await apiClient.post("/api/stream/set_danger_zone", data);
    return response.data;
  },
};
