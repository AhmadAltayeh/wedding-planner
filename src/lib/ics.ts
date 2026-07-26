function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

export type IcsEventInput = {
  uid: string;
  title: string;
  startsAt: Date;
  endsAt?: Date | null;
  location?: string | null;
  description?: string | null;
  /** Minutes before start for iPhone Calendar alert */
  remindMins?: number;
};

export function buildIcsEvent(event: IcsEventInput): string {
  const end =
    event.endsAt && event.endsAt > event.startsAt
      ? event.endsAt
      : new Date(event.startsAt.getTime() + 60 * 60 * 1000);
  const alarmMins = Math.max(0, event.remindMins ?? 60);

  function triggerBefore(minutes: number): string {
    if (minutes <= 0) return "-PT0M";
    if (minutes % 1440 === 0) return `-P${minutes / 1440}D`;
    if (minutes % 60 === 0) return `-PT${minutes / 60}H`;
    return `-PT${minutes}M`;
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ahmad and Nour Wedding//Appointments//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsEscape(event.uid)}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(event.startsAt)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
  ];

  if (event.location?.trim()) {
    lines.push(`LOCATION:${icsEscape(event.location.trim())}`);
  }
  if (event.description?.trim()) {
    lines.push(`DESCRIPTION:${icsEscape(event.description.trim())}`);
  }

  lines.push("BEGIN:VALARM");
  lines.push(`TRIGGER:${triggerBefore(alarmMins)}`);
  lines.push("ACTION:DISPLAY");
  lines.push(`DESCRIPTION:${icsEscape(event.title)}`);
  lines.push("END:VALARM");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n") + "\r\n";
}
