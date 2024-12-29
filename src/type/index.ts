export type Event = {
  _id: { $oid: string };
  stream_id: string;
  reasons: EventCause[];
  timestamp: number;
  thumbnail: string;
  vedio_filename: string;
  model_name: string;
};

export type Stream = {
  stream_id: string;
  description: string;
  rtsp_link: string;
  cam_ip?: string;
  ptz_port?: number;
  ptz_username?: string;
  ptz_password?: string;
  is_active?: boolean;
  location: string;
  model_name: string;
};

export type EventCause =
  | "instrusion"
  | "missing_helment"
  | "mobile_scaffold_no_outtrigger"
  | "opened_hatch"
  | "same_vertical_area"
  | "missing_hook"
  | "fire"
  | "smoke"
  | "missing_guardrail"
  | "missing_fire_extinguisher"
  | "missing_fire_net";
