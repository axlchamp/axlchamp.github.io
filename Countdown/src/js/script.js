let element = $('.widget-abc123');
let data = {
    config: {
        showMessage: true, // Show message while session is on-going
        showTimer: true, // Show timer while session is on-going
        year: 0,
        month: 1,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        hideYear: true,
        hideMonth: true,
        hideDays: false,
        hideHours: false,
        hideMinutes: false,
        hideSeconds: false,
        hideLabels: false,
        datelist: [{
            label: "Sign-up Countdown",
            date: "2023/09/23",
            time: "24:00:00",
            duration: 1,
            endMessage: "On-going Live Session 3.",
        }],
        layout: 'Default', // Default || Border || Background || Rounded
    },
};

$(element).find('.comWidValContainer').addClass("comWidValRounded");

let hideYear = true;
let hideMonth = true;
let hideDays = data.config.hideYhideDays;
let hideHours = data.config.hideHours;
let hideMinutes = data.config.hideMinutes;
let hideSeconds = data.config.hideSeconds;
let hideLabels = data.config.hideLabels;

// HTML HANDLE BARS
if (hideYear) $('.comWidYear').hide(), $('.comWidYear').next().hide();
if (hideMonth) $('.comWidMonth').hide(), $('.comWidMonth').next().hide();
if (hideDays) $('.comWidDays').hide(), $('.comWidDays').next().hide();
if (hideHours) $('.comWidHours').hide(), $('.comWidHours').next().hide();
if (hideMinutes) $('.comWidMinutes').hide(), $('.comWidMinutes').next().hide();
if (hideLabels) $('.comWidLabel').hide();

let datelist = data.config.datelist;
let yearInit = parseInt(data.config.year);
let monthInit = parseInt(data.config.month);
let daysInit = parseInt(data.config.days);
let hoursInit = parseInt(data.config.hours);
let minutesInit = parseInt(data.config.minutes);
let secondsInit = parseInt(data.config.seconds);

let showTimer = data.config.showTimer;
let showMessage = data.config.showMessage;

// Get Current Event
let currentevent = getCurrentEvent(datelist);

loadCountdownTimer(document, "script", "flipclock", "https://irp-cdn.multiscreensite.com/f49f126e/files/uploaded/countdown.js", function () {
    let events = typeof currentevent == "undefined" ? `` : `${currentevent.date} ${currentevent.time}`;
    if (events == "") {
        $(element).find(".comWidMainContainer").hide();
        $(element).find(".comWidEndMessage").hide(); 
        return;
    }
    initiateCountdown(events);
});

function initiateCountdown(events) {
    if (events == "") {
        return;
    }

    $(element).find(".comWidMainContainer").countdown(events, function (event) {
        
        $(element).find(".comWidEndMessage").show();

        let evSeconds = event.strftime('%S');
        let evMinutes = event.strftime('%M');
        let evHours = event.strftime('%H');
        let evDays = event.strftime('%n');
        let evWeeks = event.strftime('%W');
        let evMonths = Math.floor(event.strftime('%m') % 12);
        let evYear = evMonths == 0 ? Math.floor(event.strftime('%Y')) : Math.floor(event.strftime('%Y')) - 1;
        let timeStamp = new Date(event.timeStamp).getSeconds();

        let labelYear = singular(evYear, "Year");
        let labelMonth = singular(evMonths, "Month");
        let labelDays = singular(evDays, "Day");
        let labelHours = singular(evHours, "Hour");
        let labelMinutes = singular(evMinutes, "Minute");

        $(element).find('.comWidYearVal').text(evYear);
        $(element).find(".comWidYear .comWidLabel").text(labelYear);

        $(element).find('.comWidMonthVal').text(evMonths);
        $(element).find(".comWidMonth .comWidLabel").text(labelMonth);

        $(element).find('.comWidDaysVal').text(evDays);
        $(element).find(".comWidDays .comWidLabel").text(labelDays);

        $(element).find('.comWidHoursVal').text(evHours);
        $(element).find(".comWidHours .comWidLabel").text(labelHours);

        $(element).find('.comWidMinutesVal').text(evMinutes);
        $(element).find(".comWidMinutes .comWidLabel").text(labelMinutes);

        $(element).find('.comWidSecondsVal').text(evSeconds);
        console.log(event.type,timeStamp)
        if (event.type == "finish") {
            let session = getCurrentEvent(datelist);
            let next = parseInt(evSeconds) * 60 * 1000;
            nextSession(session);

        }

        if (event.type == "update") {
            $(element).find(".comWidEndMessage").hide();
        }
    });
}

