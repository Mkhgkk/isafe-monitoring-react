import { databases } from "@/services/appwrite";
import apiClient from "./apiClient";
import { Stream } from "@/type";
import { EventFilters } from "@/components/event/list-filter";
import moment from "moment";

export const authService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.post("/api/user/login", {
      email,
      password,
    });

    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/api/user/");
    return response.data;
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
    const response = await apiClient.post("/api/user/", {
      email,
      password,
      username,
    });

    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get("/api/user/logout");
    return response.data;
  },
};

export const streamService = {
  fetchStreams: async () => {
    const response = await apiClient.get("/api/stream");
    return response.data as Stream[];
  },

  fetchStreamById: async (id: string) => {
    const response = await apiClient.get("/api/stream?stream_id=" + id);
    return response.data as Stream;
  },

  startStream: async (id: string) => {
    const response = await apiClient.post("/api/stream/start_stream", {
      stream_id: id,
    });
    return response.data;
  },

  stopStream: async (id: string) => {
    const response = await apiClient.post("/api/stream/stop_stream", {
      stream_id: id,
    });
    return response.data;
  },

  updateStream: async (data: Stream) => {
    const response = await apiClient.post("/api/stream/update_stream", {
      description: data.description,
      cam_ip: data.cam_ip,
      rtsp_link: data.rtsp_link,
      stream_id: data.stream_id,
      ptz_password: data.ptz_password,
      ptz_port: data.ptz_port ? Number(data.ptz_port) : undefined,
      ptz_username: data.ptz_username,
      location: data.location,
      model_name: data.model_name,
    });

    return response.data;
  },

  createStream: async (data: Stream) => {
    const response = await apiClient.post("/api/stream", {
      description: data.description,
      cam_ip: data.cam_ip,
      rtsp_link: data.rtsp_link,
      stream_id: data.stream_id,
      ptz_password: data.ptz_password,
      ptz_port: data.ptz_port ? Number(data.ptz_port) : undefined,
      ptz_username: data.ptz_username,
      location: data.location,
      model_name: data.model_name,
    });

    return response.data;
  },

  deleteStream: async (streamId: string) => {
    const result = await databases.deleteDocument(
      "isafe-guard-db",
      "66f504260003d64837e5",
      streamId
    );

    return result;
  },
  changeAutoTrack: async (streamId: string) => {
    const response = await apiClient.post("/api/stream/change_autotrack", {
      stream_id: streamId,
    });

    return response.data;
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
    const searchParams = new URLSearchParams();
    searchParams.append("limit", option.limit.toString());
    searchParams.append("page", option.page.toString());
    if (query.stream) {
      searchParams.append("stream_id", query.stream);
    }
    if (query.dateRange) {
      const startTime = moment(query.dateRange.from).startOf("day").unix();
      const endTime = moment(query.dateRange.to).endOf("day").unix();

      searchParams.append("start_timestamp", startTime.toString());
      searchParams.append("end_timestamp", endTime.toString());
    }

    const response = await apiClient.get(
      "/api/event?" + searchParams.toString()
    );

    return response.data;
  },
  fetchEventById: async (id: string) => {
    const response = await apiClient.get("/api/event/" + id);
    return response.data;
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
    coords: Coord[];
    streamId: string;
  }) => {
    const response = await apiClient.post("/api/stream/set_danger_zone", data);
    return response.data;
  },
};
