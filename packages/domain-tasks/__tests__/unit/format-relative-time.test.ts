import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatRelativeTime } from "../../src/lib/format-relative-time";

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return 'just now' for very recent dates", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const thirtySecondsAgo = new Date("2024-01-01T11:59:30Z");
    expect(formatRelativeTime(thirtySecondsAgo)).toBe("just now");
  });

  it("should return minutes for dates less than an hour ago", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const oneMinuteAgo = new Date("2024-01-01T11:59:00Z");
    expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago");

    const fiveMinutesAgo = new Date("2024-01-01T11:55:00Z");
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");

    const thirtyMinutesAgo = new Date("2024-01-01T11:30:00Z");
    expect(formatRelativeTime(thirtyMinutesAgo)).toBe("30 minutes ago");
  });

  it("should return hours for dates less than a day ago", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const oneHourAgo = new Date("2024-01-01T11:00:00Z");
    expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago");

    const twoHoursAgo = new Date("2024-01-01T10:00:00Z");
    expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");

    const twelveHoursAgo = new Date("2024-01-01T00:00:00Z");
    expect(formatRelativeTime(twelveHoursAgo)).toBe("12 hours ago");
  });

  it("should return days for dates less than a week ago", () => {
    const now = new Date("2024-01-08T12:00:00Z");
    vi.setSystemTime(now);

    const oneDayAgo = new Date("2024-01-07T12:00:00Z");
    expect(formatRelativeTime(oneDayAgo)).toBe("1 day ago");

    const twoDaysAgo = new Date("2024-01-06T12:00:00Z");
    expect(formatRelativeTime(twoDaysAgo)).toBe("2 days ago");

    const sixDaysAgo = new Date("2024-01-02T12:00:00Z");
    expect(formatRelativeTime(sixDaysAgo)).toBe("6 days ago");
  });

  it("should return weeks for dates less than a month ago", () => {
    const now = new Date("2024-01-29T12:00:00Z");
    vi.setSystemTime(now);

    const oneWeekAgo = new Date("2024-01-22T12:00:00Z");
    expect(formatRelativeTime(oneWeekAgo)).toBe("1 week ago");

    const twoWeeksAgo = new Date("2024-01-15T12:00:00Z");
    expect(formatRelativeTime(twoWeeksAgo)).toBe("2 weeks ago");

    const threeWeeksAgo = new Date("2024-01-08T12:00:00Z");
    expect(formatRelativeTime(threeWeeksAgo)).toBe("3 weeks ago");
  });

  it("should return months for dates less than a year ago", () => {
    const now = new Date("2024-06-01T12:00:00Z");
    vi.setSystemTime(now);

    const oneMonthAgo = new Date("2024-05-01T12:00:00Z");
    expect(formatRelativeTime(oneMonthAgo)).toBe("1 month ago");

    const twoMonthsAgo = new Date("2024-04-01T12:00:00Z");
    expect(formatRelativeTime(twoMonthsAgo)).toBe("2 months ago");

    const sixMonthsAgo = new Date("2023-12-01T12:00:00Z");
    expect(formatRelativeTime(sixMonthsAgo)).toBe("6 months ago");
  });

  it("should return years for dates a year or more ago", () => {
    const now = new Date("2025-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const oneYearAgo = new Date("2024-01-01T12:00:00Z");
    expect(formatRelativeTime(oneYearAgo)).toBe("1 year ago");

    const twoYearsAgo = new Date("2023-01-01T12:00:00Z");
    expect(formatRelativeTime(twoYearsAgo)).toBe("2 years ago");
  });

  it("should accept date strings", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const fiveMinutesAgo = "2024-01-01T11:55:00Z";
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
  });
});
