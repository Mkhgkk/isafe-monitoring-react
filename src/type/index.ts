export type Event = {
  _id: { $oid: string };
  stream_id: string;
  title: string;
  description: string;
  timestamp: number;
  thumbnail: string;
  vedio_filename: string;
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
