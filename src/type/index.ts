import { Models } from "appwrite";

export type Schedule = {
  start_timestamp: number;
  end_timestamp: number;
  location: string;
  description?: string;
  stream_id: string;
  model_name: string;
};
export type ScheduleDocument = Models.Document & Schedule;

export type Event = {
  stream_id: string;
  title: string;
  description: string;
  timestamp: number;
  thumbnail: string;
  vedio_filename: string;
};
export type EventDocument = Models.Document & Event;

export type Stream = {
  stream_id: string;
  description: string;
  rtsp_link: string;
  cam_ip?: string;
  ptz_port?: number;
  ptz_username?: string;
  ptz_password?: string;
  is_active?: boolean;
};
export type StreamDocument = Models.Document & Stream;
