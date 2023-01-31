// DUDA dmAPI
let dmAPI = {
    runOnReady: (functionName, callback) => {
        if (functionName) {
            callback();
        } else {
            console.error("Please Enter Function Name!");
        }
    },
    loadScript: (url, callback) => {
        var fjs = document.getElementsByTagName("script")[0];
        script = document.createElement("script");
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
};

let element = $('.widget-4892f4');
let data = {
    device: "mobile",
    config: {
        spreadsheet: 'https://docs.google.com/spreadsheets/d/1yTr7Q0VDChM2tzXfmvIxnCU255OtJG7Ovy32KC0uTl8/edit?usp=sharing',
        eventLimit: true,
        displayEventTime: false,
        locale: false,
        defaultView: "dayGridMonth" //dayGridWeek // listMonth // dayGridMonth
    }
};



// ANCHOR! WIDGET
const includedSearch = ['Title']; // Searchable

let collect = new Collection();
let today = new Date();
let da = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
let mo = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
let y = today.getFullYear();
let ymd = y + "-" + mo + "-" + da;
let dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let monArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
let locale = data.config.locale;

let eventLimit = data.config.eventLimit;
let displayEventTime = data.config.displayEventTime;
let displayEventEnd = data.config.displayEventEnd;
let defaultView = data.config.defaultView;
let calendar;

let eventData = {};

let spreadsheet = data.config.spreadsheet;
let sheet = spreadsheet.substring(spreadsheet.indexOf('d/') + 2).replace('/edit?usp=sharing', '');
let sheetDetails = {
    sheetid: sheet,
    sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
    apikey: data.config.apikey ? data.config.apikey : "AIzaSyAdIJAwH4h8sgYSWIrS3PNSew6rsyvavzU"
};

let color_picked = $(element).find('.searched_color_flag').attr("data-color");
let device = data.device;
let header_device = {
    desktop: {
        left: "prev,next today",
        center: 'title',
        right: "dayGridMonth,dayGridWeek,listMonth"
    },
    mobile: {
        left: "title",
        center: 'prev,next today',
        right: "dayGridMonth,dayGridWeek,listMonth"
    }
};

let responseData = collect.response(sheetDetails);
dmAPI.runOnReady("initCalendar", function () {
    dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/core/main.js', function () {
        dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/list/main.min.js', function () {
            dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/daygrid/main.js', function () {
                dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/core/locales-all.min.js', function () {
                    responseData.then(function (resp) {
                        $(element).find('.fc_Get_Calendar').val(`${y}-${mo}-${da}`);
                        let category_value = filter(resp, "category");
                        $(element).find(".fc_Calendar_Filter .fc_Filter_input").html(category_value);
                        let tags_value = filter(resp, "tags");
                        $(element).find(".fc_Calendar_Tags .fc_Filter_input").html(tags_value);
                        initialize(resp);
                    });
                });
            });
        });
    });
});

// ! Search Event
$(element).find(".fc_Calendar_Filters input").keyup(function (e) {

    let inputValue = $(this).val().toLowerCase();
    let filtered = filterEvents(inputValue);
    let isEmpty = inputValue == "" ? ymd : filtered[0] ? filtered[0].initial_date_format : ymd;

    calendar.gotoDate(isEmpty);

    $(element).find('[data-date]').not('.fc-today').css('background', 'none');
    $(element).find(`[data-date=${isEmpty}]`).css('background', color_picked + "50");
    // $(element).find(".fc-today[data-date] a").css("color", inputValue == "" ? "#ffffff" : "#333333");

    let is_none = $(element).find(`[data-date=${isEmpty}]`).css("background") == "none" ? "#333333" : "#ffffff";
    $(element).find(`[data-date]`).css("color", "#333");
    $(element).find(`[data-date=${isEmpty}]`).css("color", is_none);

});

// ! Filter Events
$(element).find('.fc_Calendar_Filter,.fc_Calendar_Tags').click(function () {
    $(this).find(".fc_Filter_input").addClass("fc_showInput");
}).on("mouseleave", function () {
    $(this).find(".fc_Filter_input").removeClass('fc_showInput');
});

