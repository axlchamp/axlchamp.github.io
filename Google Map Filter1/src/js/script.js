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
        if (script.readyState) {
            //IE
            script.onreadystatechange = function () {
                if (
                    script.readyState == "loaded" ||
                    script.readyState == "complete"
                ) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        fjs.parentNode.insertBefore(script, fjs);
    },
};

let element = $(".widget-abc123");
let data = {
    inEditor: false,
    siteId: "a1b2c3d4",
    config: {
        spreadsheet:
            "https://docs.google.com/spreadsheets/d/1fv5oIXi7HER9LnAZDmGVwiDWko5lHZ1oXzBxSbNX-hc/edit?usp=sharing",
        apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc || AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c || AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0
        collection: "",
        buttonText: "Subscribe",
        markerSize: "40",
        defaultZoom: 8,

        markerEvent: true,
        trigger: "click", //click || mouseover

        isShowLogo: true,
        isShowName: true,
        isShowAddress: true,
        isShowEmail: true,
        isShowTelephone: true,
        isShowWebsite: true,
        isShowButton: true,

        centerLat: "-25.344",
        centerLng: "131.031 ",

        //Toggles
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
    },
};

// WIDGET VARIABLES
let map;
let apikey = data.config.apikey;
let dudaAlias = data.siteId;
let buttonText = data.config.buttonText;
let markerEvent = data.config.markerEvent;
let collection = data.config.collection;
let markerSize = parseInt(data.config.markerSize);
let trigger = data.config.trigger;

let centerLat = parseFloat(data.config.centerLat);
let centerLng = parseFloat(data.config.centerLng);
let defaultZoom = parseInt(data.config.defaultZoom);

let spreadsheet = data.config.spreadsheet;
let sheet = spreadsheet
    .substring(spreadsheet.indexOf("d/") + 2)
    .replace("/edit?usp=sharing", "");

let sheetDetails = {
    sheetid: sheet,
    sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
    apikey: apikey ? apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0", // AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0
};

let script_url = apikey
    ? `https://maps.googleapis.com/maps/api/js?v=beta&libraries=places&key=${apikey}&callback=map_callback`
    : `https://maps.googleapis.com/maps/api/js?v=beta&libraries=places&callback=map_callback`;

let random_id = Math.floor(Math.random(99999) * 99999);
let googleId = `map_${random_id}`;
$(element).find(".googleMap-Map-Container").attr("id", googleId);

let locations = {};
let isShowLogo = data.config.isShowLogo;
let isShowName = data.config.isShowName;
let isShowAddress = data.config.isShowAddress;
let isShowButton = data.config.isShowButton;

