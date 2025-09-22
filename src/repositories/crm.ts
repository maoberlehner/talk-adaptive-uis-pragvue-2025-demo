type Granularity = "day" | "week" | "month";

type Duration = "last-week" | "last-month" | "last-year";

const getDateRange = (duration: Duration) => {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);

  switch (duration) {
    case "last-week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "last-month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "last-year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return { startDate, endDate };
};

const generatePeriods = (startDate: Date, endDate: Date, granularity: Granularity) => {
  const periods = [];
  const current = new Date(startDate);

  while (current < endDate) {
    const periodStart = new Date(current);
    let periodEnd = new Date(current);

    switch (granularity) {
      case "day":
        periodEnd.setDate(current.getDate() + 1);
        break;
      case "week":
        periodEnd.setDate(current.getDate() + 7);
        break;
      case "month":
        periodEnd.setMonth(current.getMonth() + 1);
        break;
    }

    // Don't exceed the end date
    if (periodEnd > endDate) {
      periodEnd = new Date(endDate);
    }

    periods.push({
      startDate: periodStart,
      endDate: periodEnd,
    });

    current.setTime(periodEnd.getTime());
  }

  return periods;
};

export const orderIntake = ({
  granularity,
  duration,
}: {
  granularity: Granularity;
  duration: Duration;
}) => {
  const { startDate, endDate } = getDateRange(duration);
  const periods = generatePeriods(startDate, endDate, granularity);

  return periods.map((period) => {
    // Generate realistic order intake amounts based on granularity
    let baseAmount;
    let variance;

    switch (granularity) {
      case "day":
        baseAmount = 12000; // ~$12k per day average
        variance = 0.4; // 40% variance
        break;
      case "week":
        baseAmount = 84000; // ~$84k per week average
        variance = 0.3; // 30% variance
        break;
      case "month":
        baseAmount = 360000; // ~$360k per month average
        variance = 0.25; // 25% variance
        break;
    }

    // Add some randomness with weekend/weekday patterns for daily data
    let multiplier = 1;
    if (granularity === "day") {
      const dayOfWeek = period.startDate.getDay();
      // Reduce orders on weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        multiplier = 0.6;
      }
    }

    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const amount = Math.round(baseAmount * multiplier * randomFactor * 100) / 100;

    return {
      startDate: period.startDate,
      endDate: period.endDate,
      amount: amount,
    };
  });
};

export const sales = ({
  granularity,
  duration,
}: {
  granularity: Granularity;
  duration: Duration;
}) => {
  const { startDate, endDate } = getDateRange(duration);
  const periods = generatePeriods(startDate, endDate, granularity);

  return periods.map((period) => {
    // Generate realistic sales amounts (typically 85-95% of order intake)
    let baseAmount;
    let variance;

    switch (granularity) {
      case "day":
        baseAmount = 10800; // ~$10.8k per day average (90% of intake)
        variance = 0.35; // 35% variance
        break;
      case "week":
        baseAmount = 75600; // ~$75.6k per week average
        variance = 0.28; // 28% variance
        break;
      case "month":
        baseAmount = 324000; // ~$324k per month average
        variance = 0.22; // 22% variance
        break;
    }

    // Add some randomness with weekend/weekday patterns for daily data
    let multiplier = 1;
    if (granularity === "day") {
      const dayOfWeek = period.startDate.getDay();
      // Reduce sales on weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        multiplier = 0.65;
      }
    }

    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const amount = Math.round(baseAmount * multiplier * randomFactor * 100) / 100;

    return {
      startDate: period.startDate,
      endDate: period.endDate,
      amount: amount,
    };
  });
};
