import moment from "moment";
import config from "../config/default.config";

export const getUnixTimestamp = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return moment(date).set({ hours, minutes }).unix();
};

export const getDateFromUnixTimestamp = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000);
};

export const getThumbnailUrl = (thumbnail: string, streamId: string) =>
  `${config.PROTOCOL}//${config.BACKEND_URL}/static/${streamId}/thumbnails/${thumbnail}`;

type Unit = "K" | "M" | "G" | "T";
const unitMultipliers = {
  K: 1024,
  M: 1024 ** 2,
  G: 1024 ** 3,
  T: 1024 ** 4,
} as const;

export const convertToBytes = (sizeStr: string) => {
  // Use a regular expression to capture the numeric part and the unit
  const result = sizeStr.match(/^(\d+(?:\.\d+)?)([KMGT])?$/);
  if (!result) {
    throw new Error("Invalid size format");
  }

  const number = parseFloat(result[1]);
  const unit = result[2] as Unit | undefined;

  // Calculate the size in bytes based on the unit
  return unit ? number * unitMultipliers[unit] : number;
};

export const bytesToHumanReadable = (bytes?: number) => {
  if (!bytes) return;

  // Define thresholds for units
  const units: [string, number][] = [
    ["TB", 1024 ** 4],
    ["GB", 1024 ** 3],
    ["MB", 1024 ** 2],
    ["KB", 1024],
  ];

  // Handle special case for bytes smaller than 1 KB
  if (bytes < 1024) return `${bytes} B`;

  // Iterate over units to find the appropriate one
  for (const [unit, limit] of units) {
    if (bytes >= limit) {
      return `${Math.round(bytes / limit)} ${unit}`;
    }
  }

  // Fallback (should not happen in practice)
  return `${bytes} B`;
};
