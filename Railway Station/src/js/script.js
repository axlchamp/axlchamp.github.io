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
    config: {
        apikey: "https://axlchamp.github.io/Google%20Maps/main.html", //AIzaSyA0Sd-eaBl-zUFAbFdMnO5c0crhxeT4AIc || AIzaSyBMr1pQsfm1SIgU54HgGx5YxM56EjyOV3c || AIzaSyBxbT_lvVBVVSQdtRSUlp3lZYlDJyFRrLk
        spreadsheet: "https://docs.google.com/spreadsheets/d/1c4dcpoLCKSP2EBkp04rSTtjL3RXwspMvYAR_XAZgIwQ/edit?usp=sharing",
        sheetname: "Sheet1",

        // Map Default values
        defaultCenterLat: "34.126",
        defaultCenterLng: "-118.466027",
        markerSize: "20",
        marker_icon: './src/img/rec.png',
        initZoom: "11.5",

        // Label
        labelColorDefault: "#ffffff",
        labelColor: "#5153FF",

        // Map Lines
        strokeThickness: "3",
        strokeColor: "#1579b2",

        // Marker events
        markerEvent: true,
        trigger: "click", //click || mouseover

        //! Not in use -> Map setting Toggles 
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,

        newTab: true,
    }
};

// WIDGET VARIABLES
let map, globalMarker;
let newTab = data.config.newTab ? "_blank" : "_self";
let locations = {};
let create = new Create();
let collect = new Collection();

// Spreadsheet Details
let apikey = data.config.apikey;
let sheetname = data.config.sheetname;
let spreadsheet = data.config.spreadsheet;

let sheet = select_str(spreadsheet, "d/", 2, '/edit?usp=sharing'); // Get GSX ID
// Spreadsheet value for api
let sheetDetails = {
    sheetid: sheet,
    sheetname: sheetname ? sheetname : "Sheet1",
    apikey: 'AIzaSyAdIJAwH4h8sgYSWIrS3PNSew6rsyvavzU' //apikey ? apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0"
};

// Map Default values
let initZoom = parseFloat(data.config.initZoom);
let defaultCenterLat = parseFloat(data.config.defaultCenterLat);
let defaultCenterLng = parseFloat(data.config.defaultCenterLng);
let markerEvent = data.config.markerEvent;
let markerSize = parseInt(data.config.markerSize);

// Label
let labelColorDefault = data.config.labelColorDefault;
let labelColor = data.config.labelColor;

// Map Lines
let strokeThickness = parseInt(data.config.strokeThickness);
let strokeColor = data.config.strokeColor;

// Marker events
let marker_icon = data.config.marker_icon;
let trigger = data.config.trigger;

// Generate Map ID
let googleId = "map_" + Math.floor(Math.random(99999) * 99999);
$(element).find(".station-Map-Container").attr("id", googleId);

//! Not in use -> Map setting Toggles 
let zoomControl = data.config.zoomControl;
let mapTypeControl = data.config.mapTypeControl;
let streetViewControl = data.config.streetViewControl;

