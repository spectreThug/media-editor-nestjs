import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ar-sa';

export enum DateFormat {
  '0:00 PM' = 'LT',
  '0:00:00 PM' = 'LTS',
  '00/00/0000' = 'L',
  '0/00/0000' = 'l',
  'Aug 16, 2018' = 'll',
  'Aug 16, 2018 0:00 PM' = 'lll',
  'Thu, Aug 16, 2018 0:00 PM' = 'llll',
  '00/00/0000 0:00 PM' = 'L LT',
  '00/00/0000 0:00:00 PM' = 'L LTS',
  'August 16, 2018' = 'LL',
  'August 16, 2018 0:00 PM' = 'LLL',
  'Thursday, August 16, 2018 0:00 PM' = 'LLLL',
}

enum variables {
  '$GETX' = 'يوم',
  '$GETXX' = 'الموافق',
  '$GETXXX' = 'الساعه',
  '$GETXXXX' = 'بتاريخ',
  //programmer refrence
  '$X' = '$SHIFT',

  //shifts
  '$morning' = 'صباحا',
  '$evening' = 'مساءً',
  '$night' = 'ليلاً',
  '$noon' = 'ظهراً',
  '$afternoon' = 'عصراً',
}

export enum forms {
  'يوم {DAY} الموافق {DATE} الساعه {TIME} {SHIFT}' = '$GETX dddd $GETXX DD/MM/YYYY $GETXXX hh:mm $X',
  'يوم {DAY} بتاريخ {DATE} الساعه {TIME} {SHIFT}' = '$GETX dddd $GETXXXX DD/MM/YYYY $GETXXX hh:mm $X',
  '{DAY} يوم {DATE} الساعه {TIME} {SHIFT}' = 'dddd $GETX DD/MM/YYYY $GETXXX hh:mm $X',
}

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export function getEgyptTimeZoneDate(optionalDate?: Date) {
  return dayjs(optionalDate).tz('Africa/Cairo');
}

export function getEgyptTimeZoneDateLocale(optionalDate?: Date) {
  return dayjs(optionalDate).tz('Africa/Cairo').locale('ar-sa');
}

export function getUTCDate(optionalDate?: Date) {
  return dayjs(optionalDate).utc();
}

export function getNiceArabicDateFormated(form: forms, optionalDate?: Date) {
  let date = dayjs(optionalDate)
    .tz('Africa/Cairo')
    .locale('ar-sa')
    .format(form);
  const hour = dayjs(optionalDate).tz('Africa/Cairo').locale('ar-sa').hour();

  const vars = date.match(/\$[A-Z]+/g);

  vars.forEach((variable) => {
    if (variable === '$X') {
      switch (true) {
        case hour >= 0 && hour <= 11:
          date = date.replace('$X', variables['$morning']);
          break;
        case hour >= 12 && hour <= 14:
          date = date.replace('$X', variables['$noon']);
          break;
        case hour >= 15 && hour <= 17:
          date = date.replace('$X', variables['$afternoon']);
          break;
        case hour >= 18 && hour <= 23:
          date = date.replace('$X', variables['$evening']);
          break;
      }
    } else {
      date = date.replace(variable, variables[variable]);
    }
  });
  return date;
}
