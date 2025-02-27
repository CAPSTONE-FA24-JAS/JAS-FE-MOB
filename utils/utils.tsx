export const parseDate = (
  dateString: string,
  type: "dd/mm/yyyy" | "dd/mm/yyy hh/mm/ss"
): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const gmt = -(date.getTimezoneOffset() / 60);
  if (type === "dd/mm/yyy hh/mm/ss") {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} GMT: ${gmt}`;
  }

  return `${day}/${month}/${year} GMT: ${gmt}`;
};

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const extension = fileName.split(".").pop();
  return imageExtensions.includes(extension || "");
};
