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
        apikey: "", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc, AIzaSyC0-5QQM67C0z5xZb8ZhNE_ffP-d8GVttg
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

        newTab: true
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

let is_mobile = mobileCheck() || $('body').outerWidth() <= 900;

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
    apikey: "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0"
};



// COLLECTION
dmAPI.runOnReady('GoogleMap', function () {
    new Collection(sheetDetails).response().then(function (resp) {
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
                    <a class="googlemap-Sidebar-Link" href="${i.link}" target="${newTab}">${buttonText}</a>
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
        zoom: defaultZoom,
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
            id: "marker_" + index,
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
                    <a class="googlemap-Button-Link" href="${i.link}" target="${newTab}">${buttonText}</a>
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
                        map.setCenter({
                            lat: marker.getPosition().lat(),
                            lng: marker.getPosition().lng()
                        });
                        map.setZoom(12)
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

    let poi_list = ['restaurant', 'hotel', 'attraction', 'museum', 'transit', 'medical'];
    let button_position = is_mobile ? "LEFT_CENTER" : "TOP_CENTER";
    poi_list.map(i => {
        // Create the DIV to hold the control.
        const centerControlDiv = document.createElement("div");
        centerControlDiv.className = "custom_button_container";
        // Create the control.
        const centerControl = createCenterControl(i);

        // Append the control to the DIV.
        centerControlDiv.appendChild(centerControl);
        map.controls[google.maps.ControlPosition[button_position]].push(centerControlDiv);
    });

    $(element).on("click", ".custom_map_buttons", function () {
        let search_for = $(this).attr("data-button");
        let is_active = $(this).attr("data-active") == "true" ? false : true;
        console.log(is_active)
        var noPoi = [{
            featureType: "poi." + search_for,
            stylers: [{
                visibility: is_active ? "off" : "on"
            }]
        }];

        map.setOptions({
            styles: noPoi
        });
        $(this).attr("data-active", is_active);
    });
}

function createCenterControl(poi) {
    const controlButton = document.createElement("button");

    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    controlButton.style.border = "2px solid #fff";
    controlButton.style.borderRadius = "50px";
    controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "16px";
    controlButton.style.margin = "8px 0 22px";
    controlButton.style.padding = "5px 10px";
    controlButton.style.textAlign = "center";
    controlButton.title = "Click to search for " + poi;
    controlButton.type = "button";
    controlButton.setAttribute("data-button", poi);
    controlButton.setAttribute("data-active", true);
    controlButton.className = "custom_map_buttons";
    controlButton.innerHTML = `<span>${poi}</span>`;

    return controlButton;
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

function mobileCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

css_resource('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'fasrc');

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