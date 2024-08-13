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
        list: [{
                "ID": "BN1",
                "Business Name": "Business Name Sample 1",
                "STATE": "Ohio",
                "STATEABBREV": "OH",
                "CITY": "COCHSOTON",
                "LOCATION": "COUNTY ROAD 1A",
                "Outage": "FALSE",
                "Logo": "https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.33727,
                "Longitude": -81.86454,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9805/9805408.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 1"
            },
            {
                "ID": "BN2",
                "Business Name": "Business Name Sample 2",
                "STATE": "Ohio",
                "STATEABBREV": "OH",
                "CITY": "MALVERN",
                "LOCATION": "ROUTE 183",
                "Outage": "TRUE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.698741,
                "Longitude": -81.16814,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9352/9352064.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 2"
            },
            {
                "ID": "BN3",
                "Business Name": "Business Name Sample 3",
                "STATE": "Ohio",
                "STATEABBREV": "OH",
                "CITY": "MALVERN",
                "LOCATION": "ROUTE 183",
                "Outage": "TRUE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.698747,
                "Longitude": -81.16814,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/10339/10339929.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 3"
            },
            {
                "ID": "BN4",
                "Business Name": "Business Name Sample 4",
                "STATE": "Ohio",
                "STATEABBREV": "OH",
                "CITY": "CARROLLTOWN",
                "LOCATION": "ROUTE 39",
                "Outage": "FALSE",
                "Logo": "https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.669235,
                "Longitude": -81.117964,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9805/9805408.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 1"
            },
            {
                "ID": "BN5",
                "Business Name": "Business Name Sample 5",
                "STATE": "Ilinois",
                "STATEABBREV": "IL",
                "CITY": "COLONA",
                "LOCATION": "1202 HIGHWAY 84",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.570684,
                "Longitude": -81.079726,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9352/9352064.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 2"
            },
            {
                "ID": "BN6",
                "Business Name": "Business Name Sample 6",
                "STATE": "Ilinois",
                "STATEABBREV": "IL",
                "CITY": "COLONA",
                "LOCATION": "1205 HIGHAY 84",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.522278,
                "Longitude": -81.027564,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/10339/10339929.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 3"
            },
            {
                "ID": "BN7",
                "Business Name": "Business Name Sample 7",
                "STATE": "Ilinois",
                "STATEABBREV": "IL",
                "CITY": "CARBON CLIFF",
                "LOCATION": "IL5 & AVE OF THE CITIES",
                "Outage": "FALSE",
                "Logo": "https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.433709,
                "Longitude": -80.773139,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9805/9805408.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 1"
            },
            {
                "ID": "BN8",
                "Business Name": "Business Name Sample 8",
                "STATE": "Ilinois",
                "STATEABBREV": "IL",
                "CITY": "CARBON CLIFF",
                "LOCATION": "IL5 & AVE OF THE CITIES",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.289441,
                "Longitude": -81.023538,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9352/9352064.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 2"
            },
            {
                "ID": "BN9",
                "Business Name": "Business Name Sample 9",
                "STATE": "Ilinois",
                "STATEABBREV": "IL",
                "CITY": "SILVIS",
                "LOCATION": "1650 FIRST AVE & 17 STREET",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.625431,
                "Longitude": -80.591135,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/10339/10339929.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 3"
            },
            {
                "ID": "BN10",
                "Business Name": "Business Name Sample 10",
                "STATE": "Pennsylvania",
                "STATEABBREV": "PA",
                "CITY": "SCOTTSDALE",
                "LOCATION": "SR819",
                "Outage": "FALSE",
                "Logo": "https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.670673,
                "Longitude": -80.584007,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9805/9805408.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 1"
            },
            {
                "ID": "BN11",
                "Business Name": "Business Name Sample 11",
                "STATE": "Pennsylvania",
                "STATEABBREV": "PA",
                "CITY": "SCOTTSDALE",
                "LOCATION": "SR819",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.671565,
                "Longitude": -80.575617,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9352/9352064.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 2"
            },
            {
                "ID": "BN12",
                "Business Name": "Business Name Sample 12",
                "STATE": "Pennsylvania",
                "STATEABBREV": "PA",
                "CITY": "HOMESTEAD",
                "LOCATION": "8TH AVE/SR 837",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.672866,
                "Longitude": -80.609593,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/10339/10339929.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 3"
            },
            {
                "ID": "BN13",
                "Business Name": "Business Name Sample 13",
                "STATE": "Pennsylvania",
                "STATEABBREV": "PA",
                "CITY": "HOMESTEAD",
                "LOCATION": "8TH AVE/SR 837",
                "Outage": "FALSE",
                "Logo": "https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png",
                "Email": "info@example1.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN1",
                "Latitude": 40.432869,
                "Longitude": -80.772654,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9805/9805408.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 1"
            },
            {
                "ID": "BN14",
                "Business Name": "Business Name Sample 14",
                "STATE": "Pennsylvania",
                "STATEABBREV": "PA",
                "CITY": "HOPEWELL",
                "LOCATION": "ROUTE 26/36",
                "Outage": "FALSE",
                "Logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
                "Email": "info@example2.com",
                "Phone": "1 000 000 000",
                "Website": "My website",
                "Website Link": "https://editor-sandbox.duda.co/site/db65dc46d2c6449889c5021e919cf537/location/BN2",
                "Latitude": 40.51766,
                "Longitude": -80.62462,
                "Marker Icon": "https://cdn-icons-png.flaticon.com/512/9352/9352064.png",
                "Additional Info Title": "Business Hours",
                "Category": "Category 2"
            }
        ],
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
    }
};

