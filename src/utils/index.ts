import config from "../config/default.config";

export const getUnixTimestamp = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  date.setHours(hours);
  date.setMinutes(minutes);

  const unixTimestamp = Math.floor(date.getTime() / 1000);

  return unixTimestamp;
};

export const getDateFromUnixTimestamp = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000);
};

export const getThumbnailUrl = (thumbnail: string) =>
  `http://${config.BACKEND_URL}/static/thumbnails/${thumbnail}`;
