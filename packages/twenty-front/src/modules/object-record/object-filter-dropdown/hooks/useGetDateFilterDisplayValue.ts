import { detectDateFormat } from '@/localization/utils/detection/detectDateFormat';
import { detectTimeFormat } from '@/localization/utils/detection/detectTimeFormat';
import { useUserDateFormat } from '@/ui/input/components/internal/date/hooks/useUserDateFormat';
import { type Temporal } from 'temporal-polyfill';

import {
  WorkspaceMemberDateFormatEnum,
  WorkspaceMemberTimeFormatEnum,
} from '~/generated/graphql';

export const formatZonedDateTimeDatePart = (
  zonedDateTime: Temporal.ZonedDateTime,
  dateFormat: WorkspaceMemberDateFormatEnum,
): string => {
  const MMM = zonedDateTime.toLocaleString('en-US', { month: 'short' });
  const d = zonedDateTime.day;
  const yyyy = zonedDateTime.year;

  switch (dateFormat) {
    case WorkspaceMemberDateFormatEnum.SYSTEM: {
      const detectedFormat = WorkspaceMemberDateFormatEnum[detectDateFormat()];

      return formatZonedDateTimeDatePart(zonedDateTime, detectedFormat);
    }
    case WorkspaceMemberDateFormatEnum.MONTH_FIRST:
      return `${MMM} ${d}, ${yyyy}`;
    case WorkspaceMemberDateFormatEnum.DAY_FIRST:
      return `${d} ${MMM}, ${yyyy}`;
    case WorkspaceMemberDateFormatEnum.YEAR_FIRST:
      return `${yyyy} ${MMM} ${d}`;
  }
};

export const formatZonedDateTimeTimePart = (
  zonedDateTime: Temporal.ZonedDateTime,
  dateFormat: WorkspaceMemberTimeFormatEnum,
): string => {
  const h24 = zonedDateTime.hour.toString().padStart(2, '0');
  const m = zonedDateTime.minute.toString().padStart(2, '0');

  switch (dateFormat) {
    case WorkspaceMemberTimeFormatEnum.SYSTEM: {
      const detectedFormat = WorkspaceMemberTimeFormatEnum[detectTimeFormat()];

      return formatZonedDateTimeTimePart(zonedDateTime, detectedFormat);
    }
    case WorkspaceMemberTimeFormatEnum.HOUR_12: {
      const hour12 = zonedDateTime.hour % 12 || 12;
      const suffix = zonedDateTime.hour < 12 ? 'AM' : 'PM';

      return `${hour12}:${m} ${suffix}`;
    }
    case WorkspaceMemberTimeFormatEnum.HOUR_24: {
      return `${h24}:${m}`;
    }
  }
};

export const useGetDateFilterDisplayValue = () => {
  const { userDateFormat } = useUserDateFormat();

  const getDateFilterDisplayValue = (zonedDateTime: Temporal.ZonedDateTime) => {
    const displayValue = `${formatZonedDateTimeDatePart(zonedDateTime, userDateFormat)}`;

    return { displayValue };
  };

  return {
    getDateFilterDisplayValue,
  };
};
