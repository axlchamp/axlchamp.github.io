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
        apikey: "", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc,
        spreadsheet: "https://docs.google.com/spreadsheets/d/1FSk-2bdlxFNonf92utCyIHv0TYTiearV2NoH3QcWmk0/edit?usp=sharing",
        buttonText: "Read More",
        markerSize: "40",
        defaultZoom: 8,
        currency: "$",

        markerEvent: true,
        trigger: "click", //click || mouseover

        isShowLogo: true,
        isShowName: true,
        isShowAddress: true,
        isShowEmail: true,
        isShowTelephone: true,
        isShowWebsite: true,
        isShowButton: true,

        centerLat: "38.962949",
        centerLng: "-101.391798",

        //Toggles
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,

        newTab:true
    }
};

// WIDGET VARIABLES

const includedSearch = ['Name', 'Property Type', 'Description', 'Address']; // Searchable
let map;
let apikey = data.config.apikey;
let dudaAlias = data.siteId;
let buttonText = data.config.buttonText;
let markerEvent = data.config.markerEvent;
let collection = data.config.collection;
let currency = data.config.currency;

let markerSize = parseInt(data.config.markerSize);
let trigger = data.config.trigger;

let centerLat = parseFloat(data.config.centerLat);
let centerLng = parseFloat(data.config.centerLng);
let defaultZoom = parseInt(data.config.defaultZoom);

let scriptUrl = apikey ? `https://maps.googleapis.com/maps/api/js?v=weekly&key=${apikey}` : `https://maps.googleapis.com/maps/api/js?v=weekly`;

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

let newTab = data.config.newTab ? "_blank" : "_self";

// ERROR BEHAVIOR
// if (!collection || collection == "") {
//     if (data.inEditor) {
//         $(element).html("<div class='noCollection'>Please enter collection name.</div><div class='noCollectionSub'>This will be hidden on preview and live site.</div>");
//     } else {
//         $(element).hide();
//     }
//     return;
// }

let spreadsheet = data.config.spreadsheet;
let sheet = spreadsheet.substring(spreadsheet.indexOf('d/') + 2).replace('/edit?usp=sharing', '');
let sheetDetails = {
    sheetid: sheet,
    sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
    apikey: data.config.apikey ? data.config.apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0"
};



// COLLECTION
dmAPI.runOnReady('GoogleMap', function () {
    new Collection(sheetDetails).response().then(function (resp) {
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

        dmAPI.loadScript(scriptUrl, function () {
            let sideBar = new Create(resp).sidebar_structure();
            $(element).find(".googleMap-Panel-Locations").html(sideBar);

            let filter_dropdown = filter(resp, "propertytype");
            $(element).find(".googleMap-Filter-Category").html(`<option value="">All</option>${filter_dropdown}`);

            initMap(resp);
        });
    });
});

$(element).find(".googleMap-Search-Input").keyup(function (e) {
    if ((e.which || e.keyCode) == 13) {
        eventFilter();
    }
});

$(element).find(".googleMap-Filter-Category").change(function () {
    eventFilter();
});

function eventFilter() {
    let searchValue = $(element).find(".googleMap-Search-Input").val();
    let filterValue = $(element).find(".googleMap-Filter-Category").val();

    let key = searchValue.length == 2 ? "state" : "keyword";
    let filters = {
        [key]: searchValue,
        propertytype: filterValue
    };
    let filtered = multiFilter(locations.list, filters);
    let sideBar = new Create(filtered).sidebar_structure();
    $(element).find(".googleMap-Panel-Locations").html(sideBar);
    initMap(filtered);
}