let zoomControl = data.config.zoomControl;
let mapTypeControl = data.config.mapTypeControl;
let streetViewControl = data.config.streetViewControl;
let map_style = [
    {
        featureType: "all",
        elementType: "all",
        stylers: [
            {
                visibility: "on",
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#000000",
            },
            {
                lightness: 13,
            },
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#e2d1b6",
            },
            {
                visibility: "on",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#144b53",
            },
            {
                lightness: 14,
            },
            {
                weight: 1.4,
            },
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.locality",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#e2d1b6",
            },
        ],
    },
    {
        featureType: "administrative.neighborhood",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#e2d1b6",
            },
        ],
    },
    {
        featureType: "landscape",
        elementType: "all",
        stylers: [
            {
                color: "#0e1c31",
            },
        ],
    },
    {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#e2d1b6",
            },
        ],
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#111d33",
            },
        ],
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry.stroke",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "landscape.natural.landcover",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                color: "#122a50",
            },
            {
                lightness: 5,
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#e2d1b4",
            },
            {
                visibility: "on",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 25,
            },
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 16,
            },
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
            {
                color: "#000000",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "all",
        stylers: [
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "geometry.fill",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#ffffff",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "geometry.stroke",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "transit.line",
        elementType: "geometry.stroke",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "transit.station",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#111d33",
            },
            {
                visibility: "on",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "all",
        stylers: [
            {
                color: "#021019",
            },
            {
                visibility: "on",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
];
// COLLECTION
dmAPI.runOnReady("GoogleMap", function () {
    let response = new Collection(sheetDetails).response();
    response.then(function (resp_value) {
        let resp = resp_value;
        locations.list = resp;
        dmAPI.loadScript(script_url, function () {
            let filter_dropdown = filter(resp, "category");
            $(element).find(".googleMap-Filter-Category").html(filter_dropdown);
            initMap(resp);
        });
    });
});

$(element).on("click", ".googleMap-Category-Item", function () {
    let value = $(this).text();
    eventFilter(value);
});

function eventFilter(value) {
    let filters = {
        category: value,
    };
    let filtered = multiFilter(locations.list, filters);
    initMap(filtered);
}

function map_callback() {
    console.log("Map Loaded...");
}
// Creating HTML Structures and Filters
function Create(obj) {
    this.filter = (key) => {
        let output = "";
        obj.map((i) => {
            output += `<option>${i[key]}</option>`;
        });
        return output;
    };
}

function Collection(sheetDetails) {
    this.ajax = function () {
        return $.ajax({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`,
        });
    };
    this.response = function (sheetDetails) {
        let sheet = this.ajax(sheetDetails);
        return sheet.then((resp) => {
            let header = resp.values[0];
            let values = resp.values.filter((i, index) => index !== 0);
            return values.map((i) => {
                let items = {};
                header.map((k, index) => {
                    items[removeSpecial(k.toLowerCase())] = i[index];
                    items.keyword = i
                        .map((k) =>
                            i[k]
                                ? i[k].includes("http")
                                    ? null
                                    : i[k].trim()
                                : null
                        )
                        .join(" ")
                        .replace(/\s+/g, " ")
                        .trim();
                });
                return items;
            });
        });
    };

    function removeSpecial(str) {
        let pattern = str.replace(/[^A-Z0-9]/gi, ``);
        return pattern;
    }
}

// Initialize map SDK
function initMap(obj) {
    let bounds = new google.maps.LatLngBounds();
    let infowindow = new google.maps.InfoWindow();
    const geocoder = new google.maps.Geocoder();
    let markers = [];
    map = new google.maps.Map(document.getElementById(googleId), {
        center: {
            lat: centerLat,
            lng: centerLng,
        },
        zoom: defaultZoom,
        // styles: map_style
    });

    obj.map((i, index) => {
        // geocoder.geocode({
        //     address: `${i.street},${i.city},${i.state},${i.zip}`
        // }).then((get_coordinates) => {
        // let marker = new google.maps.Marker({
        //     position: get_coordinates.results[0].geometry.location,
        //     map,
        //     // icon: {
        //     //     url: i.markericon,
        //     //     scaledSize: new google.maps.Size(markerSize, markerSize)
        //     // },
        //     id: "marker_" + index
        // });
        let marker = new google.maps.Marker({
            position: {
                lat: parseFloat(i.latitude),
                lng: parseFloat(i.longitude),
            },
            map,
            icon: {
                url: i.markericon,
                scaledSize: new google.maps.Size(markerSize, markerSize),
            },
            id: "marker_" + index,
        });

        bounds.extend(marker.position);
        markers.push(marker);
        if (locations.list.length > 1) {
            map.fitBounds(bounds);
        }

        if (markerEvent) {
            google.maps.event.addListener(
                marker,
                trigger,
                (marker,
                (j) => {
                    let name = isShowName
                        ? `<div class="googlemap-InfoWindow-Name">
                    <span>${i.businessname}</span>
                </div>`
                        : "";

                    let address = isShowAddress
                        ? `<div class="googlemap-InfoWindow-Address">
                    <span>${i.location}, ${i.city}, ${i.stateabbrev}</span>
                </div>`
                        : "";

                    let form = `
                    <div class="googleMap-Container-InfoWindow">
                        ${name}
                        ${address}
                    </div>`;

                    return function () {
                        infowindow.setContent(form);
                        infowindow.open(map, marker);
                    };
                })(marker, i)
            );
        }
        // });
    });
    // Listen to the 'bounds_changed' event of the map object
    google.maps.event.addListener(map, "bounds_changed", function () {
        let visibleMarkers = markers.filter(function (marker) {
            return map.getBounds().contains(marker.getPosition());
        });
    });
}
// Remove duplicate from Object
function removeDuplicates(array, key) {
    return array.reduce(function (arr, item) {
        const removed = arr.filter(function (i) {
            return i[key] !== item[key];
        });
        return [...removed, item];
    }, []);
}

// Split Category
function filter(obj, key) {
    let newObj = removeDuplicates(obj, key);
    return newObj
        .sort((a, b) => {
            return a[key] > b[key] ? 1 : -1;
        })
        .map(
            (i) =>
                `<div class="googleMap-Category-Item"><img src="${i.markericon}"><span>${i.category}<span></div>`
        )
        .join("");
}

//Multi Filter
function multiFilter(obj, filters) {
    const filterKeys = Object.keys(filters);
    return obj.filter(function (eachObj) {
        return filterKeys.every(function (eachKey) {
            if (!filters[eachKey].length) {
                return true; // passing an empty filter means that filter is ignored.
            }
            return eachObj[eachKey]
                .toLowerCase()
                .includes(filters[eachKey].toLowerCase());
        });
    });
}

function exportTableToXLS() {
    var table = document.getElementById("tbl_exporttable_to_xls");
    var ws = XLSX.utils.table_to_sheet(table);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_data.xlsx");
}

css_resource(
    "https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css",
    "bs5CSS"
);

function css_resource(href, id) {
    if (!document.getElementById(id)) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        link.crossOrigin = "anonymous";
        head.appendChild(link);
    }
}
