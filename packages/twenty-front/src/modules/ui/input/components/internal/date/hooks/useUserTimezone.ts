import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useRecoilValue } from 'recoil';
import { type Temporal } from 'temporal-polyfill';

export const useUserTimezone = () => {
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const userTimezone =
    currentWorkspaceMember?.timeZone !== 'system'
      ? (currentWorkspaceMember?.timeZone ?? systemTimeZone)
      : systemTimeZone;

  const isSystemTimezone = userTimezone === systemTimeZone;

  const getTimezoneAbbreviationForPointInTime = (
    zonedDateTime: Temporal.ZonedDateTime,
  ) => {
    const parts = new Intl.DateTimeFormat('en', {
      timeZoneName: 'short',
      timeZone: userTimezone,
    }).formatToParts(new Date(zonedDateTime.toInstant().toString()));

    const timeZoneName = parts.filter((p) => p.type === 'timeZoneName')[0]
      .value;

    return timeZoneName;
  };

  return {
    userTimezone,
    isSystemTimezone,
    getTimezoneAbbreviationForPointInTime,
  };
};
