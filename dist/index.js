"use strict";
/*

Hemispheric Calendar Converter

Hemidate validation & conversion functions

Original by Leonard Ritter <contact@leonard-ritter.com>
https://bitbucket.org/paniq/hemidate/src/default/

Ported to TypeScript by Jannik Fittje <j.lemberg@nullwerk.de>
I realize my e-mail address is outdated

*/
exports.__esModule = true;
var months = [
    ['Northbound', 91, 91],
    ['High North', 91, 92],
    ['Southbound', 91, 91],
    ['High South', 92, 92],
];
var offset = 36;
function assert(condition, message) {
    if (message === void 0) { message = 'Assertion failed'; }
    if (condition === false) {
        throw new Error(message);
    }
}
var isLeapYear = function (year) { return !((year % 4) || (!(year % 100) && year % 400)); };
var ordinal = function (n) { return "" + n + ([, 'st', 'nd', 'rd'][n % 100 >> 3 ^ 1 && n % 10] || 'th'); };
function validate(d) {
    var year = d.year, month = d.month, day = d.day;
    var isLeap = isLeapYear(year);
    var dayIndex = isLeap ? 2 : 1;
    assert((month >= 1) && (month <= 4), 'Month must be 1..4');
    var mDays = months[month - 1][dayIndex];
    assert((day >= 1) && (day <= mDays), "Day must be 1.." + mDays);
}
exports.validate = validate;
function format(d) {
    validate(d);
    var year = d.year, month = d.month, day = d.day;
    return ordinal(day) + " of " + months[month - 1][0] + ", " + year;
}
exports.format = format;
function fromDate(d) {
    var year = d.getFullYear();
    var begin = new Date(year, 0, 0);
    var day = Math.floor((d.getTime() - begin.getTime()) / 86400000);
    day -= offset;
    if (day < 0)
        year += 1;
    var isLeap = isLeapYear(year);
    var totalDays = isLeap ? 366 : 365;
    var dayIndex = isLeap ? 2 : 1;
    if (day < 0)
        day += totalDays;
    var x = day;
    var month = 1;
    for (var _i = 0, months_1 = months; _i < months_1.length; _i++) {
        var info = months_1[_i];
        var mDays = info[dayIndex];
        if (x < mDays)
            break;
        month++;
        x -= mDays;
    }
    return { year: year, month: month, day: x };
}
exports.fromDate = fromDate;
function toDate(d) {
    validate(d);
    var year = d.year;
    var m = d.month - 1;
    var x = d.day;
    var isLeap = isLeapYear(year);
    var totalDays = isLeap ? 366 : 365;
    var dayIndex = isLeap ? 2 : 1;
    var day = 0;
    for (var index in months) {
        var i = Number(index);
        var mDays = months[i][dayIndex];
        if (m > i) {
            day += mDays;
        }
        else {
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
exports.toDate = toDate;