// Map Styles
let styleArray = [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
                "color": "#1579B2"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
                "visibility": "simplified"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
                "visibility": "simplified"
            }, {
                "saturation": 36
            },
            {
                "color": "#adadad"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": 'labels.text',
        "stylers": [{
            "color": '#adadad'
        }, {
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "elementType": 'labels.text',
        "stylers": [{
            "color": '#adadad'
        }, {
            "visibility": "off"
        }]
    }, {
        "featureType": "landscape",
        "elementType": 'labels',
        "stylers": [{
            "color": '#adadad'
        }, {
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }
];

// let googleMapEndpoint = `https://maps.googleapis.com/maps/api/js?v=3.45&key=${apikey}`;
let googleMapEndpoint = `https://maps.googleapis.com/maps/api/js?v=3.45&callback=init`;
dmAPI.runOnReady('init', function () {
    dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', function () {
        dmAPI.loadScript(googleMapEndpoint, function () {
            let responseData = collect.response(sheetDetails);
            Object.keys(sheetDetails).map(i => {
                if (!sheetDetails[i]) {
                    return alert(i + " Not Found!");
                }
            });
            responseData.then(resp => {

                locations.list = resp;

                // let getUniqueCategory = removeDuplicates(resp, "category");
                // let category = create.filter(getUniqueCategory);
                // $(element).find(".station-Filter-Category").html(`<option value="" selected="">All Category</option>${category}`);

                initMap(resp);

                // Stations Slider
                $(element).find(".station-Distance-Container").slick({
                    infinite: false,
                    slidesToShow: 5,
                    slidesToScroll: 2,
                    autoplay: false,
                    arrows: false,
                    dots: false,
                    draggable: false,
                    centerPadding: "0",
                    centerMode: true,
                    swipeToScroll: false
                });

                $(element).find(".station-Images-Container").slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    arrows: false,
                    dots: true
                });
            });
        });
    });
});

$(element).find('div.station-Panel-Details').draggable({
    containment: "document",
    handle: ".station-Details-Info,.station-Details-Distance"
});


// Close Popup
$(element).find("div.station-Panel-Close").click(function () {
    $(element).find("div.station-Panel-Details ").fadeOut();

    let latLng = new google.maps.LatLng(defaultCenterLat, defaultCenterLng);
    // Re position map to default
    map.panTo(latLng);
    // Reset map zoom to default
    map.setZoom(initZoom);

    globalMarker.map(s => {
        // s.setAnimation(null);
        s.setLabel({
            color: labelColorDefault,
            fontWeight: 'bold',
            fontSize: '16px',
            className: "station-Label",
            text: s.getLabel().text
        });
    });
});

function change_location(filteredAddresses) {

    // Destroy slick
    $(element).find(".station-Panel-Details [data-info=Images]").html("");
    $(element).find(".station-Images-Container").slick('unslick');

    // Change stations information on the popup
    create.location(filteredAddresses);

    // Initiate slick after images 
    // Image Slider
    $(element).find(".station-Images-Container").slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        dots: true,
    });
}

function Create() {
    this.location = (obj) => {
        let images = obj.images.split(',').map(i => {
            return `<div class="station-Container-Image">
                        <div class="station-Image-Box">
                            <img src="${i}" alt=""></div>
                    </div>`;
        }).join("");

        let links = this.links(obj.links.split(','), "links");
        // let poi = this.poi(obj.poi.split(','), "poi");


        $(element).find(".station-Panel-Details [data-info=Links]").html(links);
        $(element).find(".station-Panel-Details [data-info=Name]").text(obj.station);
        $(element).find(".station-Panel-Details [data-info=Sub]").text(obj.subname);
        $(element).find(".station-Panel-Details [data-info=Description]").text(obj.description);
        $(element).find(".station-Panel-Details [data-info=Images]").html(images);
    };
    this.links = (obj, key) => {
        return obj.map((i, index) => {
            let value = i[key] ? i[key] : i;
            return `<a href="${value}" class="station-List-Link">Link ${index+1}</option>`;
        }).join('');
    };
    this.poi = (obj, key) => {
        return obj.map((i, index) => {
            let value = i[key] ? i[key] : i;
            return `<a href="${value}" class="station-List-Link">Link ${index+1}</option>`;
        }).join('');
    };
}


