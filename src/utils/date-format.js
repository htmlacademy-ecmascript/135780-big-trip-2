import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const TimeInMilliseconds = {
  HOUR: 3600000,
  DAY: 86400000,
};

const DateFormat = {
  DATE_FOR_TRIP_INFO: 'D MMM',
  DATE_FROM_FORMAT: 'MMM D',
  TIME_FORMAT: 'HH:mm',
  FULL_DATE_FORMAT: 'DD/MM/YY HH:mm',
  MINUTES_FORMAT: 'mm[M]',
  DAY_FORMAT: 'HH[H] mm[M]',
  DAYS_FORMAT: 'DD[D] HH[H] mm[M]',
};

const humanizePointDueDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';

const isEventOver = (dueDate) => dueDate && dayjs(dueDate).isBefore(dayjs(new Date() - TimeInMilliseconds.DAY));

const isFutureEvent = (dueDate) => dueDate && dayjs(dueDate).isAfter(dayjs(new Date() + TimeInMilliseconds.DAY));

const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isSameOrBefore(dayjs(), 'D') && dayjs(dateTo).isSameOrAfter(dayjs(), 'D');

dayjs.extend(duration);

const getDuration = (dateFrom, dateTo) => {

  const endDate = dayjs(dateTo);
  const startDate = dayjs(dateFrom);

  const durationInUnits = dayjs.duration(endDate.diff(startDate));

  const durationInMilliseconds = durationInUnits.$ms;

  const { $d } = durationInUnits;

  const countMonths = $d.months;

  const countYears = $d.years;
  if (countMonths > 0) {
    const monthsInMilliseconds = dayjs.duration(countMonths, 'month');
    $d.days += dayjs.duration(monthsInMilliseconds.$ms).asDays();
  }

  if (countYears > 0) {
    const yearsInMilliseconds = dayjs.duration(countYears, 'year');
    $d.days += dayjs.duration(yearsInMilliseconds.$ms).asDays();
  }

  switch (true) {
    case durationInMilliseconds < TimeInMilliseconds.HOUR:
      return durationInUnits.format(DateFormat.MINUTES_FORMAT);
    case durationInMilliseconds > TimeInMilliseconds.HOUR && durationInMilliseconds < TimeInMilliseconds.DAY:
      return durationInUnits.format(DateFormat.DAY_FORMAT);
    case durationInMilliseconds >= TimeInMilliseconds.DAY:
      return durationInUnits.format(DateFormat.DAYS_FORMAT);
  }
};

export { humanizePointDueDate, getDuration, DateFormat, isEventOver, isFutureEvent, isPresentEvent};
