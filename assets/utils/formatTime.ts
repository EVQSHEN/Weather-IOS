export function formatTime(date: string) {
  const inputDate = new Date(date);
  let hours = inputDate.getHours();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const outputTime = hours + amOrPm;
  return outputTime;
}
