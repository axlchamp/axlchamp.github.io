let element = $('.widget-abc123');
let data = {
    config: {
        title: "minutes",
        addBy: "minutes", //days||hours||minutes||year||months
        endMessage: "Countdown Ended",
        expiration: 2, //days before cookie will expire
        startCount: "siteopen", //specificdate || siteopen
        hideYear: true,
        hideMonth: true,
        hideWeeks: true,
        hideDays: true,
        hideHours: false,
        hideMinutes: false,
        hideSeconds: false,
    }
};
let hideYear = data.config.hideYear;
let hideMonth = data.config.hideMonth;
let hideWeeks = data.config.hideWeeks;
let hideDays = data.config.hideYhideDaysear;
let hideHours = data.config.hideHours;
let hideMinutes = data.config.hideMinutes;
let hideSeconds = data.config.hideSeconds;
let startCount = data.config.startCount;

if (hideYear) {
    $(element).find(".comWidYear").hide();
    $(element).find(".comWidYear").next().hide();
}
if (hideMonth) {
    $(element).find(".comWidMonth").hide();
    $(element).find(".comWidMonth").next().hide();
}
if (hideWeeks) {
    $(element).find(".comWidWeeks").hide();
    $(element).find(".comWidWeeks").next().hide();
}


let title = data.config.title;
let addBy = data.config.addBy;
let endMessage = data.config.endMessage;
let expiration = parseInt(data.config.expiration);

let getDate = {
    newDate: new Date(),
    dNow: function (date) {
        let cYear = date.getFullYear();
        let initMonth = addZero(parseInt(date.getMonth() + 1));
        let initDay = addZero(date.getDate());
        let initHour = addZero(date.getHours());
        let initMinutes = addZero(date.getMinutes());
        let initSeconds = addZero(date.getSeconds());
        return `${cYear}/${initMonth}/${initDay} ${initHour}:${initMinutes}:${initSeconds}`;
    },
}

let getEnd = addTimer(getDate.newDate, 1);
let endDate = getDate.dNow(getEnd);
let cookie;
let deleteDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + expiration));

if (!document.cookie.includes(title)) {
    cookie = document.cookie = `${title}=${endDate}; expires=${deleteDate}`;
}

let titleLength = title.length + 1;
var pageFilter = document.cookie.substr(document.cookie.indexOf(title) + titleLength, 19);

loadCountdownTimer(document, "script", "flipclock", "https://irp-cdn.multiscreensite.com/f49f126e/files/uploaded/countdown.js", function () {
    let countdown = new Date(endDate);
    let cYear = getDate.newDate.getFullYear();
    let cMonth = addZero(parseInt(countdown.getMonth() + 1));
    let cDay = addZero(countdown.getDate());
    let cHour = addZero(countdown.getHours());
    let cMinutes = addZero(countdown.getMinutes());
    let cSeconds = addZero(countdown.getSeconds());
    let completeDate = !document.cookie.includes(title) ? `${cYear}/${cMonth}/${cDay} ${cHour}:${cMinutes}:${cSeconds}` : pageFilter;

    $(element).find(".comWidMainContainer").countdown(completeDate, function (event) {
        let evYear = event.strftime('%Y');
        let evMonths = event.strftime('%m');
        let evWeeks = event.strftime('%W');
        let evDays = event.strftime('%D');
        let evHours = event.strftime('%H');
        let evMinutes = event.strftime('%M');
        let evSeconds = event.strftime('%S');
        $(element).find('.comWidYearVal').text(evYear);
        $(element).find('.comWidMonthVal').text(evMonths);
        $(element).find('.comWidWeeksVal').text(evWeeks);
        $(element).find('.comWidDaysVal').text(evDays);
        $(element).find('.comWidHoursVal').text(evHours);
        $(element).find('.comWidMinutesVal').text(evMinutes);
        $(element).find('.comWidSecondsVal').text(evSeconds);
        if (event.type == "finish") {
            $(element).find(".comWidMainContainer").html(`<div class="comWidEndMessage">${endMessage}</div>`);
        }
    });
});

//FUNCTIONS LIST
function addZero(str) {
    let added = str < 10 ? "0" + str : str;
    return added;
}

function addTimer(d, qty) {
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var moreDate = new Date(yyyy, mm - 1, dd);
    var someDate = new Date();
    if (addBy == "year") {
        someDate.setYear(moreDate.getFullYear() + qty);
    }
    if (addBy == "month") {
        someDate.setMonth(moreDate.getMonth() + qty);
    }
    if (addBy == "days") {
        someDate.setDate(moreDate.getDate() + qty);
    }
    if (addBy == "hours") {
        someDate.setHours(someDate.getHours() + qty);
    }
    if (addBy == "minutes") {
        someDate.setMinutes(someDate.getMinutes() + qty);
    }
    return someDate;
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