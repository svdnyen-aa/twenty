import {
  formatZonedDateTimeDatePart,
  formatZonedDateTimeTimePart,
} from '@/object-record/object-filter-dropdown/hooks/useGetDateFilterDisplayValue';
import { useUserDateFormat } from '@/ui/input/components/internal/date/hooks/useUserDateFormat';
import { useUserTimeFormat } from '@/ui/input/components/internal/date/hooks/useUserTimeFormat';
import { useUserTimezone } from '@/ui/input/components/internal/date/hooks/useUserTimezone';
import { type Temporal } from 'temporal-polyfill';

export const useGetDateTimeFilterDisplayValue = () => {
  const { isSystemTimezone, getTimezoneAbbreviationForPointInTime } =
    useUserTimezone();

  const { userDateFormat } = useUserDateFormat();
  const { userTimeFormat } = useUserTimeFormat();

  const getDateTimeFilterDisplayValue = (
    referenceZonedDateTime: Temporal.ZonedDateTime,
  ) => {
    const timezoneSuffix = !isSystemTimezone
      ? ` (${getTimezoneAbbreviationForPointInTime(referenceZonedDateTime)})`
      : '';

    const displayValue = `${formatZonedDateTimeDatePart(referenceZonedDateTime, userDateFormat)} ${formatZonedDateTimeTimePart(referenceZonedDateTime, userTimeFormat)}${timezoneSuffix}`;

    return { displayValue };
  };

  return {
    getDateTimeFilterDisplayValue,
  };
};
