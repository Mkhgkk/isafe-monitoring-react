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

export const userService = {
  updateUsername: async (username: string) => {
    const response = await apiClient.post("/api/user/username", {
      username,
    });

    return response.data;
  },
  updatePassword: async ({
    password,
    newPassword,
  }: {
    password: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post("/api/user/password", {
      current_password: password,
      new_password: newPassword,
    });

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
    const response = await apiClient.post("/api/stream/delete_stream", {
      stream_id: streamId,
    });

    return response.data;
  },
  changeAutoTrack: async (streamId: string) => {
    const response = await apiClient.post("/api/stream/change_autotrack", {
      stream_id: streamId,
    });

    return response.data;
  },

  getPtzPosition: async (streamId: string) => {
    const response = await apiClient.post(
      "/api/stream/get_current_ptz_values",
      {
        stream_id: streamId,
      }
    );

    return response.data;
  },
  setPatrolArea: async ({
    streamId,
    patrolArea,
  }: {
    streamId: string;
    patrolArea: {
      zMin: number;
      zMax: number;
      xMin: number;
      xMax: number;
      yMin: number;
      yMax: number;
    };
  }) => {
    const response = await apiClient.post("/api/stream/save_patrol_area", {
      stream_id: streamId,
      patrol_area: patrolArea,
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
    if (query.dateRange?.from || query.dateRange?.to) {
      let from = query.dateRange?.from;
      let to = query.dateRange?.to;

      if (query.dateRange.from && !query.dateRange.to) {
        to = query.dateRange.from;
      }
      if (query.dateRange.to && !query.dateRange.from) {
        from = query.dateRange.to;
      }
      const startTime = moment(from).startOf("day").unix();
      const endTime = moment(to).endOf("day").unix();

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

export const systemService = {
  getDisk: async () => {
    const response = await apiClient.get("/api/system/disk");
    return response.data;
  },
  getSystemSettings: async () => {
    const response = await apiClient.get("/api/system");
    return response.data;
  },
  updateRetention: async (data: { retention: number }) => {
    const response = await apiClient.post("/api/system/retention", data);
    return response.data;
  },
  updateWatchNotif: async (data: { enable: boolean }) => {
    const response = await apiClient.post("/api/system/watch_notif", data);
    return response.data;
  },
  updateEmailNotif: async (data: { enable: boolean }) => {
    const response = await apiClient.post("/api/system/email_notif", data);
    return response.data;
  },
};
