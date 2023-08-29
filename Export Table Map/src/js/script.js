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

let element = $('.widget-abc123');
let data = {
    inEditor: false,
    siteId: "a1b2c3d4",
    config: {
        spreadsheet: "https://docs.google.com/spreadsheets/d/15ArH4lk9mydKlSbWfIzP1RbDi1TsniLGzPWB_sCBv-A/edit?usp=sharing",
        apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc
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
    }
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
let sheet = spreadsheet.substring(spreadsheet.indexOf('d/') + 2).replace('/edit?usp=sharing', '');

let sheetDetails = {
    sheetid: sheet,
    sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
    apikey: apikey ? apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0" // AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0
};

let script_url = apikey ? `https://maps.googleapis.com/maps/api/js?v=beta&libraries=places&key=${apikey}&callback=map_callback` : `https://maps.googleapis.com/maps/api/js?v=beta&libraries=places&callback=map_callback`;

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

// COLLECTION
dmAPI.runOnReady('GoogleMap', function () {
    dmAPI.loadScript("https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.bundle.min.js", function () {
        dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js", function () {
            let response = new Collection(sheetDetails).response();
            response.then(function (resp_value) {
                let resp = resp_value;
                console.log(resp)
                if (resp.length == 0) {
                    if (data.inEditor) {
                        $(element).find('.googleMap-Main-Container').html('No Results Found.');
                    } else {
                        $(element).find('.googleMap-Main-Container').addClass('googlemap-hidden');
                    }
                    return;
                }
                locations.list = resp;

                dmAPI.loadScript(script_url, function () {
                    let sideBar = new Create(resp).sidebar_structure();
                    $(element).find(".googleMap-Locations-Table tbody").html(sideBar);

                    // let filter_dropdown = filter(resp, "category");
                    // $(element).find(".googleMap-Filter-Category").html(`<option value="">All</option>${filter_dropdown}`);

                    initMap(resp);
                });
            });
        });
    });
});

$(element).find(".googleMap-Search-Input").keyup(function (e) {
    if ((e.which || e.keyCode) == 13) {
        eventFilter();
    }
});
// $(element).find(".googleMap-Filter-Category").change(function () {
//     eventFilter();
// });

function eventFilter() {
    let searchValue = $(element).find(".googleMap-Search-Input").val();
    // let filterValue = $(element).find(".googleMap-Filter-Category").val();

    let key = searchValue.length == 2 ? "state" : "keyword";
    let filters = {
        [key]: searchValue,
        // category: filterValue
    };
    let filtered = multiFilter(locations.list, filters);
    let sideBar = new Create(filtered).sidebar_structure();
    $(element).find(".googleMap-Locations-Table tbody").html(sideBar);
    initMap(filtered);
}

