/**
 * Cal.com configuration.
 *
 * SETUP:
 * 1. Sign up at https://cal.com (use Google login with info@carcaremobilefi.com)
 * 2. Pick a username, e.g. "carcaremobile" → your profile becomes https://cal.com/carcaremobile
 * 3. Create event types with slugs matching the keys below (refresh / deep / full)
 *    - Duration: 90 / 240 / 360 min respectively
 *    - Location: "In-person (attendee address)"
 *    - Buffer time: 30 min before/after
 *    - Min. notice: 24h
 * 4. Settings → Calendars → connect Google Calendar (info@carcaremobilefi.com)
 *    This is what prevents double bookings — Cal.com reads your busy slots.
 * 5. Replace CAL_USERNAME below with your actual username.
 */

export const CAL_USERNAME = "carcaremobile";

/** Cal.com event-type slug per service id. Create matching event types in Cal. */
export const CAL_EVENTS: Record<string, string> = {
  refresh: "refresh",
  deep: "deep",
  full: "full",
};

/** Returns `username/event-slug` for the Cal embed component. */
export function calLinkFor(serviceId: string): string {
  const slug = CAL_EVENTS[serviceId] ?? CAL_EVENTS.deep;
  return `${CAL_USERNAME}/${slug}`;
}

export const CAL_CONFIGURED = (CAL_USERNAME as string) !== "YOUR-USERNAME";
