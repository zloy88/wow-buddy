export function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function getDateFromUnixTimestamp(unixTimestamp, locale, timeZone) {
  return new Date(unixTimestamp * 1000).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: timeZone
  });
}

export function getTimeFromUnixTimestamp(unixTimestamp, locale, timeZone) {
  return new Date(unixTimestamp * 1000).toLocaleString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timeZone
  });

}

export function abbreviateNumbers(value) {
  if (!value) return 0;
  function round(num, decimalPlaces) {
    let multiplier = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier;
  }

  if (value >= 10000000000) {
    value = round(value / 1000000000, 1) + "B";
  } else if (value >= 1000000000) {
    value = round(value / 1000000000, 2) + "B";
  } else if (value >= 100000000) {
    value = round(value / 1000000, 1) + "M";
  } else if (value >= 1000000) {
    value = round(value / 1000000, 2) + "M";
  } else if (value >= 1000) {
    value = round(value / 1000, 0) + "K";
  }
  return value;
}

export function getShortMapName(mapName) {
  function strSub(str, start, length) {
    return str.substring(start, start + length);
  }

  const mapNameTemp = mapName.split(" ");
  let mapShortName = "";
  for (let i = 0; i < mapNameTemp.length; i++) {
    mapShortName += strSub(mapNameTemp[i], 0, 1);
  }
  return mapShortName;
}

// String to lowercase and replace spaces with underscores
export function formatString(string) {
  return string.toLowerCase().replace(/\s+/g, '_');
}