function nextSession(current) {
    let dateNow = new Date(current.next);
    let nextCountdown = datelist.find(i => {
        let currentDate = new Date(`${i.date} ${i.time}`);
        let eventDuration = i.duration;
        let target = new Date(currentDate.setMinutes(currentDate.getMinutes() + eventDuration));
        i.next = target;
        return dateNow < target;
    });
    let events = typeof nextCountdown == "undefined" ? `` : `${nextCountdown.date} ${nextCountdown.time}`;
    initiateCountdown(events);
}

function getCurrentEvent(eventList) {
    let dateNow = new Date();
    return eventList.find(i => {
        let currentDate = new Date(`${i.date} ${i.time}`);
        let eventDuration = i.duration;
        let target = new Date(currentDate.setMinutes(currentDate.getMinutes() + eventDuration));

        i.next = target;
        return dateNow < target;
    });
}

function singular(num, word) {
    return num <= 1 ? word : word + "s";
}

//FUNCTIONS LIST
function addZero(str) {
    let added = str < 10 ? "0" + str : str;
    return added.toString();
}

function addTimer(d) {
    let monToDays = monthInit == 0 ? 0 : monthInit * 30.4167;
    let yearToDays = yearInit == 0 ? 0 : yearInit * 365;

    let sec = new Date(d.setSeconds(d.getSeconds() + secondsInit));
    let min = new Date(d.setMinutes(d.getMinutes() + minutesInit));
    let hou = new Date(d.setHours(d.getHours() + hoursInit));
    let day = new Date(d.setDate(d.getDate() + daysInit + monToDays + yearToDays));
    let mon = new Date(d.setMonth(d.getMonth()));

    let se = addZero(sec.getSeconds());
    let mi = addZero(min.getMinutes());
    let ho = addZero(hou.getHours());
    let da = addZero(day.getDate());
    let mo = addZero(mon.getMonth() + 1);
    let ye = addZero(d.getFullYear());

    return `${ye}/${mo}/${da} ${ho}:${mi}:${se}`;
}

// PLUGINS
function loadCountdownTimer(d, s, id, url, callback) {
    $("#" + id).remove();
    var fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return
    }
    script = d.createElement(s);
    script.id = id;
    script.src = url;
    fjs.parentNode.insertBefore(script, fjs);

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    fjs.parentNode.insertBefore(script, fjs);
}

function loadmonJS(d, s, id) {
    var fjs = d.getElementsByTagName(s)[0]; //referenceNode(parentNode)
    if (d.getElementById(id)) {
        return
    } //check if the script with the id = foo already exist
    js = d.createElement(s);
    js.id = id;
    js.src = "https://irp-cdn.multiscreensite.com/7c044735/files/uploaded/moment.min.js";
    fjs.parentNode.insertBefore(js, fjs);
} //loadmonJS

function loadmomentTimeZoneJS(d, s, id) {
    var fjs = d.getElementsByTagName(s)[0]; //referenceNode(parentNode)
    if (d.getElementById(id)) {
        return
    } //check if the script with the id = foo already exist
    js = d.createElement(s);
    js.id = id;
    js.src = "https://momentjs.com/downloads/moment-timezone-with-data.js";
    fjs.parentNode.insertBefore(js, fjs);
} //loadmonJS