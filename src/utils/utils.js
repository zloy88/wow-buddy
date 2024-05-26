export function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatUnixTimestamp(unixTimestamp) {
  return new Date(unixTimestamp * 1000).toLocaleString('de-DE', { timeZone: 'Europe/Amsterdam' });
}


// String to lowercase and replace spaces with underscores
export function formatString(string) {
  return string.toLowerCase().replace(/\s+/g, '_');
}
