var DateTimeHelper =  {
    checkdate: function (m, d, y) {
        //  discuss at: http://phpjs.org/functions/checkdate/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Pyerre
        // improved by: Theriault
        //   example 1: checkdate(12, 31, 2000);
        //   returns 1: true
        //   example 2: checkdate(2, 29, 2001);
        //   returns 2: false
        //   example 3: checkdate(3, 31, 2008);
        //   returns 3: true
        //   example 4: checkdate(1, 390, 2000);
        //   returns 4: false

        return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
                .getDate();
    },

    date: function (format, timestamp) {
        //  discuss at: http://phpjs.org/functions/date/
        // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
        // original by: gettimeofday
        //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: MeEtc (http://yass.meetcweb.com)
        // improved by: Brad Touesnard
        // improved by: Tim Wiel
        // improved by: Bryan Elliott
        // improved by: David Randall
        // improved by: Theriault
        // improved by: Theriault
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Theriault
        // improved by: Thomas Beaucourt (http://www.webapp.fr)
        // improved by: JT
        // improved by: Theriault
        // improved by: Rafał Kukawski (http://blog.kukawski.pl)
        // improved by: Theriault
        //    input by: Brett Zamir (http://brett-zamir.me)
        //    input by: majak
        //    input by: Alex
        //    input by: Martin
        //    input by: Alex Wilson
        //    input by: Haravikk
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: majak
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
        // bugfixed by: Chris (http://www.devotis.nl/)
        //        note: Uses global: php_js to store the default timezone
        //        note: Although the function potentially allows timezone info (see notes), it currently does not set
        //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
        //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
        //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
        //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
        //   returns 1: '09:09:40 m is month'
        //   example 2: date('F j, Y, g:i a', 1062462400);
        //   returns 2: 'September 2, 2003, 2:26 am'
        //   example 3: date('Y W o', 1062462400);
        //   returns 3: '2003 36 2003'
        //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
        //   example 4: (x+'').length == 10 // 2009 01 09
        //   returns 4: true
        //   example 5: date('W', 1104534000);
        //   returns 5: '53'
        //   example 6: date('B t', 1104534000);
        //   returns 6: '999 31'
        //   example 7: date('W U', 1293750000.82); // 2010-12-31
        //   returns 7: '52 1293750000'
        //   example 8: date('W', 1293836400); // 2011-01-01
        //   returns 8: '52'
        //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
        //   returns 9: '52 2011-01-02'

        var that = this;
        var jsdate, f;
        // Keep this here (works, but for code commented-out below for file size reasons)
        // var tal= [];
        var txt_words = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // trailing backslash -> (dropped)
        // a backslash followed by any character (including backslash) -> the character
        // empty string -> empty string
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function(t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function(n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // Day
            d: function() { // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function() { // Shorthand day name; Mon...Sun
                return f.l()
                        .slice(0, 3);
            },
            j: function() { // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function() { // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function() { // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function() { // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function() { // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function() { // Day of year; 0..365
                var a = new Date(f.Y(), f.n() - 1, f.j());
                var b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },
            // Week
            W: function() { // ISO-8601 week number
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },
            // Month
            F: function() { // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function() { // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function() { // Shorthand month name; Jan...Dec
                return f.F()
                        .slice(0, 3);
            },
            n: function() { // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function() { // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0))
                        .getDate();
            },
            // Year
            L: function() { // Is leap year?; 0 or 1
                var j = f.Y();
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
            },
            o: function() { // ISO-8601 year
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function() { // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function() { // Last two digits of year; 00...99
                return f.Y()
                        .toString()
                        .slice(-2);
            },
            // Time
            a: function() { // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function() { // AM or PM
                return f.a()
                        .toUpperCase();
            },
            B: function() { // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2;
                // Hours
                var i = jsdate.getUTCMinutes() * 60;
                // Minutes
                var s = jsdate.getUTCSeconds(); // Seconds
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function() { // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function() { // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function() { // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function() { // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function() { // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function() { // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function() { // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },
            // Timezone
            e: function() { // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function() { // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = new Date(f.Y(), 0);
                // Jan 1
                var c = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                var b = new Date(f.Y(), 6);
                // Jul 1
                var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function() { // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function() { // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function() { // Timezone abbreviation; e.g. EST, MDT, ...
                // The following works, but requires inclusion of the very
                // large timezone_abbreviations_list() function.
                /*              var abbr, i, os, _default;
                 if (!tal.length) {
                 tal = that.timezone_abbreviations_list();
                 }
                 if (that.php_js && that.php_js.default_timezone) {
                 _default = that.php_js.default_timezone;
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 if (tal[abbr][i].timezone_id === _default) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 }
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 os = -jsdate.getTimezoneOffset() * 60;
                 if (tal[abbr][i].offset === os) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 */
                return 'UTC';
            },
            Z: function() { // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },
            // Full Date/Time
            c: function() { // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function() { // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function() { // Seconds since UNIX epoch
                return jsdate / 1000 | 0;
            }
        };
        this.date = function(format, timestamp) {
            that = this;
            jsdate = (timestamp === undefined ? new Date() : // Not provided
                    (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                    new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                    );
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
    },

    date_parse: function (date) {
        //  discuss at: http://phpjs.org/functions/date_parse/
        // original by: Brett Zamir (http://brett-zamir.me)
        //  depends on: strtotime
        //   example 1: date_parse('2006-12-12 10:00:00.5');
        //   returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0.5, warning_count: 0, warnings: [], error_count: 0, errors: [], is_localtime: false}

        // BEGIN REDUNDANT
        this.php_js = this.php_js || {};
        // END REDUNDANT

        var ts,
                warningsOffset = this.php_js.warnings ? this.php_js.warnings.length : null,
                errorsOffset = this.php_js.errors ? this.php_js.errors.length : null;

        try {
            this.php_js.date_parse_state = true; // Allow strtotime to return a decimal (which it normally does not)
            ts = this.strtotime(date);
            this.php_js.date_parse_state = false;
        } finally {
            if (!ts) {
                return false;
            }
        }

        var dt = new Date(ts * 1000);

        var retObj = {// Grab any new warnings or errors added (not implemented yet in strtotime()); throwing warnings, notices, or errors could also be easily monitored by using 'watch' on this.php_js.latestWarning, etc. and/or calling any defined error handlers
            warning_count: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset)
                    .length : 0,
            warnings: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset) : [],
            error_count: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset)
                    .length : 0,
            errors: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset) : []
        };
        retObj.year = dt.getFullYear();
        retObj.month = dt.getMonth() + 1;
        retObj.day = dt.getDate();
        retObj.hour = dt.getHours();
        retObj.minute = dt.getMinutes();
        retObj.second = dt.getSeconds();
        retObj.fraction = parseFloat('0.' + dt.getMilliseconds());
        retObj.is_localtime = dt.getTimezoneOffset() !== 0;

        return retObj;
    },

    getdate: function (timestamp) {
        //  discuss at: http://phpjs.org/functions/getdate/
        // original by: Paulo Freitas
        //    input by: Alex
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //   example 1: getdate(1055901520);
        //   returns 1: {'seconds': 40, 'minutes': 58, 'hours': 21, 'mday': 17, 'wday': 2, 'mon': 6, 'year': 2003, 'yday': 167, 'weekday': 'Tuesday', 'month': 'June', '0': 1055901520}

        var _w = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
        var _m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
            'November', 'December'
        ];
        var d = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
                (typeof timestamp === 'object') ? new Date(timestamp) : // Javascript Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
        var w = d.getDay();
        var m = d.getMonth();
        var y = d.getFullYear();
        var r = {};

        r.seconds = d.getSeconds();
        r.minutes = d.getMinutes();
        r.hours = d.getHours();
        r.mday = d.getDate();
        r.wday = w;
        r.mon = m + 1;
        r.year = y;
        r.yday = Math.floor((d - (new Date(y, 0, 1))) / 86400000);
        r.weekday = _w[w] + 'day';
        r.month = _m[m];
        r['0'] = parseInt(d.getTime() / 1000, 10);

        return r;
    },
    
    gettimeofday: function (return_float) {
        //  discuss at: http://phpjs.org/functions/gettimeofday/
        // original by: Brett Zamir (http://brett-zamir.me)
        // original by: Josh Fraser (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/)
        //    parts by: Breaking Par Consulting Inc (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7)
        //  revised by: Theriault
        //   example 1: gettimeofday();
        //   returns 1: {sec: 12, usec: 153000, minuteswest: -480, dsttime: 0}
        //   example 2: gettimeofday(true);
        //   returns 2: 1238748978.49

        var t = new Date(),
                y = 0;

        if (return_float) {
            return t.getTime() / 1000;
        }

        y = t.getFullYear(); // Store current year.
        return {
            sec: t.getUTCSeconds(),
            usec: t.getUTCMilliseconds() * 1000,
            minuteswest: t.getTimezoneOffset(),
            // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
            dsttime: 0 + (((new Date(y, 0)) - Date.UTC(y, 0)) !== ((new Date(y, 6)) - Date.UTC(y, 6)))
        };
    },

    fgmdate: function (format, timestamp) {
        //  discuss at: http://phpjs.org/functions/gmdate/
        // original by: Brett Zamir (http://brett-zamir.me)
        //    input by: Alex
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //  depends on: date
        //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
        //   returns 1: '07:09:40 m is month'

        var dt = typeof timestamp === 'undefined' ? new Date() : // Not provided
                typeof timestamp === 'object' ? new Date(timestamp) : // Javascript Date()
                new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
        timestamp = Date.parse(dt.toUTCString()
                .slice(0, -4)) / 1000;
        return this.date(format, timestamp);
    },
    
    gmmktime: function () {
        //  discuss at: http://phpjs.org/functions/gmmktime/
        // original by: Brett Zamir (http://brett-zamir.me)
        // original by: mktime
        //   example 1: gmmktime(14, 10, 2, 2, 1, 2008);
        //   returns 1: 1201875002
        //   example 2: gmmktime(0, 0, -1, 1, 1, 1970);
        //   returns 2: -1

        var d = new Date(),
                r = arguments,
                i = 0,
                e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

        for (i = 0; i < e.length; i++) {
            if (typeof r[i] === 'undefined') {
                r[i] = d['getUTC' + e[i]]();
                r[i] += (i === 3); // +1 to fix JS months.
            } else {
                r[i] = parseInt(r[i], 10);
                if (isNaN(r[i])) {
                    return false;
                }
            }
        }

        // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
        r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

        // Set year, month (-1 to fix JS months), and date.
        // !This must come before the call to setHours!
        d.setUTCFullYear(r[5], r[3] - 1, r[4]);

        // Set hours, minutes, and seconds.
        d.setUTCHours(r[0], r[1], r[2]);

        // Divide milliseconds by 1000 to return seconds and drop decimal.
        // Add 1 second if negative or it'll be off from PHP by 1 second.
        return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
    },
    
    gmstrftime: function (format, timestamp) {
        //  discuss at: http://phpjs.org/functions/gmstrftime/
        // original by: Brett Zamir (http://brett-zamir.me)
        //    input by: Alex
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //  depends on: strftime
        //   example 1: gmstrftime("%A", 1062462400);
        //   returns 1: 'Tuesday'

        var dt = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
                (typeof timestamp === 'object') ? new Date(timestamp) : // Javascript Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
        timestamp = Date.parse(dt.toUTCString()
                .slice(0, -4)) / 1000;
        return this.strftime(format, timestamp);
    },

    idate: function (format, timestamp) {
        //  discuss at: http://phpjs.org/functions/idate/
        // original by: Brett Zamir (http://brett-zamir.me)
        // original by: date
        // original by: gettimeofday
        //    input by: Alex
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        // improved by: Theriault
        //   example 1: idate('y', 1255633200);
        //   returns 1: 9

        if (format === undefined) {
            throw 'idate() expects at least 1 parameter, 0 given';
        }
        if (!format.length || format.length > 1) {
            throw 'idate format is one char';
        }

        // Fix: Need to allow date_default_timezone_set() (check for this.php_js.default_timezone and use)
        var date = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // Javascript Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                ),
                a;

        switch (format) {
            case 'B':
                return Math.floor(((date.getUTCHours() * 36e2) + (date.getUTCMinutes() * 60) + date.getUTCSeconds() + 36e2) /
                        86.4) % 1e3;
            case 'd':
                return date.getDate();
            case 'h':
                return date.getHours() % 12 || 12;
            case 'H':
                return date.getHours();
            case 'i':
                return date.getMinutes();
            case 'I':
                // capital 'i'
                // Logic original by getimeofday().
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                a = date.getFullYear();
                return 0 + (((new Date(a, 0)) - Date.UTC(a, 0)) !== ((new Date(a, 6)) - Date.UTC(a, 6)));
            case 'L':
                a = date.getFullYear();
                return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
            case 'm':
                return date.getMonth() + 1;
            case 's':
                return date.getSeconds();
            case 't':
                return (new Date(date.getFullYear(), date.getMonth() + 1, 0))
                        .getDate();
            case 'U':
                return Math.round(date.getTime() / 1000);
            case 'w':
                return date.getDay();
            case 'W':
                a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (date.getDay() || 7) + 3);
                return 1 + Math.round((a - (new Date(a.getFullYear(), 0, 4))) / 864e5 / 7);
            case 'y':
                return parseInt((date.getFullYear() + '')
                        .slice(2), 10); // This function returns an integer, unlike date()
            case 'Y':
                return date.getFullYear();
            case 'z':
                return Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 864e5);
            case 'Z':
                return -date.getTimezoneOffset() * 60;
            default:
                throw 'Unrecognized date format token';
        }
    },

    microtime: function (get_as_float) {
        //  discuss at: http://phpjs.org/functions/microtime/
        // original by: Paulo Freitas
        //   example 1: timeStamp = microtime(true);
        //   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
        //   returns 1: true

        var now = new Date()
                .getTime() / 1000;
        var s = parseInt(now, 10);

        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    },

    mktime: function () {
        //  discuss at: http://phpjs.org/functions/mktime/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: baris ozdil
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: FGFEmperor
        // improved by: Brett Zamir (http://brett-zamir.me)
        //    input by: gabriel paderni
        //    input by: Yannoo
        //    input by: jakes
        //    input by: 3D-GRAF
        //    input by: Chris
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Marc Palau
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //  revised by: Theriault
        //        note: The return values of the following examples are
        //        note: received only if your system's timezone is UTC.
        //   example 1: mktime(14, 10, 2, 2, 1, 2008);
        //   returns 1: 1201875002
        //   example 2: mktime(0, 0, 0, 0, 1, 2008);
        //   returns 2: 1196467200
        //   example 3: make = mktime();
        //   example 3: td = new Date();
        //   example 3: real = Math.floor(td.getTime() / 1000);
        //   example 3: diff = (real - make);
        //   example 3: diff < 5
        //   returns 3: true
        //   example 4: mktime(0, 0, 0, 13, 1, 1997)
        //   returns 4: 883612800
        //   example 5: mktime(0, 0, 0, 1, 1, 1998)
        //   returns 5: 883612800
        //   example 6: mktime(0, 0, 0, 1, 1, 98)
        //   returns 6: 883612800
        //   example 7: mktime(23, 59, 59, 13, 0, 2010)
        //   returns 7: 1293839999
        //   example 8: mktime(0, 0, -1, 1, 1, 1970)
        //   returns 8: -1

        var d = new Date(),
                r = arguments,
                i = 0,
                e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

        for (i = 0; i < e.length; i++) {
            if (typeof r[i] === 'undefined') {
                r[i] = d['get' + e[i]]();
                r[i] += (i === 3); // +1 to fix JS months.
            } else {
                r[i] = parseInt(r[i], 10);
                if (isNaN(r[i])) {
                    return false;
                }
            }
        }

        // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
        r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

        // Set year, month (-1 to fix JS months), and date.
        // !This must come before the call to setHours!
        d.setFullYear(r[5], r[3] - 1, r[4]);

        // Set hours, minutes, and seconds.
        d.setHours(r[0], r[1], r[2]);

        // Divide milliseconds by 1000 to return seconds and drop decimal.
        // Add 1 second if negative or it'll be off from PHP by 1 second.
        return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
    },

    strftime: function (fmt, timestamp) {
        //       discuss at: http://phpjs.org/functions/strftime/
        //      original by: Blues (http://tech.bluesmoon.info/)
        // reimplemented by: Brett Zamir (http://brett-zamir.me)
        //         input by: Alex
        //      bugfixed by: Brett Zamir (http://brett-zamir.me)
        //      improved by: Brett Zamir (http://brett-zamir.me)
        //       depends on: setlocale
        //             note: Uses global: php_js to store locale info
        //        example 1: strftime("%A", 1062462400); // Return value will depend on date and locale
        //        returns 1: 'Tuesday'

        this.php_js = this.php_js || {};
        this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
        // END REDUNDANT
        var phpjs = this.php_js;

        // BEGIN STATIC
        var _xPad = function(x, pad, r) {
            if (typeof r === 'undefined') {
                r = 10;
            }
            for (; parseInt(x, 10) < r && r > 1; r /= 10) {
                x = pad.toString() + x;
            }
            return x.toString();
        };

        var locale = phpjs.localeCategories.LC_TIME;
        var locales = phpjs.locales;
        var lc_time = locales[locale].LC_TIME;

        var _formats = {
            a: function(d) {
                return lc_time.a[d.getDay()];
            },
            A: function(d) {
                return lc_time.A[d.getDay()];
            },
            b: function(d) {
                return lc_time.b[d.getMonth()];
            },
            B: function(d) {
                return lc_time.B[d.getMonth()];
            },
            C: function(d) {
                return _xPad(parseInt(d.getFullYear() / 100, 10), 0);
            },
            d: ['getDate', '0'],
            e: ['getDate', ' '],
            g: function(d) {
                return _xPad(parseInt(this.G(d) / 100, 10), 0);
            },
            G: function(d) {
                var y = d.getFullYear();
                var V = parseInt(_formats.V(d), 10);
                var W = parseInt(_formats.W(d), 10);

                if (W > V) {
                    y++;
                } else if (W === 0 && V >= 52) {
                    y--;
                }

                return y;
            },
            H: ['getHours', '0'],
            I: function(d) {
                var I = d.getHours() % 12;
                return _xPad(I === 0 ? 12 : I, 0);
            },
            j: function(d) {
                var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
                ms += d.getTimezoneOffset() * 60000; // Line differs from Yahoo implementation which would be equivalent to replacing it here with:
                // ms = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT') - ms;
                var doy = parseInt(ms / 60000 / 60 / 24, 10) + 1;
                return _xPad(doy, 0, 100);
            },
            k: ['getHours', '0'],
            // not in PHP, but implemented here (as in Yahoo)
            l: function(d) {
                var l = d.getHours() % 12;
                return _xPad(l === 0 ? 12 : l, ' ');
            },
            m: function(d) {
                return _xPad(d.getMonth() + 1, 0);
            },
            M: ['getMinutes', '0'],
            p: function(d) {
                return lc_time.p[d.getHours() >= 12 ? 1 : 0];
            },
            P: function(d) {
                return lc_time.P[d.getHours() >= 12 ? 1 : 0];
            },
            s: function(d) { // Yahoo uses return parseInt(d.getTime()/1000, 10);
                return Date.parse(d) / 1000;
            },
            S: ['getSeconds', '0'],
            u: function(d) {
                var dow = d.getDay();
                return ((dow === 0) ? 7 : dow);
            },
            U: function(d) {
                var doy = parseInt(_formats.j(d), 10);
                var rdow = 6 - d.getDay();
                var woy = parseInt((doy + rdow) / 7, 10);
                return _xPad(woy, 0);
            },
            V: function(d) {
                var woy = parseInt(_formats.W(d), 10);
                var dow1_1 = (new Date('' + d.getFullYear() + '/1/1'))
                        .getDay();
                // First week is 01 and not 00 as in the case of %U and %W,
                // so we add 1 to the final result except if day 1 of the year
                // is a Monday (then %W returns 01).
                // We also need to subtract 1 if the day 1 of the year is
                // Friday-Sunday, so the resulting equation becomes:
                var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31'))
                        .getDay() < 4) {
                    idow = 1;
                } else if (idow === 0) {
                    idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'));
                }
                return _xPad(idow, 0);
            },
            w: 'getDay',
            W: function(d) {
                var doy = parseInt(_formats.j(d), 10);
                var rdow = 7 - _formats.u(d);
                var woy = parseInt((doy + rdow) / 7, 10);
                return _xPad(woy, 0, 10);
            },
            y: function(d) {
                return _xPad(d.getFullYear() % 100, 0);
            },
            Y: 'getFullYear',
            z: function(d) {
                var o = d.getTimezoneOffset();
                var H = _xPad(parseInt(Math.abs(o / 60), 10), 0);
                var M = _xPad(o % 60, 0);
                return (o > 0 ? '-' : '+') + H + M;
            },
            Z: function(d) {
                return d.toString()
                        .replace(/^.*\(([^)]+)\)$/, '$1');
                /*
                 // Yahoo's: Better?
                 var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
                 if(tz.length > 4) {
                 tz = Dt.formats.z(d);
                 }
                 return tz;
                 */
            },
            '%': function(d) {
                return '%';
            }
        };
        // END STATIC
        /* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
         Ec
         EC
         Ex
         EX
         Ey
         EY
         Od or Oe
         OH
         OI
         Om
         OM
         OS
         OU
         Ow
         OW
         Oy
         */

        var _date = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
                (typeof timestamp === 'object') ? new Date(timestamp) : // Javascript Date()
                new Date(timestamp * 1000) // PHP API expects UNIX timestamp (auto-convert to int)
                );

        var _aggregates = {
            c: 'locale',
            D: '%m/%d/%y',
            F: '%y-%m-%d',
            h: '%b',
            n: '\n',
            r: 'locale',
            R: '%H:%M',
            t: '\t',
            T: '%H:%M:%S',
            x: 'locale',
            X: 'locale'
        };

        // First replace aggregates (run in a loop because an agg may be made up of other aggs)
        while (fmt.match(/%[cDFhnrRtTxX]/)) {
            fmt = fmt.replace(/%([cDFhnrRtTxX])/g, function(m0, m1) {
                var f = _aggregates[m1];
                return (f === 'locale' ? lc_time[m1] : f);
            });
        }

        // Now replace formats - we need a closure so that the date object gets passed through
        var str = fmt.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function(m0, m1) {
            var f = _formats[m1];
            if (typeof f === 'string') {
                return _date[f]();
            } else if (typeof f === 'function') {
                return f(_date);
            } else if (typeof f === 'object' && typeof f[0] === 'string') {
                return _xPad(_date[f[0]](), f[1]);
            } else { // Shouldn't reach here
                return m1;
            }
        });
        return str;
    },

    strptime: function (dateStr, format) {
        //  discuss at: http://phpjs.org/functions/strptime/
        // original by: Brett Zamir (http://brett-zamir.me)
        // original by: strftime
        //  depends on: setlocale
        //  depends on: array_map
        //        test: skip
        //   example 1: strptime('20091112222135', '%Y%m%d%H%M%S'); // Return value will depend on date and locale
        //   example 1: strptime('2009extra', '%Y');
        //   returns 1: {tm_sec: 35, tm_min: 21, tm_hour: 22, tm_mday: 12, tm_mon: 10, tm_year: 109, tm_wday: 4, tm_yday: 315, unparsed: ''}
        //   returns 1: {tm_sec:0, tm_min:0, tm_hour:0, tm_mday:0, tm_mon:0, tm_year:109, tm_wday:3, tm_yday: -1, unparsed: 'extra'}

        // tm_isdst is in other docs; why not PHP?

        // Needs more thorough testing and examples

        var retObj = {
            tm_sec: 0,
            tm_min: 0,
            tm_hour: 0,
            tm_mday: 0,
            tm_mon: 0,
            tm_year: 0,
            tm_wday: 0,
            tm_yday: 0,
            unparsed: ''
        },
        i = 0,
                that = this,
                amPmOffset = 0,
                prevHour = false,
                _reset = function(dateObj, realMday) {
                    // realMday is to allow for a value of 0 in return results (but without
                    // messing up the Date() object)
                    var jan1,
                            o = retObj,
                            d = dateObj;
                    o.tm_sec = d.getUTCSeconds();
                    o.tm_min = d.getUTCMinutes();
                    o.tm_hour = d.getUTCHours();
                    o.tm_mday = realMday === 0 ? realMday : d.getUTCDate();
                    o.tm_mon = d.getUTCMonth();
                    o.tm_year = d.getUTCFullYear() - 1900;
                    o.tm_wday = realMday === 0 ? (d.getUTCDay() > 0 ? d.getUTCDay() - 1 : 6) : d.getUTCDay();
                    jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    o.tm_yday = Math.ceil((d - jan1) / (1000 * 60 * 60 * 24));
                },
                _date = function() {
                    var o = retObj;
                    // We set date to at least 1 to ensure year or month doesn't go backwards
                    return _reset(new Date(Date.UTC(o.tm_year + 1900, o.tm_mon, o.tm_mday || 1, o.tm_hour, o.tm_min, o.tm_sec)),
                            o.tm_mday);
                };

        // BEGIN STATIC
        var _NWS = /\S/,
                _WS = /\s/;

        var _aggregates = {
            c: 'locale',
            D: '%m/%d/%y',
            F: '%y-%m-%d',
            r: 'locale',
            R: '%H:%M',
            T: '%H:%M:%S',
            x: 'locale',
            X: 'locale'
        };

        /* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
         Ec
         EC
         Ex
         EX
         Ey
         EY
         Od or Oe
         OH
         OI
         Om
         OM
         OS
         OU
         Ow
         OW
         Oy
         */
        var _preg_quote = function(str) {
            return (str + '')
                    .replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
        };
        // END STATIC

        // BEGIN REDUNDANT
        this.php_js = this.php_js || {};
        this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
        // END REDUNDANT

        var phpjs = this.php_js;
        var locale = phpjs.localeCategories.LC_TIME;
        var locales = phpjs.locales;
        var lc_time = locales[locale].LC_TIME;

        // First replace aggregates (run in a loop because an agg may be made up of other aggs)
        while (format.match(/%[cDFhnrRtTxX]/)) {
            format = format.replace(/%([cDFhnrRtTxX])/g, function(m0, m1) {
                var f = _aggregates[m1];
                return (f === 'locale' ? lc_time[m1] : f);
            });
        }

        var _addNext = function(j, regex, cb) {
            if (typeof regex === 'string') {
                regex = new RegExp('^' + regex, 'i');
            }
            var check = dateStr.slice(j);
            var match = regex.exec(check);
            // Even if the callback returns null after assigning to the return object, the object won't be saved anyways
            var testNull = match ? cb.apply(null, match) : null;
            if (testNull === null) {
                throw 'No match in string';
            }
            return j + match[0].length;
        };

        var _addLocalized = function(j, formatChar, category) {
            return _addNext(j, that.array_map(
                    _preg_quote, lc_time[formatChar])
                    .join('|'), // Could make each parenthesized instead and pass index to callback

                    function(m) {
                        var match = lc_time[formatChar].search(new RegExp('^' + _preg_quote(m) + '$', 'i'));
                        if (match) {
                            retObj[category] = match[0];
                        }
                    });
        };

        // BEGIN PROCESSING CHARACTERS
        for (i = 0, j = 0; i < format.length; i++) {
            if (format.charAt(i) === '%') {
                var literalPos = ['%', 'n', 't'].indexOf(format.charAt(i + 1));
                if (literalPos !== -1) {
                    if (['%', '\n', '\t'].indexOf(dateStr.charAt(j)) === literalPos) { // a matched literal
                        ++i;
                        ++j; // skip beyond
                        continue;
                    }
                    // Format indicated a percent literal, but not actually present
                    return false;
                }
                var formatChar = format.charAt(i + 1);
                try {
                    switch (formatChar) {
                        case 'a':
                            // Fall-through // Sun-Sat
                        case 'A':
                            // Sunday-Saturday
                            j = _addLocalized(j, formatChar, 'tm_wday'); // Changes nothing else
                            break;
                        case 'h':
                            // Fall-through (alias of 'b');
                        case 'b':
                            // Jan-Dec
                            j = _addLocalized(j, 'b', 'tm_mon');
                            _date(); // Also changes wday, yday
                            break;
                        case 'B':
                            // January-December
                            j = _addLocalized(j, formatChar, 'tm_mon');
                            _date(); // Also changes wday, yday
                            break;
                        case 'C':
                            // 0+; century (19 for 20th)
                            j = _addNext(j, /^\d?\d/, // PHP docs say two-digit, but accepts one-digit (two-digit max)

                                    function(d) {
                                        var year = (parseInt(d, 10) - 19) * 100;
                                        retObj.tm_year = year;
                                        _date();
                                        if (!retObj.tm_yday) {
                                            retObj.tm_yday = -1;
                                        }
                                        // Also changes wday; and sets yday to -1 (always?)
                                    });
                            break;
                        case 'd':
                            // Fall-through  01-31 day
                        case 'e':
                            // 1-31 day
                            j = _addNext(j, formatChar === 'd' ? /^(0[1-9]|[1-2]\d|3[0-1])/ : /^([1-2]\d|3[0-1]|[1-9])/,
                                    function(d) {
                                        var dayMonth = parseInt(d, 10);
                                        retObj.tm_mday = dayMonth;
                                        _date(); // Also changes w_day, y_day
                                    });
                            break;
                        case 'g':
                            // No apparent effect; 2-digit year (see 'V')
                            break;
                        case 'G':
                            // No apparent effect; 4-digit year (see 'V')'
                            break;
                        case 'H':
                            // 00-23 hours
                            j = _addNext(j, /^([0-1]\d|2[0-3])/, function(d) {
                                var hour = parseInt(d, 10);
                                retObj.tm_hour = hour;
                                // Changes nothing else
                            });
                            break;
                        case 'l':
                            // Fall-through of lower-case 'L'; 1-12 hours
                        case 'I':
                            // 01-12 hours
                            j = _addNext(j, formatChar === 'l' ? /^([1-9]|1[0-2])/ : /^(0[1-9]|1[0-2])/, function(d) {
                                var hour = parseInt(d, 10) - 1 + amPmOffset;
                                retObj.tm_hour = hour;
                                prevHour = true; // Used for coordinating with am-pm
                                // Changes nothing else, but affected by prior 'p/P'
                            });
                            break;
                        case 'j':
                            // 001-366 day of year
                            j = _addNext(j, /^(00[1-9]|0[1-9]\d|[1-2]\d\d|3[0-6][0-6])/, function(d) {
                                var dayYear = parseInt(d, 10) - 1;
                                retObj.tm_yday = dayYear;
                                // Changes nothing else (oddly, since if original by a given year, could calculate other fields)
                            });
                            break;
                        case 'm':
                            // 01-12 month
                            j = _addNext(j, /^(0[1-9]|1[0-2])/, function(d) {
                                var month = parseInt(d, 10) - 1;
                                retObj.tm_mon = month;
                                _date(); // Also sets wday and yday
                            });
                            break;
                        case 'M':
                            // 00-59 minutes
                            j = _addNext(j, /^[0-5]\d/, function(d) {
                                var minute = parseInt(d, 10);
                                retObj.tm_min = minute;
                                // Changes nothing else
                            });
                            break;
                        case 'P':
                            // Seems not to work; AM-PM
                            return false; // Could make fall-through instead since supposed to be a synonym despite PHP docs
                        case 'p':
                            // am-pm
                            j = _addNext(j, /^(am|pm)/i, function(d) {
                                // No effect on 'H' since already 24 hours but
                                //   works before or after setting of l/I hour
                                amPmOffset = (/a/)
                                        .test(d) ? 0 : 12;
                                if (prevHour) {
                                    retObj.tm_hour += amPmOffset;
                                }
                            });
                            break;
                        case 's':
                            // Unix timestamp (in seconds)
                            j = _addNext(j, /^\d+/, function(d) {
                                var timestamp = parseInt(d, 10);
                                var date = new Date(Date.UTC(timestamp * 1000));
                                _reset(date);
                                // Affects all fields, but can't be negative (and initial + not allowed)
                            });
                            break;
                        case 'S':
                            // 00-59 seconds
                            j = _addNext(j, /^[0-5]\d/, // strptime also accepts 60-61 for some reason

                                    function(d) {
                                        var second = parseInt(d, 10);
                                        retObj.tm_sec = second;
                                        // Changes nothing else
                                    });
                            break;
                        case 'u':
                            // Fall-through; 1 (Monday)-7(Sunday)
                        case 'w':
                            // 0 (Sunday)-6(Saturday)
                            j = _addNext(j, /^\d/, function(d) {
                                retObj.tm_wday = d - (formatChar === 'u');
                                // Changes nothing else apparently
                            });
                            break;
                        case 'U':
                            // Fall-through (week of year, from 1st Sunday)
                        case 'V':
                            // Fall-through (ISO-8601:1988 week number; from first 4-weekday week, starting with Monday)
                        case 'W':
                            // Apparently ignored (week of year, from 1st Monday)
                            break;
                        case 'y':
                            // 69 (or higher) for 1969+, 68 (or lower) for 2068-
                            j = _addNext(j, /^\d?\d/, // PHP docs say two-digit, but accepts one-digit (two-digit max)

                                    function(d) {
                                        d = parseInt(d, 10);
                                        var year = d >= 69 ? d : d + 100;
                                        retObj.tm_year = year;
                                        _date();
                                        if (!retObj.tm_yday) {
                                            retObj.tm_yday = -1;
                                        }
                                        // Also changes wday; and sets yday to -1 (always?)
                                    });
                            break;
                        case 'Y':
                            // 2010 (4-digit year)
                            j = _addNext(j, /^\d{1,4}/, // PHP docs say four-digit, but accepts one-digit (four-digit max)

                                    function(d) {
                                        var year = (parseInt(d, 10)) - 1900;
                                        retObj.tm_year = year;
                                        _date();
                                        if (!retObj.tm_yday) {
                                            retObj.tm_yday = -1;
                                        }
                                        // Also changes wday; and sets yday to -1 (always?)
                                    });
                            break;
                        case 'z':
                            // Timezone; on my system, strftime gives -0800, but strptime seems not to alter hour setting
                            break;
                        case 'Z':
                            // Timezone; on my system, strftime gives PST, but strptime treats text as unparsed
                            break;
                        default:
                            throw 'Unrecognized formatting character in strptime()';
                    }
                } catch (e) {
                    if (e === 'No match in string') { // Allow us to exit
                        return false; // There was supposed to be a matching format but there wasn't
                    }
                }
                ++i; // Calculate skipping beyond initial percent too
            } else if (format.charAt(i) !== dateStr.charAt(j)) {
                // If extra whitespace at beginning or end of either, or between formats, no problem
                // (just a problem when between % and format specifier)

                // If the string has white-space, it is ok to ignore
                if (dateStr.charAt(j)
                        .search(_WS) !== -1) {
                    j++;
                    i--; // Let the next iteration try again with the same format character
                } else if (format.charAt(i)
                        .search(_NWS) !== -1) { // Any extra formatting characters besides white-space causes
                    // problems (do check after WS though, as may just be WS in string before next character)
                    return false;
                }
                // Extra WS in format
                // Adjust strings when encounter non-matching whitespace, so they align in future checks above
                // Will check on next iteration (against same (non-WS) string character)
            } else {
                j++;
            }
        }

        // POST-PROCESSING
        retObj.unparsed = dateStr.slice(j); // Will also get extra whitespace; empty string if none
        return retObj;
    },

    strtotime: function (text, now) {
        //  discuss at: http://phpjs.org/functions/strtotime/
        //     version: 1109.2016
        // original by: Caio Ariede (http://caioariede.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Caio Ariede (http://caioariede.com)
        // improved by: A. Matías Quezada (http://amatiasq.com)
        // improved by: preuter
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Mirko Faber
        //    input by: David
        // bugfixed by: Wagner B. Soares
        // bugfixed by: Artur Tchernychev
        //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        //   example 1: strtotime('+1 day', 1129633200);
        //   returns 1: 1129719600
        //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        //   returns 2: 1130425202
        //   example 3: strtotime('last month', 1129633200);
        //   returns 3: 1127041200
        //   example 4: strtotime('2009-05-04 08:30:00 GMT');
        //   returns 4: 1241425800

        var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

        if (!text) {
            return fail;
        }

        // Unecessary spaces
        text = text.replace(/^\s+|\s+$/g, '')
                .replace(/\s{2,}/g, ' ')
                .replace(/[\t\r\n]/g, '')
                .toLowerCase();

        // in contrast to php, js Date.parse function interprets:
        // dates given as yyyy-mm-dd as in timezone: UTC,
        // dates with "." or "-" as MDY instead of DMY
        // dates with two-digit years differently
        // etc...etc...
        // ...therefore we manually parse lots of common date formats
        match = text.match(
                /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                    case '-':
                        { // YYYY-M-D
                            if (match[3] > 12 || match[5] > 31) {
                                return fail;
                            }

                            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                    case '.':
                        { // YYYY.M.D is not parsed by strtotime()
                            return fail;
                        }
                    case '/':
                        { // YYYY/M/D
                            if (match[3] > 12 || match[5] > 31) {
                                return fail;
                            }

                            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                }
            } else if (match[5] > 1901) {
                switch (match[2]) {
                    case '-':
                        { // D-M-YYYY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                    case '.':
                        { // D.M.YYYY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                    case '/':
                        { // M/D/YYYY
                            if (match[1] > 12 || match[3] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                }
            } else {
                switch (match[2]) {
                    case '-':
                        { // YY-M-D
                            if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                                return fail;
                            }

                            year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                            return new Date(year, parseInt(match[3], 10) - 1, match[5],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                    case '.':
                        { // D.M.YY or H.MM.SS
                            if (match[5] >= 70) { // D.M.YY
                                if (match[3] > 12 || match[1] > 31) {
                                    return fail;
                                }

                                return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                            }
                            if (match[5] < 60 && !match[6]) { // H.MM.SS
                                if (match[1] > 23 || match[3] > 59) {
                                    return fail;
                                }

                                today = new Date();
                                return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                        match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                            }

                            return fail; // invalid format, cannot be parsed
                        }
                    case '/':
                        { // M/D/YY
                            if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                                return fail;
                            }

                            year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                            return new Date(year, parseInt(match[1], 10) - 1, match[3],
                                    match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                    case ':':
                        { // HH:MM:SS
                            if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                                return fail;
                            }

                            today = new Date();
                            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                    match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                        }
                }
            }
        }

        // other formats and "now" should be parsed by Date.parse()
        if (text === 'now') {
            return now === null || isNaN(now) ? new Date()
                    .getTime() / 1000 | 0 : now | 0;
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0;
        }

        date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };

        function lastNext(type, range, modifier) {
            var diff, day = days[range];

            if (typeof day !== 'undefined') {
                diff = day - date.getDay();

                if (diff === 0) {
                    diff = 7 * modifier;
                } else if (diff > 0 && type === 'last') {
                    diff -= 7;
                } else if (diff < 0 && type === 'next') {
                    diff += 7;
                }

                date.setDate(date.getDate() + diff);
            }
        }

        function process(val) {
            var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
                    type = splt[0],
                    range = splt[1].substring(0, 3),
                    typeIsNumber = /\d+/.test(type),
                    ago = splt[2] === 'ago',
                    num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

            if (typeIsNumber) {
                num *= parseInt(type, 10);
            }

            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
            }

            if (range === 'wee') {
                return date.setDate(date.getDate() + (num * 7));
            }

            if (type === 'next' || type === 'last') {
                lastNext(type, range, num);
            } else if (!typeIsNumber) {
                return false;
            }

            return true;
        }

        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
                '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
                '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail;
        }

        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail;
            }
        }

        // ECMAScript 5 only
        // if (!match.every(process))
        //    return false;

        return (date.getTime() / 1000);
    },

    time: function () {
        //  discuss at: http://phpjs.org/functions/time/
        // original by: GeekFG (http://geekfg.blogspot.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: metjay
        // improved by: HKM
        //   example 1: timeStamp = time();
        //   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
        //   returns 1: true

        return Math.floor(new Date()
                .getTime() / 1000);
    },
};

var DateTime = function() {
    
};