// Creating HTML Structures and Filters
function Create(obj) {
    this.sidebar_structure = () => {
        return obj.map((i, index) => {
            return `
            <div class="googleMap-Locations-Sidebar" data-name="${i.name}" data-lat="${i.latitude}" data-lng="${i.longitude}" data-index="marker_${index}">

                <!-- Image -->
                <div class="googleMap-Sidebar-Image">
                    <img src="${i.image}">
                    <!-- Price -->
                    <div class="googleMap-Sidebar-Price">
                        <span>${currency}${i.price}</span>
                    </div>
                </div>


                <!-- Details -->
                <div class="googleMap-Sidebar-Details">
                    <div class="googleMap-Details-Name">${i.name}</div>
                    <div class="googleMap-Details-Location">${i.location}</div>
                </div>

                <!-- Description -->
                <div class="googleMap-Sidebar-Description">${i.description}</div>

                <!-- Additional Info -->
                <div class="googlemap-Sidebar-Button">
                    <a class="googlemap-Sidebar-Link" href="#" target="${newTab}">${buttonText}</a>
                </div>
            </div>`;
        }).join("");
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

// COLLECTION USING GSX
function Collection(sheetDetails) {
    this.ajax = function () {
        return $.ajax({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`,
        });
    };
    this.response = function () {
        let sheet = this.ajax();
        return sheet.then(resp => {
            let header = resp.values[0];
            let values = resp.values.filter((i, index) => index !== 0);
            // let inclusions = includedSearch.map(i => i.replace(/[^A-Za-z]+/g, "").toLowerCase());
            let inclusions = header.filter(a => includedSearch.includes(a));
            let included = inclusions.map(i => i.replace(/[^A-Za-z]+/g, "").toLowerCase());
            return values.map(i => {
                let items = {};
                header.map((k, index) => {
                    items[removeSpecial(k.toLowerCase())] = i[index];
                });
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

// Initialize map SDK
function initMap(obj) {
    let bounds = new google.maps.LatLngBounds();
    let infowindow = new google.maps.InfoWindow();
    let markers = [];
    map = new google.maps.Map(document.getElementById(googleId), {
        center: {
            lat: centerLat,
            lng: centerLng
        },
        zoom: defaultZoom
    });


    obj.map((i, index) => {
        let icon = {
            url: i.markericon,
            scaledSize: new google.maps.Size(markerSize, markerSize)
        };
        if (!i.icon) icon = "";
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(i.latitude), parseFloat(i.longitude)),
            map,
            icon: icon,
            id: "marker_" + index
        });
        bounds.extend(marker.position);
        markers.push(marker);
        if (locations.list.length > 1) {
            map.fitBounds(bounds);
        }

        if (markerEvent) {
            google.maps.event.addListener(marker, trigger, (marker, j => {
                let name = isShowName ? `<div class="googlemap-InfoWindow-Name">
                    <span>${i.name}</span>
                </div>` : "";

                let address = isShowAddress ? `<div class="googlemap-InfoWindow-Address">
                    <span>${i.location}</span>
                </div>` : "";

                let button = isShowButton ? `<div class="googlemap-InfoWindow-Button">
                    <a class="googlemap-Button-Link" href="#" target="${newTab}">${buttonText}</a>
                </div>` : "";

                let form = `
                    <div class="googleMap-Container-InfoWindow">
                        ${name}
                        ${address}
                        ${button}
                    </div>`;

                $(element).on(trigger, ".googleMap-Locations-Sidebar", function () {
                    let markerIndex = $(this).attr("data-index");
                    if (marker.id == markerIndex) {
                        google.maps.event.trigger(marker, trigger);
                        // let circle = new Create().circle(map);
                        // circle.bindTo('center', marker, 'position');
                    }
                });

                return function () {
                    $(element).find(`.googleMap-Locations-Sidebar`).removeClass("googleMap-Sidebar-Selected");
                    $(element).find(`.googleMap-Locations-Sidebar[data-name="${i.name}"]`).addClass("googleMap-Sidebar-Selected");
                    infowindow.setContent(form);
                    infowindow.open(map, marker);
                };
            })(marker, i));
        }
    });
    // Listen to the 'bounds_changed' event of the map object
    google.maps.event.addListener(map, 'bounds_changed', function () {
        // let visibleMarkers = markers.filter(function (marker) {
        //     return map.getBounds().contains(marker.getPosition());
        // });

        // let viewport_markers = markers.filter(marker => {
        //     if (visibleMarkers.includes(marker)) {
        //         $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).show();
        //     } else {
        //         $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).hide();
        //     }
        // });
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