// WIDGET VARIABLES
let map;
let list = data.config.list;
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
let script_url = apikey ? `https://maps.googleapis.com/maps/api/js?v=beta&libraries=visualization,places&key=${apikey}&callback=map_callback` : `https://maps.googleapis.com/maps/api/js?v=beta&libraries=places&callback=map_callback`;


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
let map_style = [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
                "color": "#000000"
            },
            {
                "lightness": 13
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#e2d1b6"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#e2d1b6"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#e2d1b6"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#0e1c31"
        }]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#e2d1b6"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#111d33"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
                "color": "#122a50"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#e2d1b4"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "lightness": 25
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "lightness": 16
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry.fill",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#111d33"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
                "color": "#021019"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }
];
// COLLECTION
dmAPI.runOnReady('GoogleMap', function () {
    let response = new Collection(list).data();
    console.log(response)

    let resp = response;
    console.log(resp)
    locations.list = resp;
    dmAPI.loadScript(script_url, function () {
        let filter_dropdown = filter(resp, "category");
        $(element).find(".googleMap-Filter-Category").html(filter_dropdown);
        initMap(resp);
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
        let output = '';
        obj.map(i => {
            output += `<option>${i[key]}</option>`;
        });
        return output;
    };
}

function Collection(obj) {
    this.data = () => {
        return obj.map(i => {
            let item = {};
            Object.keys(i).filter(j => {
                item[removeSpecial(j).toLowerCase()] = typeof i[j] == "object" ? i[j].href : this.removeExtra(i[j]);
            });
            item.keyword = Object.keys(i).map(k => i[k]).join(',');
            return item;
        });
    };
    this.removeExtra = (str) => {
        if (str && typeof str == "string") {
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
    const geocoder = new google.maps.Geocoder();
    let markers = [];
    map = new google.maps.Map(document.getElementById(googleId), {
        center: {
            lat: centerLat,
            lng: centerLng
        },
        zoom: defaultZoom,
        mapTypeId: 'terrain'
    });


    let coordinates = obj.filter(i => i.outage.toLowerCase() == "true").map((i, index) => {
        // let marker = new google.maps.Marker({
        //     position: {
        //         lat: parseFloat(i.latitude),
        //         lng: parseFloat(i.longitude)
        //     },
        //     map,
        //     icon: {
        //         url: i.markericon,
        //         scaledSize: new google.maps.Size(markerSize, markerSize)
        //     },
        //     id: "marker_" + index
        // });

        // bounds.extend(marker.position);
        // markers.push(marker);
        // if (locations.list.length > 1) {
        //     map.fitBounds(bounds);
        // }

        // if (markerEvent) {
        //     google.maps.event.addListener(marker, trigger, (marker, j => {
        //         let name = isShowName ? `<div class="googlemap-InfoWindow-Name">
        //             <span>${i.businessname}</span>
        //         </div>` : "";

        //         let address = isShowAddress ? `<div class="googlemap-InfoWindow-Address">
        //             <span>${i.location}, ${i.city}, ${i.stateabbrev}</span>
        //         </div>` : "";


        //         let form = `
        //             <div class="googleMap-Container-InfoWindow">
        //                 ${name}
        //                 ${address}
        //             </div>`;


        //         return function () {
        //             infowindow.setContent(form);
        //             infowindow.open(map, marker);
        //         };
        //     })(marker, i));
        // }
        let coords = {
            location: new google.maps.LatLng(parseFloat(i.latitude), parseFloat(i.longitude)),
            weight: parseFloat(i.weight)
        };
        bounds.extend(coords.location);
        if (locations.list.length > 1) {
            map.fitBounds(bounds);
        }
        return coords;
    });
    // Listen to the 'bounds_changed' event of the map object
    google.maps.event.addListener(map, 'bounds_changed', function () {
        let visibleMarkers = markers.filter(function (marker) {
            return map.getBounds().contains(marker.getPosition());
        });
    });
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: coordinates
    });
    heatmap.setMap(map);
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
    let newObj = removeDuplicates(obj, key)
    return newObj.sort((a, b) => {
        return a[key] > b[key] ? 1 : -1;
    }).map(i => `<div class="googleMap-Category-Item"><img src="${i.markericon}"><span>${i.category}<span></div>`).join('');
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