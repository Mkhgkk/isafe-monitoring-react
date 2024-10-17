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