// ! Dropdown Options 
$(element).find(".fc_Calendar_Filter").on('click', '.fc_Filter_Option', function (e) {
    e.stopPropagation();
    let category_value = $(this).attr("data-value");
    let inputValue = category_value.toLowerCase();

    $(element).find(".fc_Calendar_Filter .fc_Filter_Option").removeClass('fc_Tags_selected');
    $(this).addClass("fc_Tags_selected");

    let category_filter = {
        category: inputValue
    };
    let filtered = inputValue !== "all" ? multiFilter(eventData.all, category_filter) : eventData.all;

    eventData.filter = filtered;

    calendar.removeAllEvents();

    filtered.map(i => {
        calendar.addEvent(i);
    });
    calendar.gotoDate(inputValue == "all" ? ymd : filtered[0].initial_date_format);

    $(this).parent().prev().find('.fc_Calendar_Dropdown').attr("data-value", category_value);
    $(this).parent().prev().find('.fc_Calendar_Dropdown').text(category_value);

    $(this).parent().removeClass('fc_showInput');

    let tags_value = filter(filtered, "tags");
    $(element).find(".fc_Calendar_Tags .fc_Filter_input").html(tags_value);
});

// ! Tags Events
$(element).find(".fc_Calendar_Tags").on('click', '.fc_Filter_Option', function (e) {
    e.stopPropagation();
    $(this).attr("data-selected", true).toggleClass("fc_Tags_selected");
    let tags_value = $(this).attr("data-value");
    let inputValue = tags_value.toLowerCase();

    if (inputValue == "all") {
        $(element).find(".fc_Calendar_Tags .fc_Filter_Option").removeClass("fc_Tags_selected");
        $(this).addClass("fc_Tags_selected");
        inputValue = "";
    } else {
        $(element).find(".fc_Calendar_Tags .fc_Filter_Option[data-value='All']").removeClass("fc_Tags_selected");
    }

    let filtered_category = eventData.filter ? eventData.filter : eventData.all;

    if (!$(this).hasClass("fc_Tags_selected") && !$(element).find(".fc_Calendar_Tags .fc_Tags_selected").length > 0) {
        $(element).find(".fc_Calendar_Tags .fc_Filter_Option[data-value='All']").addClass("fc_Tags_selected");
    }

    let multiple_select = [];
    $(element).find(".fc_Calendar_Tags .fc_Tags_selected").each(function () {
        let tagValue = $(this).attr("data-value");
        multiple_select.push(tagValue == "All" ? "" : tagValue);
    });

    let filtered = multiple_select.map(i => {
        let tags_filter = {
            tags: i
        };
        return multiFilter(filtered_category, tags_filter);
    });
    let unique_events = removeDuplicates(filtered.flat(), 'id');

    eventData.tags = unique_events;

    calendar.removeAllEvents();

    unique_events.map(i => {
        calendar.addEvent(i);
    });
    calendar.gotoDate(inputValue == "all" ? ymd : unique_events[0].initial_date_format);

});




// ! Goto Date
$(element).find(".fc_event_Get_Date").click(function () {
    let cal_value = $(element).find(".fc_Get_Calendar").val();
    let date_format = date_formatter(new Date(cal_value));
    calendar.gotoDate(date_format);
    $(element).find('[data-date]').css('background', 'none');
    $(element).find(`[data-date=${cal_value}]`).css('background-color', color_picked + "50");

});

// ! Close Modal
$(element).find(".fc_Details_Modal").click(function (e) {
    if ($(this).is(e.target)) {
        $(element).find(".fc_Details_Modal,.fc_Details_ModalBG").removeClass("fcActiveModal");
        $("body").css("overflow", "auto");
    }
});

// ! Close Modal
$(element).find(".fc_Modal_Close").click(function () {
    $(element).find(".fc_Details_Modal,.fc_Details_ModalBG").removeClass("fcActiveModal");
    $("body").css("overflow", "auto");
});

function filterEvents(val) {
    let fetch_data = eventData.filter ? eventData.filter : eventData.all;
    if (eventData.tags) {
        return eventData.tags.filter(i => i.title.toLowerCase().includes(val));
    }
    return fetch_data.filter(i => i.title.toLowerCase().includes(val));
}