function map_callback() {
    console.log("Map Loaded...");
}
// Creating HTML Structures and Filters
function Create(obj) {
    this.sidebar_structure = () => {
        let output = '';
        obj.map((i, index) => {
            output += `
            <tr>
                <td>
                    <div class="">${i.street}</div>
                    <div class="">${i.city}, ${i.state}, ${i.zip}</div>
                </td>
                <td> ${i.mortgagebalance ? i.mortgagebalance : ""} </td>
                <td> ${i.value ? i.value : "-"} </td>
                <td>${i.year ? i.year : "-"}</td>
                <td>${i.beds ? i.beds : "-"}</td>
                <td>${i.baths ? i.baths : "-"}</td>
                <td>${i.sqft ? i.sqft : "-"}</td>
            </tr>
            `;
        });
        return output;
    };
    this.filter = (key) => {
        let output = '';
        obj.map(i => {
            output += `<option>${i[key]}</option>`;
        });
        return output;
    };
    this.circle = (map) => {
        return new google.maps.Circle({
            map,
            radius: 100000, // 10 miles in metres
            fillColor: '#AA0000',
            fillOpacity: 0.5,
            strokeOpacity: 0.5,
            strokeColor: "#FFFFFF"
        });
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
        return sheet.then(resp => {
            let header = resp.values[0];
            let values = resp.values.filter((i, index) => index !== 0);
            return values.map(i => {
                let items = {};
                header.map((k, index) => {
                    items[removeSpecial(k.toLowerCase())] = i[index];
                    items.keyword = i.map(k => i[k] ? i[k].includes("http") ? null : i[k].trim() : null).join(" ").replace(/\s+/g, ' ').trim();
                });
                return items;
            });
        });

    };

    function removeSpecial(str) {
        let pattern = str.replace(/[^A-Z0-9]/ig, ``);
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
            lng: centerLng
        },
        zoom: defaultZoom
    });


    obj.map((i, index) => {
        geocoder.geocode({
            address: `${i.street},${i.city},${i.state},${i.zip}`
        }).then((get_coordinates) => {
            let marker = new google.maps.Marker({
                position: get_coordinates.results[0].geometry.location,
                map,
                // icon: {
                //     url: i.markericon,
                //     scaledSize: new google.maps.Size(markerSize, markerSize)
                // },
                id: "marker_" + index
            });

            bounds.extend(marker.position);
            markers.push(marker);
            if (locations.list.length > 1) {
                map.fitBounds(bounds);
            }

            // if (markerEvent) {
            //     google.maps.event.addListener(marker, trigger, (marker, j => {
            //         let name = isShowName ? `<div class="googlemap-InfoWindow-Name">
            //         <span>${i.owner}</span>
            //     </div>` : "";

            //         let address = isShowAddress ? `<div class="googlemap-InfoWindow-Address">
            //         <span>${i.street}, ${i.city}, ${i.state}, ${i.zip}</span>
            //     </div>` : "";


            //         let form = `
            //         <div class="googleMap-Container-InfoWindow">
            //             ${name}
            //             ${address}
            //         </div>`;

            //         $(element).on(trigger, ".googleMap-Locations-Sidebar", function () {
            //             let markerIndex = $(this).attr("data-index");
            //             if (marker.id == markerIndex) {
            //                 google.maps.event.trigger(marker, trigger);
            //                 // let circle = new Create().circle(map);
            //                 // circle.bindTo('center', marker, 'position');
            //             }
            //         });

            //         return function () {
            //             $(element).find(`.googleMap-Locations-Sidebar`).removeClass("googleMap-Sidebar-Selected");
            //             $(element).find(`.googleMap-Locations-Sidebar[data-name="${i.name}"]`).addClass("googleMap-Sidebar-Selected");
            //             infowindow.setContent(form);
            //             infowindow.open(map, marker);
            //         };
            //     })(marker, i));
            // }
        });
    });
    // Listen to the 'bounds_changed' event of the map object
    google.maps.event.addListener(map, 'bounds_changed', function () {
        let visibleMarkers = markers.filter(function (marker) {
            return map.getBounds().contains(marker.getPosition());
        });

        let viewport_markers = markers.filter(marker => {
            if (visibleMarkers.includes(marker)) {
                $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).show();
            } else {
                $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).hide();
            }
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
    let newObj = obj.map(i => {
        return i[key].split(",").map(j => {
            return j.trim();
        });
    }).flat();
    var uniqueItems = Array.from(new Set(newObj));
    return uniqueItems.sort((a, b) => {
        return a > b ? 1 : -1;
    }).map(i => {
        return `<option>${i}</option>`;
    }).join('');
}

//Multi Filter
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

function exportTableToXLS() {
    var table = document.getElementById('tbl_exporttable_to_xls');
    var ws = XLSX.utils.table_to_sheet(table);
    var wb = XLSX.utils.book_new();
    console.log(table)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
}



css_resource('https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css', 'bs5CSS');

function css_resource(href, id) {
    if (!document.getElementById(id)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.crossOrigin = 'anonymous';
        head.appendChild(link);
    }
}