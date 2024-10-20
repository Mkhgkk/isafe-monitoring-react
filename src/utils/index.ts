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