function initMap(obj) {
    let bounds = new google.maps.LatLngBounds();
    let lat_lng = [];
    // Create new google map
    map = new google.maps.Map(document.getElementById(googleId), {
        center: {
            lat: defaultCenterLat,
            lng: defaultCenterLng
        },
        zoom: initZoom
    });
    map.setOptions({
        styles: styleArray
    });
    let newLocs = obj.filter(i => i.latitude || i.longitude);

    let gmarkers = newLocs.map((i, index) => {
        // Marker Icon Object
        let icon_img = {
            url: marker_icon,
            scaledSize: new google.maps.Size(markerSize, markerSize),
            labelOrigin: new google.maps.Point(parseInt(i.labelpointx), parseInt(i.labelpointy))
        };
        // Create Map Markers
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(i.latitude), parseFloat(i.longitude)),
            map,
            icon: icon_img,
            id: "marker_" + index * 2,
            label: {
                color: labelColorDefault,
                fontWeight: 'bold',
                fontSize: '16px',
                className: "station-Label",
                text: i.station
            }
        });
        bounds.extend(marker.position);

        if (locations.list.length > 1) {
            // Fit bounds to auto compute center and zoom of all markers
            // ! Comment out for predefined zoom and center
            // map.fitBounds(bounds);
            map.setZoom(initZoom);
        }

        if (markerEvent) {
            // Click Station Names
            $(element).on(trigger, ".station-Slides-Name", function () {
                let station_index = parseInt($(this).attr("data-id"));
                if (marker.id == `marker_${station_index}`) {
                    // Trigger marker with marker.id == element attr("data-id")
                    google.maps.event.trigger(marker, 'click');

                    // marker.setAnimation(google.maps.Animation.DROP);
                    // Change Marker Label font color to white
                    marker.setLabel({
                        color: labelColor,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        className: "station-Label",
                        text: i.station
                    });
                } else {
                    // marker.setAnimation(null);
                    // Change Marker Label font color to default
                    marker.setLabel({
                        color: labelColorDefault,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        className: "station-Label",
                        text: i.station
                    });
                }
            });
        }

        let myLatlng = new google.maps.LatLng(i.latitude, i.longitude);
        lat_lng.push(myLatlng);
        marker.setMap(map);
        return marker;
    });
    globalMarker = gmarkers;

    if (markerEvent) {
        gmarkers.map((i, index) => {
            // Add event listener on the marker ( trigger = click || hover )
            google.maps.event.addListener(i, trigger, (i, j => {
                // Pan map to selected marker
                let latLng = new google.maps.LatLng(i.getPosition().lat(), i.getPosition().lng());
                map.panTo(latLng);

                // Remove class -> for preloading slick slider
                $(element).find(".station-Panel-Details").removeClass('station-Panel-Details-Load');

                // Show Popup when clicked
                $(element).find("div.station-Panel-Details").fadeIn().focus();

                //get Obj for selected marker
                let objData = obj[index];
                change_location(objData);

                // Popup Active circle
                $(element).find(`.station-Distance-Container .station-Slides-Name`).removeClass("station-Distance-Active");
                $(element).find(`.station-Distance-Container [data-id=${index * 2}]`).addClass("station-Distance-Active");

                // Go to slider's selected slide
                $(element).find('.station-Distance-Container').slick('slickGoTo', index * 2);

                // Change Marker Label font color to default
                gmarkers.map(s => {
                    // s.setAnimation(null);
                    s.setLabel({
                        color: labelColorDefault,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        className: "station-Label",
                        text: s.getLabel().text
                    });
                });
                // Change Marker Label font color to white
                // i.setAnimation(google.maps.Animation.DROP);
                i.setLabel({
                    color: labelColor,
                    fontWeight: 'bold',
                    fontSize: '16px',
                    className: "station-Label",
                    text: objData.station
                });
            }), (gmarkers, i));
        });
    }

    // Main Object for polygonal lines on the map
    const mainLines = [{
            lat: 34.21172091,
            lng: -118.4487616
        }, {
            lat: 34.21172091,
            lng: -118.466234
        },
        {
            lat: 34.200501,
            lng: -118.466373
        },
        {
            lat: 34.180528,
            lng: -118.466195
        },
        {
            lat: 34.154607,
            lng: -118.466027
        },
        {
            lat: 34.134607,
            lng: -118.466027
        },
        {
            lat: 34.068964,
            lng: -118.443252
        },
        {
            lat: 34.058791,
            lng: -118.443252
        },
        {
            lat: 34.048,
            lng: -118.443252
        },
        {
            lat: 34.03537829,
            lng: -118.4342224
        }
    ];

    const metroLink = [{
        "lat": 34.19882719630155,
        "lng": -118.38352584951902
    }, {
        "lat": 34.23162687777685,
        "lng": -118.54991665199529
    }];
    const metroLink2 = [{
        "lat": 34.22458111750173,
        "lng": -118.44875959966099
    }, {
        "lat": 34.20121161633009,
        "lng": -118.44877476181387
    }];

    // D LINE Object for polygonal lines on the map
    const dLine = [{
        "lat": 34.05955296823434,
        "lng": -118.3764584342441
    }, {
        "lat": 34.058791,
        "lng": -118.443252
    }, {
        "lat": 34.05300260432751,
        "lng": -118.44938691462546
    }, ];

    // E LINE Object for polygonal lines on the map
    const eLine = [{
        "lat": 34.02792088260793,
        "lng": -118.38707832577445
    }, {
        "lat": 34.02939,
        "lng": -118.40467000000001
    }, {
        "lat": 34.029450000000004,
        "lng": -118.4055
    }, {
        "lat": 34.029630000000004,
        "lng": -118.40757
    }, {
        "lat": 34.029770000000006,
        "lng": -118.40862000000001
    }, {
        "lat": 34.030030000000004,
        "lng": -118.41007
    }, {
        "lat": 34.030350000000006,
        "lng": -118.41112000000001
    }, {
        "lat": 34.03061,
        "lng": -118.41191
    }, {
        "lat": 34.0308,
        "lng": -118.41253
    }, {
        "lat": 34.03098,
        "lng": -118.41297000000002
    }, {
        "lat": 34.03117,
        "lng": -118.41325
    }, {
        "lat": 34.031600000000005,
        "lng": -118.41362000000001
    }, {
        "lat": 34.031870000000005,
        "lng": -118.41391000000002
    }, {
        "lat": 34.03197,
        "lng": -118.41409000000002
    }, {
        "lat": 34.032230000000006,
        "lng": -118.41470000000001
    }, {
        "lat": 34.032540000000004,
        "lng": -118.41529000000001
    }, {
        "lat": 34.03277,
        "lng": -118.41566
    }, {
        "lat": 34.03291,
        "lng": -118.41583000000001
    }, {
        "lat": 34.03334,
        "lng": -118.41627000000001
    }, {
        "lat": 34.03347,
        "lng": -118.41637000000001
    }, {
        "lat": 34.034150000000004,
        "lng": -118.41675000000001
    }, {
        "lat": 34.03504,
        "lng": -118.41726000000001
    }, {
        "lat": 34.0354,
        "lng": -118.41751000000001
    }, {
        "lat": 34.03573,
        "lng": -118.41778000000001
    }, {
        "lat": 34.03602,
        "lng": -118.41810000000001
    }, {
        "lat": 34.03625,
        "lng": -118.41838000000001
    }, {
        "lat": 34.03645,
        "lng": -118.41869000000001
    }, {
        "lat": 34.03667,
        "lng": -118.41909000000001
    }, {
        "lat": 34.03683,
        "lng": -118.41946000000002
    }, {
        "lat": 34.036950000000004,
        "lng": -118.41980000000001
    }, {
        "lat": 34.0371,
        "lng": -118.42041
    }, {
        "lat": 34.037150000000004,
        "lng": -118.42079000000001
    }, {
        "lat": 34.03718,
        "lng": -118.42112000000002
    }, {
        "lat": 34.03718,
        "lng": -118.42177000000001
    }, {
        "lat": 34.03714,
        "lng": -118.42215000000002
    }, {
        "lat": 34.03676,
        "lng": -118.42478000000001
    }, {
        "lat": 34.03528,
        "lng": -118.43493000000001
    }, {
        "lat": 34.03502,
        "lng": -118.43663000000001
    }, {
        "lat": 34.03459,
        "lng": -118.43874000000001
    }, {
        "lat": 34.0341,
        "lng": -118.44106000000001
    }, {
        "lat": 34.03363,
        "lng": -118.44340000000001
    }, {
        "lat": 34.03302,
        "lng": -118.44654000000001
    }, {
        "lat": 34.032360000000004,
        "lng": -118.44981000000001
    }, {
        "lat": 34.03206,
        "lng": -118.45108
    }, {
        "lat": 34.031560000000006,
        "lng": -118.45339000000001
    }, {
        "lat": 34.030730000000005,
        "lng": -118.45757
    }, {
        "lat": 34.02904,
        "lng": -118.46580000000002
    }, {
        "lat": 34.02891,
        "lng": -118.46635
    }, {
        "lat": 34.02877,
        "lng": -118.46681000000001
    }, {
        "lat": 34.02698,
        "lng": -118.47208
    }, {
        "lat": 34.02615,
        "lng": -118.47423
    }, {
        "lat": 34.02597,
        "lng": -118.47462000000002
    }, {
        "lat": 34.02575,
        "lng": -118.47512
    }];

    // G LINE Object for polygonal lines on the map
    const gLine = [{
        "lat": 34.16857,
        "lng": -118.39730000000002
    }, {
        "lat": 34.16852,
        "lng": -118.39730000000002
    }, {
        "lat": 34.16852,
        "lng": -118.39850000000001
    }, {
        "lat": 34.168510000000005,
        "lng": -118.40106000000002
    }, {
        "lat": 34.168510000000005,
        "lng": -118.40526000000001
    }, {
        "lat": 34.1685,
        "lng": -118.41167000000002
    }, {
        "lat": 34.1685,
        "lng": -118.41522
    }, {
        "lat": 34.168530000000004,
        "lng": -118.41587000000001
    }, {
        "lat": 34.168580000000006,
        "lng": -118.41636000000001
    }, {
        "lat": 34.16868,
        "lng": -118.41689000000001
    }, {
        "lat": 34.168800000000005,
        "lng": -118.41736000000002
    }, {
        "lat": 34.168910000000004,
        "lng": -118.41773
    }, {
        "lat": 34.16911,
        "lng": -118.41824000000001
    }, {
        "lat": 34.169450000000005,
        "lng": -118.41892000000001
    }, {
        "lat": 34.169740000000004,
        "lng": -118.41937000000001
    }, {
        "lat": 34.169990000000006,
        "lng": -118.4197
    }, {
        "lat": 34.170700000000004,
        "lng": -118.42049000000002
    }, {
        "lat": 34.17118,
        "lng": -118.42102000000001
    }, {
        "lat": 34.171440000000004,
        "lng": -118.42131
    }, {
        "lat": 34.17156,
        "lng": -118.42147000000001
    }, {
        "lat": 34.17168,
        "lng": -118.42171
    }, {
        "lat": 34.171850000000006,
        "lng": -118.42213000000001
    }, {
        "lat": 34.17194,
        "lng": -118.4223
    }, {
        "lat": 34.1721,
        "lng": -118.42249000000001
    }, {
        "lat": 34.17231,
        "lng": -118.4227
    }, {
        "lat": 34.172850000000004,
        "lng": -118.42300000000002
    }, {
        "lat": 34.17307,
        "lng": -118.42313000000001
    }, {
        "lat": 34.173210000000005,
        "lng": -118.42324
    }, {
        "lat": 34.173610000000004,
        "lng": -118.42367000000002
    }, {
        "lat": 34.1769,
        "lng": -118.42725000000002
    }, {
        "lat": 34.177910000000004,
        "lng": -118.42835000000001
    }, {
        "lat": 34.179080000000006,
        "lng": -118.42965000000001
    }, {
        "lat": 34.17951,
        "lng": -118.43024000000001
    }, {
        "lat": 34.179880000000004,
        "lng": -118.43087000000001
    }, {
        "lat": 34.180060000000005,
        "lng": -118.43126000000001
    }, {
        "lat": 34.180110000000006,
        "lng": -118.43143
    }, {
        "lat": 34.18027,
        "lng": -118.43188
    }, {
        "lat": 34.180420000000005,
        "lng": -118.43242000000001
    }, {
        "lat": 34.18056,
        "lng": -118.43316000000002
    }, {
        "lat": 34.180620000000005,
        "lng": -118.43381000000001
    }, {
        "lat": 34.180640000000004,
        "lng": -118.43451
    }, {
        "lat": 34.180640000000004,
        "lng": -118.43604
    }, {
        "lat": 34.180640000000004,
        "lng": -118.43869000000001
    }, {
        "lat": 34.180620000000005,
        "lng": -118.44519000000001
    }, {
        "lat": 34.18057,
        "lng": -118.44678
    }, {
        "lat": 34.18056,
        "lng": -118.44874000000002
    }, {
        "lat": 34.18054,
        "lng": -118.45965000000001
    }, {
        "lat": 34.18052,
        "lng": -118.46619000000001
    }, {
        "lat": 34.18054,
        "lng": -118.46759000000002
    }, {
        "lat": 34.180580000000006,
        "lng": -118.468
    }, {
        "lat": 34.18074,
        "lng": -118.46869000000001
    }, {
        "lat": 34.18085,
        "lng": -118.46905000000001
    }, {
        "lat": 34.18097,
        "lng": -118.46939
    }, {
        "lat": 34.18117,
        "lng": -118.46984
    }, {
        "lat": 34.18141,
        "lng": -118.47027000000001
    }, {
        "lat": 34.181630000000006,
        "lng": -118.47057000000001
    }, {
        "lat": 34.18202,
        "lng": -118.471
    }, {
        "lat": 34.18238,
        "lng": -118.47131000000002
    }, {
        "lat": 34.18323,
        "lng": -118.47192000000001
    }, {
        "lat": 34.18444,
        "lng": -118.47277000000001
    }, {
        "lat": 34.184650000000005,
        "lng": -118.47293
    }, {
        "lat": 34.184850000000004,
        "lng": -118.47310000000002
    }, {
        "lat": 34.18518,
        "lng": -118.47349000000001
    }, {
        "lat": 34.185550000000006,
        "lng": -118.4741
    }, {
        "lat": 34.18569,
        "lng": -118.47438000000001
    }, {
        "lat": 34.18585,
        "lng": -118.47476
    }, {
        "lat": 34.185950000000005,
        "lng": -118.47504
    }, {
        "lat": 34.18607,
        "lng": -118.47548
    }, {
        "lat": 34.18614,
        "lng": -118.47578000000001
    }, {
        "lat": 34.18621,
        "lng": -118.47627000000001
    }, {
        "lat": 34.186240000000005,
        "lng": -118.47692
    }, {
        "lat": 34.186240000000005,
        "lng": -118.48385
    }, {
        "lat": 34.186240000000005,
        "lng": -118.48968
    }, {
        "lat": 34.18623,
        "lng": -118.49700000000001
    }, {
        "lat": 34.18623,
        "lng": -118.49807000000001
    }, {
        "lat": 34.1862,
        "lng": -118.49838000000001
    }, {
        "lat": 34.186080000000004,
        "lng": -118.49900000000001
    }, {
        "lat": 34.18598,
        "lng": -118.49943
    }, {
        "lat": 34.185930000000006,
        "lng": -118.49984
    }, {
        "lat": 34.18591,
        "lng": -118.50121000000001
    }, {
        "lat": 34.18592,
        "lng": -118.50425000000001
    }, {
        "lat": 34.185990000000004,
        "lng": -118.50493000000002
    }, {
        "lat": 34.186060000000005,
        "lng": -118.50557
    }, {
        "lat": 34.1861,
        "lng": -118.50611
    }, {
        "lat": 34.18609,
        "lng": -118.50643000000001
    }, {
        "lat": 34.18605,
        "lng": -118.50678
    }, {
        "lat": 34.185970000000005,
        "lng": -118.50721000000001
    }, {
        "lat": 34.185860000000005,
        "lng": -118.50764000000001
    }, {
        "lat": 34.185770000000005,
        "lng": -118.50788000000001
    }, {
        "lat": 34.185550000000006,
        "lng": -118.50838000000002
    }, {
        "lat": 34.18529,
        "lng": -118.50881000000001
    }, {
        "lat": 34.18509,
        "lng": -118.50908000000001
    }, {
        "lat": 34.18488,
        "lng": -118.50932000000002
    }, {
        "lat": 34.18451,
        "lng": -118.50967000000001
    }, {
        "lat": 34.184450000000005,
        "lng": -118.50971000000001
    }, {
        "lat": 34.18357,
        "lng": -118.51036
    }, {
        "lat": 34.1828,
        "lng": -118.51091000000001
    }, {
        "lat": 34.1822,
        "lng": -118.51136000000001
    }, {
        "lat": 34.18193,
        "lng": -118.51160000000002
    }, {
        "lat": 34.18169,
        "lng": -118.51184
    }, {
        "lat": 34.181490000000004,
        "lng": -118.51209000000001
    }, {
        "lat": 34.18126,
        "lng": -118.51242
    }, {
        "lat": 34.18099,
        "lng": -118.51291
    }, {
        "lat": 34.18083,
        "lng": -118.51328000000001
    }, {
        "lat": 34.180730000000004,
        "lng": -118.51354
    }, {
        "lat": 34.18056,
        "lng": -118.51417000000001
    }, {
        "lat": 34.18047,
        "lng": -118.51481000000001
    }, {
        "lat": 34.18045,
        "lng": -118.51526000000001
    }, {
        "lat": 34.180440000000004,
        "lng": -118.51668000000001
    }, {
        "lat": 34.180440000000004,
        "lng": -118.51846
    }, {
        "lat": 34.18043,
        "lng": -118.52115
    }, {
        "lat": 34.180420000000005,
        "lng": -118.52604000000001
    }, {
        "lat": 34.18043,
        "lng": -118.52828000000001
    }, {
        "lat": 34.18043,
        "lng": -118.52948
    }, {
        "lat": 34.180400000000006,
        "lng": -118.53144
    }, {
        "lat": 34.180400000000006,
        "lng": -118.53312000000001
    }, {
        "lat": 34.18039,
        "lng": -118.53482000000001
    }, {
        "lat": 34.18039,
        "lng": -118.53589000000001
    }, {
        "lat": 34.180400000000006,
        "lng": -118.5366
    }, {
        "lat": 34.180420000000005,
        "lng": -118.53752000000001
    }, {
        "lat": 34.18045,
        "lng": -118.53836000000001
    }, {
        "lat": 34.180460000000004,
        "lng": -118.53955
    }, {
        "lat": 34.180420000000005,
        "lng": -118.54084
    }, {
        "lat": 34.180400000000006,
        "lng": -118.54139
    }, {
        "lat": 34.18039,
        "lng": -118.54252000000001
    }, {
        "lat": 34.18039,
        "lng": -118.54406000000002
    }, {
        "lat": 34.18039,
        "lng": -118.54477000000001
    }, {
        "lat": 34.18037,
        "lng": -118.54843000000001
    }, {
        "lat": 34.18039,
        "lng": -118.54954000000001
    }, {
        "lat": 34.18041,
        "lng": -118.55000000000001
    }, {
        "lat": 34.18048,
        "lng": -118.55059000000001
    }, {
        "lat": 34.180580000000006,
        "lng": -118.55117000000001
    }, {
        "lat": 34.18072,
        "lng": -118.55180000000001
    }, {
        "lat": 34.18081,
        "lng": -118.55209
    }, {
        "lat": 34.18092,
        "lng": -118.55245000000001
    }, {
        "lat": 34.18128,
        "lng": -118.55350000000001
    }, {
        "lat": 34.18184,
        "lng": -118.55517
    }, {
        "lat": 34.18225,
        "lng": -118.55643
    }, {
        "lat": 34.18236,
        "lng": -118.55678
    }, {
        "lat": 34.18327,
        "lng": -118.55945000000001
    }, {
        "lat": 34.18551,
        "lng": -118.56607000000001
    }, {
        "lat": 34.18636,
        "lng": -118.56855000000002
    }, {
        "lat": 34.18668,
        "lng": -118.56952000000001
    }, {
        "lat": 34.187720000000006,
        "lng": -118.57257000000001
    }, {
        "lat": 34.18809,
        "lng": -118.57367
    }, {
        "lat": 34.18826,
        "lng": -118.57427000000001
    }, {
        "lat": 34.188480000000006,
        "lng": -118.57527
    }, {
        "lat": 34.188610000000004,
        "lng": -118.57622
    }, {
        "lat": 34.188680000000005,
        "lng": -118.5772
    }, {
        "lat": 34.18867,
        "lng": -118.5845
    }, {
        "lat": 34.188660000000006,
        "lng": -118.58752000000001
    }, {
        "lat": 34.18865,
        "lng": -118.58847000000002
    }, {
        "lat": 34.18865,
        "lng": -118.58925
    }, {
        "lat": 34.18874,
        "lng": -118.58925
    }];

    // Add polygonal lines on the map
    const railLines = new google.maps.Polyline({
        path: mainLines,
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });
    const metroLinkRails = new google.maps.Polyline({
        path: metroLink,
        geodesic: true,
        strokeColor: "#ffbf00",
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });
    const metroLinkRails2 = new google.maps.Polyline({
        path: metroLink2,
        geodesic: true,
        strokeColor: "#f99aea",
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });
    const dLineRails = new google.maps.Polyline({
        path: dLine,
        geodesic: true,
        strokeColor: "#6B52CC",
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });
    const eLineRails = new google.maps.Polyline({
        path: eLine,
        geodesic: true,
        strokeColor: "#9ecdfe",
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });
    const gLineRails = new google.maps.Polyline({
        path: gLine,
        geodesic: true,
        strokeColor: "#ed9a00",
        strokeOpacity: 1.0,
        strokeWeight: strokeThickness,
    });

    // Set Map
    railLines.setMap(map);
    // metroLinkRails.setMap(map);
    // metroLinkRails2.setMap(map);
    // dLineRails.setMap(map);
    // eLineRails.setMap(map);
    // gLineRails.setMap(map);
}



//////////////////\\\\\\\\\\\\\\
///// PLUGIN /////  \\\\\ JS \\\\\
//////////////////    \\\\\\\\\\\\\\

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
            return values.map(i => {
                let items = {};
                header.map((k, index) => {
                    items[removeSpecial(k.toLowerCase())] = i[index];
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

//Remove duplicate from Object
function removeDuplicates(array, key) {
    return array.reduce(function (arr, item) {
        const removed = arr.filter(function (i) {
            return i[key] !== item[key];
        });
        return [...removed, item];
    }, []);
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

function init() {
    console.log("Map loaded..");
}

// Get Specific String
function select_str(str, index, charCount, strRep) {
    return str.substring(str.indexOf(index) + charCount).replace(strRep, '');
}

addCss('fontAwesomeSource', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
addCss('sliderCss', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css');
addCss('sliderCssTheme', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css');

function addCss(id, href) {
    if (!document.getElementById(id)) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.crossOrigin = 'anonymous';
        head.appendChild(link);
    }
}