function Collection() {
    this.ajax = function () {
        return $.ajax({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`,
        });
    };
    this.response = function (sheetDetails) {
        let sheet = this.ajax(sheetDetails);
        return sheet.then(resp => {
            let header = resp.values[0];
            let values = resp.values.filter((i, index) => index !== 0);
            let included = header.filter(a => includedSearch.includes(a.replace(/[^A-Za-z]+/g, "").toLowerCase()));

            return values.map(i => {
                let items = {};
                header.map((k, index) => {
                    items[removeSpecial(k.toLowerCase())] = i[index];
                });
                items.page_item_url = items.title.replace(/\s/g, '-').toLowerCase();
                items.keyword = included.map(b => items[b.replace(/[^A-Za-z]+/g, "").toLowerCase()].toLowerCase()).join(",");
                return items;
            });
        });

    };

    function removeSpecial(str) {
        let pattern = str.replace(/[^A-Z0-9]/ig, ``);
        return pattern;
    }
}

function date_formatter(date) {
    const offset = date.getTimezoneOffset();
    date = locale ? new Date(date.getTime() - (offset * 60 * 1000)) : new Date(date.getTime());
    return date.toISOString();
}

function initialize(filter, isFilter) {
    let events;
    if (!isFilter) {
        events = filter.map((i, index) => {
            let start = date_formatter(new Date(i.startdate));
            let end = date_formatter(new Date(i.enddate));
            return {
                id: "Event_" + index,
                link: i.pageitemurl,
                title: i.title,
                start,
                end,
                date: start,
                location: i.location,
                description: i.description,
                color: i.eventcolor,
                textcolor: i.textcolor,
                category: i.category,
                image: i.image,
                tags: i.tags,
                initial_date_format: i.startdate
            };
        }).sort((a, b) => {
            return new Date(a.start) > new Date(b.start) ? 1 : -1;
        });
        eventData.all = events;
    }
    // This hides the loader Line 14 on HTML | Line 24 CSS
    $(element).find('.fc_Loader').hide();

    // Initialize || Reinitialized FullCalendar
    calendar = new FullCalendar.Calendar(document.getElementById('fc_calendar_container'), {
        plugins: ['dayGrid', 'list'],
        defaultView,
        header: header_device[device],
        defaultDate: ymd,
        navLinks: true, // can click day/week names to navigate views
        eventLimit: eventLimit, // allow "more" link when too many events with in a day
        editable: false,
        events: events,
        fixedWeekCount: false,
        selectable: false,
        displayEventTime: displayEventTime,
        displayEventEnd: displayEventEnd,
        forceEventDuration: false,
        allDay: false,
        eventClick: function (info, item) {
            $(element).find(".fc_Details_Modal,.fc_Details_ModalBG").addClass("fcActiveModal");
            $("body").css("overflow", "hidden");
            let thisEvent = new Date(info.event.start);
            let eventDate = thisEvent.getDate();
            let eventMonth = monArr[thisEvent.getMonth()];
            let eventYear = thisEvent.getFullYear();
            let location = info.event.extendedProps.location;
            let description = info.event.extendedProps.description;
            let url = info.event.extendedProps.link;
            let title = info.event.title;
            let image = info.event.extendedProps.image;

            $(element).find('.fc_Modal_Title').html(title);
            $(element).find('.fc_Modal_Location').html(location);
            $(element).find('.fc_Modal_Date').html(`${eventMonth} ${eventDate}, ${eventYear}`);
            $(element).find('.fc_Modal_Description').html(description);
            $(element).find('.fc_Modal_Image img').attr('src', image);
            $(element).find('.fc_Modal_Footer a').attr('href', url);
        }
    });
    calendar.render();
}

//PLUGINS
cssLibrary('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'fontAwesomeSource');
cssLibrary('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/core/main.css', 'fullCalendar');
cssLibrary('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/daygrid/main.css', 'dayGrid');
cssLibrary('https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/list/main.min.css', 'listView');

function cssLibrary(href, id) {
    if (!document.getElementById(id)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        head.appendChild(link);
    }
}

function filter(obj, key) {
    let newObj = obj.map(i => {
        return i[key].split(",").map(j => {
            return j.trim();
        });
    }).flat();
    var uniqueItems = Array.from(new Set(newObj));
    return '<div class="fc_Filter_Option fc_Tags_selected" data-value="All">All</div>' + uniqueItems.sort((a, b) => {
        return a > b ? 1 : -1;
    }).map(i => {
        return `<div class="fc_Filter_Option" data-value="${i}">${i}</div>`;
    }).join('');
}

function multiFilter(obj, filters) {
    const filterKeys = Object.keys(filters);
    return obj.filter(function (eachObj) {
        return filterKeys.every(function (eachKey) {
            if (!filters[eachKey].length) {
                return true; // passing an empty filter means that filter is ignored.
            }
            return eachObj[eachKey].toLowerCase().includes(filters[eachKey].toLowerCase());
        });
    });
}

function removeDuplicates(array, key) {
    return array.reduce(function (arr, item) {
        const removed = arr.filter(function (i) {
            return i[key] !== item[key];
        });
        return [...removed, item];
    }, []);
}