import type { TimeZone } from './types';

export const INITIAL_TIMEZONES: TimeZone[] = [
  {
    name: 'Indian Standard Time',
    city: 'New Delhi',
    iana: 'Asia/Kolkata',
    country: 'India',
  },
  {
    name: 'Irish Standard Time',
    city: 'Dublin',
    iana: 'Europe/Dublin',
    country: 'Ireland',
  },
  {
    name: 'Pacific Time',
    city: 'Los Angeles',
    iana: 'America/Los_Angeles',
    country: 'United States',
  },
  {
    name: 'Central Time',
    city: 'Chicago',
    iana: 'America/Chicago',
    country: 'United States',
  },
];

export const ALL_TIMEZONES: TimeZone[] = [
  // Americas
  { name: 'Hawaii-Aleutian Time', city: 'Honolulu', iana: 'Pacific/Honolulu', country: 'United States' },
  { name: 'Alaska Time', city: 'Anchorage', iana: 'America/Anchorage', country: 'United States' },
  { name: 'Pacific Time', city: 'Los Angeles', iana: 'America/Los_Angeles', country: 'United States' },
  { name: 'Pacific Time', city: 'Vancouver', iana: 'America/Vancouver', country: 'Canada' },
  { name: 'Mountain Time', city: 'Denver', iana: 'America/Denver', country: 'United States' },
  { name: 'Mountain Time', city: 'Phoenix', iana: 'America/Phoenix', country: 'United States' },
  { name: 'Mountain Time', city: 'Edmonton', iana: 'America/Edmonton', country: 'Canada' },
  { name: 'Central Time', city: 'Chicago', iana: 'America/Chicago', country: 'United States' },
  { name: 'Central Time', city: 'Mexico City', iana: 'America/Mexico_City', country: 'Mexico' },
  { name: 'Central Time', city: 'Winnipeg', iana: 'America/Winnipeg', country: 'Canada' },
  { name: 'Eastern Time', city: 'New York', iana: 'America/New_York', country: 'United States' },
  { name: 'Eastern Time', city: 'Toronto', iana: 'America/Toronto', country: 'Canada' },
  { name: 'Atlantic Time', city: 'Halifax', iana: 'America/Halifax', country: 'Canada' },
  { name: 'Brasilia Time', city: 'São Paulo', iana: 'America/Sao_Paulo', country: 'Brazil' },
  { name: 'Argentina Standard Time', city: 'Buenos Aires', iana: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
  // Europe & Africa
  { name: 'Greenwich Mean Time', city: 'London', iana: 'Europe/London', country: 'United Kingdom' },
  { name: 'Irish Standard Time', city: 'Dublin', iana: 'Europe/Dublin', country: 'Ireland' },
  { name: 'Central European Time', city: 'Paris', iana: 'Europe/Paris', country: 'France' },
  { name: 'Central European Time', city: 'Berlin', iana: 'Europe/Berlin', country: 'Germany' },
  { name: 'Central European Time', city: 'Rome', iana: 'Europe/Rome', country: 'Italy' },
  { name: 'Central European Time', city: 'Madrid', iana: 'Europe/Madrid', country: 'Spain' },
  { name: 'Eastern European Time', city: 'Athens', iana: 'Europe/Athens', country: 'Greece' },
  { name: 'Moscow Standard Time', city: 'Moscow', iana: 'Europe/Moscow', country: 'Russia' },
  { name: 'West Africa Time', city: 'Lagos', iana: 'Africa/Lagos', country: 'Nigeria' },
  { name: 'South Africa Standard Time', city: 'Johannesburg', iana: 'Africa/Johannesburg', country: 'South Africa' },
  { name: 'East Africa Time', city: 'Nairobi', iana: 'Africa/Nairobi', country: 'Kenya' },
  { name: 'Egypt Standard Time', city: 'Cairo', iana: 'Africa/Cairo', country: 'Egypt' },
  // Asia & Middle East
  { name: 'Gulf Standard Time', city: 'Dubai', iana: 'Asia/Dubai', country: 'United Arab Emirates' },
  { name: 'Indian Standard Time', city: 'New Delhi', iana: 'Asia/Kolkata', country: 'India' },
  { name: 'Pakistan Standard Time', city: 'Karachi', iana: 'Asia/Karachi', country: 'Pakistan' },
  { name: 'Indochina Time', city: 'Bangkok', iana: 'Asia/Bangkok', country: 'Thailand' },
  { name: 'China Standard Time', city: 'Shanghai', iana: 'Asia/Shanghai', country: 'China' },
  { name: 'China Standard Time', city: 'Hong Kong', iana: 'Asia/Hong_Kong', country: 'Hong Kong' },
  { name: 'Singapore Standard Time', city: 'Singapore', iana: 'Asia/Singapore', country: 'Singapore' },
  { name: 'Japan Standard Time', city: 'Tokyo', iana: 'Asia/Tokyo', country: 'Japan' },
  { name: 'Korea Standard Time', city: 'Seoul', iana: 'Asia/Seoul', country: 'South Korea' },
  // Australia & Oceania
  { name: 'Australian Western Standard Time', city: 'Perth', iana: 'Australia/Perth', country: 'Australia' },
  { name: 'Australian Central Standard Time', city: 'Darwin', iana: 'Australia/Darwin', country: 'Australia' },
  { name: 'Australian Central Standard Time', city: 'Adelaide', iana: 'Australia/Adelaide', country: 'Australia' },
  { name: 'Australian Eastern Standard Time', city: 'Sydney', iana: 'Australia/Sydney', country: 'Australia' },
  { name: 'Australian Eastern Standard Time', city: 'Melbourne', iana: 'Australia/Melbourne', country: 'Australia' },
  { name: 'Australian Eastern Standard Time', city: 'Brisbane', iana: 'Australia/Brisbane', country: 'Australia' },
  { name: 'New Zealand Standard Time', city: 'Auckland', iana: 'Pacific/Auckland', country: 'New Zealand' },
];
