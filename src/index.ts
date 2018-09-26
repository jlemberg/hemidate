/*

Hemispheric Calendar Converter

Hemidate validation & conversion functions

Original by Leonard Ritter <contact@leonard-ritter.com>
https://bitbucket.org/paniq/hemidate/src/default/

Ported to TypeScript by Jannik Fittje <j.lemberg@nullwerk.de>
I realize my e-mail address is outdated

*/

export type Hemidate = {
  year: number,
  month: number,
  day: number
};

const months = [
  ['Northbound', 91, 91],
  ['High North', 91, 92],
  ['Southbound', 91, 91],
  ['High South', 92, 92],
];

const offset = 36;

function assert(condition: boolean, message = 'Assertion failed') {
  if (condition === false) {
    throw new Error(message);
  }
}

const isLeapYear = (year: number): boolean => !((year % 4) || (!(year % 100) && year % 400));

const ordinal = (n: number): string => `${n}${[,'st','nd','rd'][n%100>>3^1&&n%10] || 'th'}`;

export function validate(d: Hemidate) {
  const {year, month, day} = d;
  const isLeap = isLeapYear(year);
  const dayIndex = isLeap ? 2 : 1;
  assert((month >= 1) && (month <= 4), 'Month must be 1..4');
  const mDays = months[month-1][dayIndex];
  assert((day >= 1) && (day <= mDays), `Day must be 1..${mDays}`);
}

export function format(d: Hemidate): string {
  validate(d);
  const {year, month, day} = d;
  return `${ordinal(day)} of ${months[month-1][0]}, ${year}`;
}

export function fromDate(d: Date): Hemidate {
  let year = d.getFullYear();
  const begin = new Date(year, 0, 0);
  let day = Math.floor((d.getTime() - begin.getTime()) / 86400000);
  day -= offset;
  if (day < 0) year += 1;
  const isLeap = isLeapYear(year);
  const totalDays = isLeap ? 366 : 365;
  const dayIndex = isLeap ? 2 : 1;
  if (day < 0) day += totalDays;

  let x = day;
  let month = 1;
  
  for (const info of months) {
    const mDays = <number>info[dayIndex];
    if (x < mDays) break;
    month++;
    x -= mDays;
  }

  return {year, month, day: x};
}

export function toDate(d: Hemidate): Date {
  validate(d);
  let {year} = d;
  const m = d.month - 1;
  const x = d.day;
  const isLeap = isLeapYear(year);
  const totalDays = isLeap ? 366 : 365;
  const dayIndex = isLeap ? 2 : 1;
  let day = 0;
  for (let index in months) {
    const i = Number(index);
    const mDays = <number>months[i][dayIndex];
    if (m > i) {
      day += mDays
    } else {
      day += x;
      break;
    }
  }
  day += offset;
  if (day > totalDays) {
    day -= totalDays;
    year++;
  }
  return new Date(year, 0, day);
}
