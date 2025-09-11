import type { TimeZone } from './types';

export const INITIAL_TIMEZONES: TimeZone[] = [
  {
    name: 'Indian Standard Time',
    city: 'New Delhi',
    iana: 'Asia/Kolkata',
  },
  {
    name: 'Irish Standard Time',
    city: 'Dublin',
    iana: 'Europe/Dublin',
  },
  {
    name: 'Pacific Time',
    city: 'Los Angeles',
    iana: 'America/Los_Angeles',
  },
  {
    name: 'Central Time',
    city: 'Chicago',
    iana: 'America/Chicago',
  },
];

export const ALL_TIMEZONES: TimeZone[] = [
  { name: 'Hawaii-Aleutian Time', city: 'Honolulu', iana: 'Pacific/Honolulu' },
  { name: 'Alaska Time', city: 'Anchorage', iana: 'America/Anchorage' },
  { name: 'Pacific Time', city: 'Los Angeles', iana: 'America/Los_Angeles' },
  { name: 'Mountain Time', city: 'Denver', iana: 'America/Denver' },
  { name: 'Central Time', city: 'Chicago', iana: 'America/Chicago' },
  { name: 'Eastern Time', city: 'New York', iana: 'America/New_York' },
  { name: 'Atlantic Time', city: 'Halifax', iana: 'America/Halifax' },
  { name: 'Brasilia Time', city: 'São Paulo', iana: 'America/Sao_Paulo' },
  { name: 'Greenwich Mean Time', city: 'London', iana: 'Europe/London' },
  { name: 'Central European Time', city: 'Paris', iana: 'Europe/Paris' },
  { name: 'Eastern European Time', city: 'Athens', iana: 'Europe/Athens' },
  { name: 'Irish Standard Time', city: 'Dublin', iana: 'Europe/Dublin' },
  { name: 'Moscow Standard Time', city: 'Moscow', iana: 'Europe/Moscow' },
  { name: 'South Africa Standard Time', city: 'Johannesburg', iana: 'Africa/Johannesburg' },
  { name: 'Indian Standard Time', city: 'New Delhi', iana: 'Asia/Kolkata' },
  { name: 'Gulf Standard Time', city: 'Dubai', iana: 'Asia/Dubai' },
  { name: 'China Standard Time', city: 'Shanghai', iana: 'Asia/Shanghai' },
  { name: 'Japan Standard Time', city: 'Tokyo', iana: 'Asia/Tokyo' },
  { name: 'Australian Western Standard Time', city: 'Perth', iana: 'Australia/Perth' },
  { name: 'Australian Central Standard Time', city: 'Darwin', iana: 'Australia/Darwin' },
  { name: 'Australian Eastern Standard Time', city: 'Sydney', iana: 'Australia/Sydney' },
  { name: 'New Zealand Standard Time', city: 'Auckland', iana: 'Pacific/Auckland' },
];
