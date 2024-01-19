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
        apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc
        list: [{
            name: "Location Name 1",
            location: "Address 1",
            logo: "https://supportraisingsolutions.org/wp-content/uploads/2018/11/sample-logo-655x158.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            category: "Food and Beverages",
            latitude: "38.962949",
            longitude: "-101.391798",
            markericon: "https://irp.cdn-website.com/6519dece/dms3rep/multi/mobile/location.png",
            email: "email1@sample.com",
            telephone: "(+1) 555 5555",
            website: "www.google.com",
        }, {
            name: "Location Name 2",
            location: "Address 2",
            logo: "https://supportraisingsolutions.org/wp-content/uploads/2018/11/sample-logo-655x158.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            category: "Clothing",
            latitude: "38.474028",
            longitude: "-90.099477",
            markericon: "https://irp.cdn-website.com/6519dece/dms3rep/multi/mobile/location.png",
            email: "email1@sample.com",
            telephone: "(+1) 555 5555",
            website: "www.google.com",
        }, {
            name: "Location Name 3",
            location: "Address 3",
            logo: "https://supportraisingsolutions.org/wp-content/uploads/2018/11/sample-logo-655x158.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            category: "Car Services",
            latitude: "38.109535",
            longitude: "-90.655261",
            markericon: "https://irp.cdn-website.com/6519dece/dms3rep/multi/mobile/location.png",
            email: "email1@sample.com",
            telephone: "(+1) 555 5555",
            website: "www.google.com",
        }, {
            name: "Location Name 4",
            location: "Address 4",
            logo: "https://supportraisingsolutions.org/wp-content/uploads/2018/11/sample-logo-655x158.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            category: "Hotels",
            latitude: "35.73091",
            longitude: "-114.974111",
            markericon: "https://irp.cdn-website.com/6519dece/dms3rep/multi/mobile/location.png",
            email: "email1@sample.com",
            telephone: "(+1) 555 5555",
            website: "www.google.com",
        }, {
            name: "Location Name 5",
            location: "Address 5",
            logo: "https://supportraisingsolutions.org/wp-content/uploads/2018/11/sample-logo-655x158.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            category: "Food and Beverages",
            latitude: "40.094256",
            longitude: "-76.662661",
            markericon: "https://irp.cdn-website.com/6519dece/dms3rep/multi/mobile/location.png",
            email: "email1@sample.com",
            telephone: "(+1) 555 5555",
            website: "www.google.com",
        }],
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

        centerLat: "38.962949",
        centerLng: "-101.391798",

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

let scriptUrl = apikey ? `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=places&key=${apikey}` : `https://maps.googleapis.com/maps/api/js?v=weekly`;

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

// ERROR BEHAVIOR
// if (!collection || collection == "") {
//     if (data.inEditor) {
//         $(element).html("<div class='noCollection'>Please enter collection name.</div><div class='noCollectionSub'>This will be hidden on preview and live site.</div>");
//     } else {
//         $(element).hide();
//     }
//     return;
// }

let list = data.config.list;

// COLLECTION
dmAPI.runOnReady('GoogleMap', function () {
    let resp = new Collection(list).data();
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
        dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gmaps-marker-clusterer/1.2.2/markerclusterer.js', function () {
            let sideBar = new Create(resp).sidebar_structure();
            $(element).find(".googleMap-Panel-Locations").html(sideBar);

            let filter_dropdown = filter(resp, "category");
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
        category: filterValue
    };
    let filtered = multiFilter(locations.list, filters);
    let sideBar = new Create(filtered).sidebar_structure();
    $(element).find(".googleMap-Panel-Locations").html(sideBar);
    initMap(filtered);
}

// Creating HTML Structures and Filters
function Create(obj) {
    this.sidebar_structure = () => {
        let output = '';
        obj.map((i, index) => {
            output += `
            <div class="googleMap-Locations-Sidebar" data-name="${i.name}" data-lat="${i.latitude}" data-lng="${i.longitude}" data-index="marker_${index}">
                <!-- Details -->
                <div class="googleMap-Sidebar-Details">
                    <div class="googleMap-Details-Name">${i.name}</div>
                    <div class="googleMap-Details-Location">${i.location}</div>
                </div>
            </div>
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

// COLLECTION FOR WIDGET LIST
function Collection(collection) {
    this.data = () => {
        return collection.map(i => {
            let item = {};
            Object.keys(i).filter(j => {
                item[removeSpecial(j).toLowerCase()] = typeof i[j] == "object" ? i[j].href : this.removeExtra(i[j]);
            });
            item.keyword = Object.keys(i).map(k => i[k]).join(',');
            return item;
        });
    };
    this.removeExtra = (str) => {
        if (str) {
            return str.includes("</p>") ? str.substring(str.indexOf(">") + 1).replace("</p>", '') : str;
        }
        return str;
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

    let cluster = obj.map((i, index) => {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(i.latitude), parseFloat(i.longitude)),
            map,
            icon: {
                url: i.markericon,
                scaledSize: new google.maps.Size(markerSize, markerSize)
            },
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
                    <a class="googlemap-Button-Link" href="#">${buttonText}</a>
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
        return marker;
    });
    const markerCluster = new MarkerClusterer(map, cluster, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
    // google.maps.event.addListener(map, 'bounds_changed', function () {
    //     let visibleMarkers = markers.filter(function (marker) {
    //         return map.getBounds().contains(marker.getPosition());
    //     });

    //     let viewport_markers = markers.filter(marker => {
    //         if (visibleMarkers.includes(marker)) {
    //             $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).show();
    //         } else {
    //             $(element).find(`.googleMap-Locations-Sidebar[data-index=${marker.id}]`).hide();
    //         }
    //     });
    // });


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