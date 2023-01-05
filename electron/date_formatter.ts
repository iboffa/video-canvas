export function formatDate(date: Date): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // months are zero-indexed, so we need to add 1
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(
    2,
    '0'
  )}_${String(hours).padStart(2, '0')}${String(minutes).padStart(
    2,
    '0'
  )}${String(seconds).padStart(2, '0')}`;
}
