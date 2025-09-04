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
				if (script.readyState == "loaded" || script.readyState == "complete") {
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
	config: {
		lmRad: "30",
		lmMidpoint: "What is Halfway?",
		apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c",
		lmInitialTo: "",
		lmFrom: "From",
		lmInitialPOI: "Restaurant",
		lmRadiusLabel: "Radius ( miles )",
		lmNearbyRel: "Find More Related Nearby",
		lmInitialFrom: "",
		lmPOI: "Establishments",
		lmLayout: "lmHorizontal",
		lmTo: "To",
	},
};

let map, service, defaultSetting;
let apikey = data.config.apikey;
// let apikey = data.config.apikey;
$(document).ready(function () {
	var lmOptions = `<option value="Restaurant">Restaurant</option>
		<option value="Cafe">Cafe</option>
		<option value="Night Club">Night Club</option>
		<option value="Shopping Mall">Shopping Mall</option>
		<option value="Park">Park</option>
		<option value="Airport">Airport</option>
		<option value="Car Rental">Car Rental</option>
		<option value="Convenience Store">Convenience Store</option>
		<option value="Gas Station">Gas Station</option>
		<option value="Hospital">Hospital</option>
		<option value="Liquor Store">Liquor Store</option>
		<option value="Police">Police</option>`;

	//IF USING SAFARI START
	var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	var is_firefox = typeof window.InstallTrigger !== "undefined";
	is_safari || is_firefox ? $(".lmIs_Chrome").remove() : $(".lmIs_Safari").remove();
	is_safari || is_firefox ? "" : $(element).find(".dataListEstablishment").append(lmOptions);

	//IF USING SAFARI END

	// Append Max Radius as Dropdown Start
	if (is_safari || is_firefox) {
		for (var ind = 1; ind <= data.config.lmRad; ind++) {
			ind == 1
				? $(element)
						.find(".radiusDropdown")
						.append("<option value=" + ind + ">" + ind + "</option>")
				: $(element)
						.find(".radiusDropdown")
						.append("<option value=" + ind + ">" + ind + "</option>");
		}
	} else {
		for (var ind = 1; ind <= data.config.lmRad; ind++) {
			ind == 1
				? $(element)
						.find(".radiusDropdown")
						.append("<option value=" + ind + "></option>")
				: $(element)
						.find(".radiusDropdown")
						.append("<option value=" + ind + "></option>");
		}
	}
	// Append Max Radius as Dropdown End

	if (apikey != "") {
		dmAPI.loadScript(`https://maps.google.com/maps/api/js?v=weekly&key=${apikey}&libraries=drawing,places&callback=cb`, function () {
			dmAPI.loadScript(`https://irt-cdn.multiscreensite.com/5775367238d847b8b62d126ce25c20de/files/uploaded/slick-latest.js`, function () {
				initMap();
			});
		});
	}
	// BUTTON CLICK / INITIALIZE
	document.getElementById("gethalf").addEventListener("click", function () {
		$(element).find(".placeContainer").remove();
		initMap();
	});
});

// INITIALIZE GOOGLE MAP
function initMap() {
	$(element).find("#map").html("");
	$(element).find(".detailsContainer").html("");
	$(element).find(".detailsContainer").fadeIn();
	$(element).find(".lmLocationModal").hide();
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: {
			lat: 37.8822689,
			lng: -100.5231212,
		},
		mapTypeId: "roadmap",
	});
	var input1 = document.getElementById("startLoc");
	var input2 = document.getElementById("destination");
	var searchBox1 = new google.maps.places.SearchBox(input1);
	var searchBox2 = new google.maps.places.SearchBox(input2);
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var geocoder = new google.maps.Geocoder();
	var address = [input1.value, input2.value];
	defaultSettings = {
		geocoder: geocoder,
		map: map,
		address: address,
		directionsService: directionsService,
		directionsDisplay: directionsDisplay,
	};
	if (input1.value != "" && input2.value != "") {
		$(".lmHorizontal").addClass("lmHalf");
		geocodeAddress(geocoder, map, address, directionsService, directionsDisplay);
		directionsDisplay.setMap(map);
	}
}

// GET CURRENT
function getCurrent(geocoder, map, address, directionsService, directionsDisplay) {
	navigator.geolocation.getCurrentPosition(function (position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};
		geocoder.geocode(
			{
				location: new google.maps.LatLng(pos.lat, pos.lng),
			},
			function (results, status) {
				var formatted = results[0].formatted_address;
			}
		); //geocoder
	});
}

// GEO CODE ADDRESS
function geocodeAddress(geocoder, map, address, directionsService, directionsDisplay) {
	google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
		var EarthRadiusMeters = 6378137.0; // meters
		var lat1 = this.lat();
		var lon1 = this.lng();
		var lat2 = newLatLng.lat();
		var lon2 = newLatLng.lng();
		var dLat = ((lat2 - lat1) * Math.PI) / 180;
		var dLon = ((lon2 - lon1) * Math.PI) / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = EarthRadiusMeters * c;
		return d;
	};
	google.maps.LatLng.prototype.latRadians = function () {
		return (this.lat() * Math.PI) / 180;
	};
	google.maps.LatLng.prototype.lngRadians = function () {
		return (this.lng() * Math.PI) / 180;
	};
	google.maps.Polygon.prototype.Contains = function (point) {
		var j = 0;
		var oddNodes = false;
		var x = point.lng();
		var y = point.lat();
		for (var i = 0; i < this.getPath().getLength(); i++) {
			j++;
			if (j == this.getPath().getLength()) {
				j = 0;
			}
			if ((this.getPath().getAt(i).lat() < y && this.getPath().getAt(j).lat() >= y) || (this.getPath().getAt(j).lat() < y && this.getPath().getAt(i).lat() >= y)) {
				if (this.getPath().getAt(i).lng() + ((y - this.getPath().getAt(i).lat()) / (this.getPath().getAt(j).lat() - this.getPath().getAt(i).lat())) * (this.getPath().getAt(j).lng() - this.getPath().getAt(i).lng()) < x) {
					oddNodes = !oddNodes;
				}
			}
		}
		return oddNodes;
	};
	google.maps.Polygon.prototype.Area = function () {
		var a = 0;
		var j = 0;
		var b = this.Bounds();
		var x0 = b.getSouthWest().lng();
		var y0 = b.getSouthWest().lat();
		for (var i = 0; i < this.getPath().getLength(); i++) {
			j++;
			if (j == this.getPath().getLength()) {
				j = 0;
			}
			var x1 = this.getPath()
				.getAt(i)
				.distanceFrom(new google.maps.LatLng(this.getPath().getAt(i).lat(), x0));
			var x2 = this.getPath()
				.getAt(j)
				.distanceFrom(new google.maps.LatLng(this.getPath().getAt(j).lat(), x0));
			var y1 = this.getPath()
				.getAt(i)
				.distanceFrom(new google.maps.LatLng(y0, this.getPath().getAt(i).lng()));
			var y2 = this.getPath()
				.getAt(j)
				.distanceFrom(new google.maps.LatLng(y0, this.getPath().getAt(j).lng()));
			a += x1 * y2 - x2 * y1;
		}
		return Math.abs(a * 0.5);
	};
	google.maps.Polygon.prototype.Distance = function () {
		var dist = 0;
		for (var i = 1; i < this.getPath().getLength(); i++) {
			dist += this.getPath()
				.getAt(i)
				.distanceFrom(this.getPath().getAt(i - 1));
		}
		return dist;
	};
	google.maps.Polygon.prototype.Bounds = function () {
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < this.getPath().getLength(); i++) {
			bounds.extend(this.getPath().getAt(i));
		}
		return bounds;
	};
	google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
		// some awkward special cases
		if (metres == 0) return this.getPath().getAt(0);
		if (metres < 0) return null;
		if (this.getPath().getLength() < 2) return null;
		var dist = 0;
		var olddist = 0;
		for (var i = 1; i < this.getPath().getLength() && dist < metres; i++) {
			olddist = dist;
			dist += this.getPath()
				.getAt(i)
				.distanceFrom(this.getPath().getAt(i - 1));
		}
		if (dist < metres) {
			return null;
		}
		var p1 = this.getPath().getAt(i - 2);
		var p2 = this.getPath().getAt(i - 1);
		var m = (metres - olddist) / (dist - olddist);
		return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
	};
	google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
		var next = metres;
		var points = [];
		// some awkward special cases
		if (metres <= 0) return points;
		var dist = 0;
		var olddist = 0;
		for (var i = 1; i < this.getPath().getLength(); i++) {
			olddist = dist;
			dist += this.getPath()
				.getAt(i)
				.distanceFrom(this.getPath().getAt(i - 1));
			while (dist > next) {
				var p1 = this.getPath().getAt(i - 1);
				var p2 = this.getPath().getAt(i);
				var m = (next - olddist) / (dist - olddist);
				points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
				next += metres;
			}
		}
		return points;
	};
	google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
		// some awkward special cases
		if (metres == 0) return this.getPath().getAt(0);
		if (metres < 0) return null;
		var dist = 0;
		var olddist = 0;
		for (var i = 1; i < this.getPath().getLength() && dist < metres; i++) {
			olddist = dist;
			dist += this.getPath()
				.getAt(i)
				.distanceFrom(this.getPath().getAt(i - 1));
		}
		if (dist < metres) {
			return null;
		}
		return i;
	};
	google.maps.Polygon.prototype.Bearing = function (v1, v2) {
		if (v1 == null) {
			v1 = 0;
			v2 = this.getPath().getLength() - 1;
		} else if (v2 == null) {
			v2 = v1 + 1;
		}
		if (v1 < 0 || v1 >= this.getPath().getLength() || v2 < 0 || v2 >= this.getPath().getLength()) {
			return;
		}
		var from = this.getPath().getAt(v1);
		var to = this.getPath().getAt(v2);
		if (from.equals(to)) {
			return 0;
		}
		var lat1 = from.latRadians();
		var lon1 = from.lngRadians();
		var lat2 = to.latRadians();
		var lon2 = to.lngRadians();
		var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
		if (angle < 0.0) angle += Math.PI * 2.0;
		angle = (angle * 180.0) / Math.PI;
		return parseFloat(angle.toFixed(1));
	};
	google.maps.Polyline.prototype.Contains = google.maps.Polygon.prototype.Contains;
	google.maps.Polyline.prototype.Area = google.maps.Polygon.prototype.Area;
	google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
	google.maps.Polyline.prototype.Bounds = google.maps.Polygon.prototype.Bounds;
	google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
	google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
	google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;
	google.maps.Polyline.prototype.Bearing = google.maps.Polygon.prototype.Bearing;

	var marker;
	var bounds = new google.maps.LatLngBounds();

	let passLatLng = address.map(function (i) {
		geocoder.geocode({ address: i }, function (results, status) {
			marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(parseFloat(results[0].geometry.location.lat()), parseFloat(results[0].geometry.location.lng())),
				animation: google.maps.Animation.DROP,
			});
			bounds.extend(marker.position);
			map.fitBounds(bounds);
		}); //geocoder
		return i;
	});
	var setPass = setInterval(function () {
		if (passLatLng.length != 0) {
			setCenter(geocoder, map, directionsService, directionsDisplay, passLatLng);
			clearInterval(setPass);
		}
	}, 1000);
}

function getSpcLoc(geocoder, map, address, directionsService, directionsDisplay, dataMarker, trMode) {
	var marker;
	var bounds = new google.maps.LatLngBounds();
	var passLatLng = [];
	map = new google.maps.Map(document.getElementById("map"));
	var a,
		markerCount = 0;
	address.map(function (a) {
		passLatLng.push(a);
		geocoder.geocode(
			{
				address: a,
			},
			function (results, status) {
				// var infowindow = new google.maps.InfoWindow({
				//         content:results[0].formatted_address,
				//         position:new google.maps.LatLng(parseFloat(results[0].geometry.location.lat()), parseFloat(results[0].geometry.location.lng())),
				//     });
				marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(parseFloat(results[0].geometry.location.lat()), parseFloat(results[0].geometry.location.lng())),
					animation: google.maps.Animation.DROP,
					icon: {
						url: dataMarker[markerCount],
						scaledSize: new google.maps.Size(40, 40), // scaled size
					},
				});
				markerCount++;
				bounds.extend(marker.position);
				map.fitBounds(bounds);
				// infowindow.close();
				// infowindow.open(map,marker);
			}
		);
	});

	var setPass = setInterval(function () {
		if (passLatLng.length != 0) {
			newTest2(geocoder, map, directionsService, directionsDisplay, passLatLng, trMode);
			clearInterval(setPass);
		}
	}, 1000);
} // getSpcLoc

function newTest2(geocoder, map, directionsService, directionsDisplay, passLatLng, travelMode) {
	var pathArr = [];
	var request = {
		origin: passLatLng[0],
		destination: passLatLng[1],
		provideRouteAlternatives: true,
		travelMode: travelMode,
	};
	directionsService.route(request, function (response, status) {
		if (status === "OK") {
			response.routes[0].legs.map(function (j) {
				j.steps.map(function (k) {
					k.path.map(function (l) {
						pathArr.push({
							lat: l.lat(),
							lng: l.lng(),
						});
					});
				});
			});
			var flightPath = new google.maps.Polyline({
				path: pathArr,
				geodesic: true,
				strokeColor: "#4AA3D3",
				strokeOpacity: 0.9,
				strokeWeight: 5,
				map: map,
			});
			directionsDisplay.setDirections(response);
			// var fpDistance = flightPath.Distance();
			// var centerPoint = flightPath.GetPointAtDistance(fpDistance/2);
			// if(noStore != "noStore"){
			//     setWaypoint(geocoder,passLatLng,directionsService,directionsDisplay,getRad,centerPoint,noStore,travelMode);
			// }
		} else {
			window.alert("Directions request failed due to " + status);
		}
	});
} //NEW TEST 2

// GET DIRECTION AND ADD WAYPOINT
function setCenter(geocoder, map, directionsService, directionsDisplay, passLatLng) {
	var pathArr = [];
	var request = {
		origin: passLatLng[0],
		destination: passLatLng[1],
		provideRouteAlternatives: true,
		travelMode: "DRIVING",
	};
	directionsService.route(request, function (response, status) {
		if (status === "OK") {
			var getRad;
			if ($(element).find(".dataRadius").val()) {
				var splitradius = $(element).find(".dataRadius").val().split(" ");
				getRad = splitradius[0] * 1000 * 1.60934;
			} else {
				getRad = response.routes[0].legs[0].distance.value / 2;
			}
			var miles = Math.floor(response.routes[0].legs[0].distance.value / 1000 / 1.60934); //meters/1000 to get km/1.60934 to get miles
			response.routes[0].legs.map(function (j) {
				$(element)
					.find(".destinationDetails")
					.html("The distance between <b>" + response.request.origin.query + "</b> and <b>" + response.request.destination.query + "</b> is <b>" + miles + " miles</b>");
				j.steps.map(function (k) {
					k.path.map(function (l) {
						pathArr.push({
							lat: l.lat(),
							lng: l.lng(),
						});
					}); //k
				}); //j
			}); //response
			var flightPath = new google.maps.Polyline({
				path: pathArr,
				geodesic: true,
				strokeColor: "transparent",
				strokeOpacity: 0,
				strokeWeight: 0,
				map: map,
			}); //flightPath
			directionsDisplay.setDirections(response);
			var fpDistance = flightPath.Distance();
			var centerPoint = flightPath.GetPointAtDistance(fpDistance / 2);
			setWaypoint(geocoder, passLatLng, directionsService, directionsDisplay, getRad, centerPoint);
		} else {
			window.alert("Directions request failed due to " + status);
		} //if else
	}); //directionService Route
} // SET CENTER

// ADD WAYPOINT
function setWaypoint(geocoder, passLatLng, directionsService, directionsDisplay, getRad, centerPoint) {
	var estList = [
		"accounting",
		"airport",
		"amusement_park",
		"aquarium",
		"art_gallery",
		"atm",
		"bakery",
		"bank",
		"bar",
		"beauty_salon",
		"bicycle_store",
		"book_store",
		"bowling_alley",
		"bus_station",
		"cafe",
		"campground",
		"car_dealer",
		"car_rental",
		"car_repair",
		"car_wash",
		"casino",
		"cemetery",
		"church",
		"city_hall",
		"clothing_store",
		"convenience_store",
		"courthouse",
		"dentist",
		"department_store",
		"doctor",
		"electrician",
		"electronics_store",
		"embassy",
		"fire_station",
		"florist",
		"funeral_home",
		"furniture_store",
		"gas_station",
		"gym",
		"hair_care",
		"hardware_store",
		"hindu_temple",
		"home_goods_store",
		"hospital",
		"insurance_agency",
		"jewelry_store",
		"laundry",
		"lawyer",
		"library",
		"liquor_store",
		"local_government_office",
		"locksmith",
		"lodging",
		"meal_delivery",
		"meal_takeaway",
		"mosque",
		"movie_rental",
		"movie_theater",
		"moving_company",
		"museum",
		"night_club",
		"painter",
		"park",
		"parking",
		"pet_store",
		"pharmacy",
		"physiotherapist",
		"plumber",
		"police",
		"post_office",
		"real_estate_agency",
		"restaurant",
		"roofing_contractor",
		"rv_park",
		"school",
		"shoe_store",
		"shopping_mall",
		"spa",
		"stadium",
		"storage",
		"store",
		"subway_station",
		"supermarket",
		"synagogue",
		"taxi_stand",
		"train_station",
		"transit_station",
		"travel_agency",
		"veterinary_care",
		"zoo",
	];
	var res = {
		origin: passLatLng[0],
		destination: passLatLng[1],
		provideRouteAlternatives: true,
		waypoints: [
			{
				location: centerPoint,
				stopover: false,
			},
		],
		optimizeWaypoints: true,
		travelMode: "DRIVING",
	};
	var service = new google.maps.places.PlacesService(map);
	directionsService.route(res, function (response, status) {
		directionsDisplay.setDirections(response);
		var centerLoc = response.routes[0].legs[0].via_waypoint[0].location;
		var centerCoord = {
			lat: centerLoc.lat(),
			lng: centerLoc.lng(),
		};
		var halfway = {
			midpoint: {
				center: centerCoord,
				population: getRad,
			},
		};
		var cityCircle;
		for (var city in halfway) {
			cityCircle = new google.maps.Circle({
				strokeColor: "#FFFFFF",
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: "#00A0AF",
				fillOpacity: 0.35,
				map: map,
				center: halfway[city].center,
				radius: getRad,
			});
		}
		var esType = $(element).find(".dataEstablishment").val() ? $(element).find(".dataEstablishment").val().split(" ").join("_").toLowerCase() : "";
		var plType = estList.includes(esType) ? (esType = esType) : (esType = "");
		var request = {
			location: new google.maps.LatLng(centerCoord.lat, centerCoord.lng),
			radius: getRad,
			type: [plType],
			strictBounds: true,
		};
		service.nearbySearch(request, function placeStoreMarker(results, status) {
			//var locArray = [""];
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var mark = 1;
				getRes(results, defaultSettings);
			} else {
				var noResult = `<div class="lmNoresult">'
					<div class="lmNoResultImage">
						<img src="https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1480481055">
					</div>
					<div class="lnNoresultText">
						<div class="lmNoresultTitle">NO RESULTS FOUND</div>
						<div class="lmNoresultTxt">with in the given radius. Please adjust your search settings.</div>
					</div>
				</div>`;
				$(element).find(".detailsContainer").html(noResult);
			}
		});
		geocoder.geocode(
			{
				location: {
					lat: centerLoc.lat(),
					lng: centerLoc.lng(),
				},
			},
			function (results, status) {
				$(element)
					.find(".centerDestination")
					.html("Taking this route the midpoint is <b>" + results[0].formatted_address + "</b>");
			}
		);
	}); //directionsService
	$(element)
		.find(".lmDirection")
		.on("click", ".lmTrMode", function () {
			$(".lmTrMode").removeClass("lmTrModeActive");
			$(this).addClass("lmTrModeActive");
			var dataMarker = [$(this).parents(".lmDirectionAandBContainer").data("marker"), $(this).data("direct")];
			var curPnt = $(this).data("loca");
			var dest = $(this).data("des");
			var trMode = $(this).data("travel");
			var newAddr = [curPnt, dest];
			getSpcLoc(defaultSettings.geocoder, defaultSettings.map, newAddr, defaultSettings.directionsService, defaultSettings.directionsDisplay, dataMarker, trMode);
		});
	//GET ADDITIONAL LOCATIONS NEARBY
	$(element)
		.find(".lmDirection")
		.on("click", ".lmFindMore", function () {
			var posL = $(this).data("pos");
			var typ = $(this).data("tpe");
			getNearbyStores(service, map, posL, typ, defaultSettings);
		});
}

function getRes(results, defaultSettings) {
	$(element).find(".detailsContainerMain").show();
	$(element).find(".detailsContainer").show();
	$(element).find(".lmLocationModal").hide();
	$(element).find(".lmDirection").html("");
	$(element).find(".detailsContainer").html("");
	var mark = 1;
	var marker;
	results.map(function (i) {
		var posLat = i.geometry.location.lat();
		var posLng = i.geometry.location.lng();
		if (!i.types.includes("locality")) {
			if (!i.types.includes("premise")) {
				if (!i.types.includes("political")) {
					marker = new google.maps.Marker({
						map: map,
						position: new google.maps.LatLng(posLat, posLng),
						icon: {
							url: "https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/icon" + mark + ".png",
							scaledSize: new google.maps.Size(40, 40), // scaled size
						},
						animation: google.maps.Animation.DROP,
					});
					var pID = i.place_id;
					var name = i.name;
					var address = i.vicinity;
					var setAdd = i.plus_code ? i.plus_code.compound_code : address;
					var ratings = i.rating ? i.rating : "N/A";
					var append = `<div class="placeContainer" data-lat='${posLat}' data-lng='${posLng}' data-place="${pID}">
						<div class="leftDetails">
							<div class="placeName">
								<img src="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/icon${mark}.png">
								<span class="lmInfo">${name}</span>
							</div>
							<div class="placeBottom">
								<div class="placeAddress">
									<i class="fa fa-1xs fa-compass"></i>
									<span class="lmInfo">${address}</span>
								</div>
								<div class="placeRating">
									<i class="fa fa-1xs icon-star"></i>
									<span class="lmInfo">${ratings}</span>
								</div>
							</div>
						</div>
						<div class="rightDetails">
							<div class="placeImage" style="background-image:url(${getPhoto(i)})">
								<img src="${getPhoto(i)}">
							</div>
						</div>
						<div class="placeReviewText"></div>
					</div>`;

					$(element).find(".detailsContainer").append(append);
					//ADDITIONAL BUTTONS
					var appendDir = `<div class="lmDirectionAandBContainer ${pID}" data-marker="${marker.icon.url}">';
						<!--LOCATION A-->
						<div class="lmLocfromA lmDirectionAandB lmA">';
							<div class="lmTextIcon">';
								<div class="lmTextIcon-T">First location to meeting point</div>';
							</div>';
							<div class="lmButtonContainer">';
								<div class="lmButtonDirect">';
									<div class="lmTravelMode">';
										<div class="lmDriving lmTrMode" data-loca="${defaultSettings.address[0]}" data-des="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconA.png"
											data-travel="DRIVING">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" width="39.055px" height="39.054px" viewBox="0 0 39.055 39.054"
												style="enable-background:new 0 0 39.055 39.054;" xml:space="preserve">';
												<g>';
													<path
														d="M38.831,14.26c-0.191-0.233-0.476-0.369-0.775-0.369h-3.801c-0.938-2.474-2.16-4.898-3.549-5.813    c-4.805-3.161-17.55-3.161-22.355,0c-1.39,0.916-2.607,3.343-3.55,5.813H1c-0.302,0-0.586,0.136-0.775,0.369    c-0.19,0.232-0.266,0.539-0.204,0.834l0.563,2.728c0.096,0.465,0.506,0.797,0.979,0.797h1.126    c-1.087,1.254-1.614,2.833-1.621,4.413c-0.007,1.952,0.734,3.716,2.089,4.964c0.015,0.013,0.03,0.022,0.044,0.035v3.817    c0,0.827,0.672,1.5,1.5,1.5h3.506c0.828,0,1.5-0.673,1.5-1.5v-1.534h19.641v1.534c0,0.827,0.672,1.5,1.5,1.5h3.506    c0.826,0,1.5-0.673,1.5-1.5v-3.742c1.438-1.317,2.125-3.129,2.134-4.938c0.006-1.634-0.545-3.271-1.696-4.551h1.201    c0.475,0,0.885-0.332,0.979-0.798l0.564-2.727C39.094,14.799,39.021,14.494,38.831,14.26z M9.998,10.583    c3.83-2.521,15.229-2.521,19.057,0c0.744,0.488,1.701,2.461,2.578,4.877H7.422C8.297,13.045,9.254,11.073,9.998,10.583z     M5.512,23.408c0-1.63,1.322-2.95,2.951-2.95c1.631,0,2.951,1.32,2.951,2.95s-1.32,2.951-2.951,2.951    C6.834,26.359,5.512,25.038,5.512,23.408z M30.631,26.359c-1.629,0-2.951-1.321-2.951-2.951s1.322-2.95,2.951-2.95    c1.631,0,2.951,1.32,2.951,2.95S32.26,26.359,30.631,26.359z" />
													';
												</g>';
											</svg>';
										</div>';
										<div class="lmTransit lmTrMode" data-loca="${defaultSettings.address[0]}" data-des="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconA.png"
											data-travel="TRANSIT">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" width="582.675px" height="582.675px"
												viewBox="0 0 582.675 582.675" style="enable-background:new 0 0 582.675 582.675;"
												xml:space="preserve">';
												<g id="Layer_1_21_">';
													<path
														d="M518.288,545.7l-85.425-155.55c24.225-3.825,42.074-25.5,42.074-49.726v-229.5C474.937,49.725,425.212,0,364.012,0    h-145.35c-61.2,0-112.2,49.725-112.2,112.2v228.225c0,25.5,17.85,45.9,42.075,49.726L64.387,545.7    c-6.375,12.75-2.55,28.05,10.2,34.425c3.825,2.55,7.65,2.55,11.475,2.55c8.925,0,17.85-5.1,21.675-12.75l7.65-12.75h351.9    l7.649,12.75c5.101,8.925,12.75,12.75,21.676,12.75c3.824,0,7.649-1.274,11.475-2.55C520.837,573.75,524.663,558.45,518.288,545.7    z M398.437,430.95h-214.2l21.675-39.525h170.85L398.437,430.95z M394.613,345.525c-20.4,0-36.976-16.575-36.976-36.976    c0-20.4,16.575-36.975,36.976-36.975c20.399,0,36.975,16.575,36.975,36.975C431.587,327.675,415.012,345.525,394.613,345.525z     M151.087,126.225c0-39.525,31.875-71.4,70.125-71.4h138.975c38.25,0,71.4,31.875,71.4,71.4v61.2    c0,14.025-11.475,24.225-25.5,24.225h-229.5c-14.025,0-24.225-11.475-24.225-24.225L151.087,126.225L151.087,126.225z     M188.062,270.3c20.4,0,36.975,16.575,36.975,36.976c0,20.399-16.575,36.975-36.975,36.975s-36.975-16.575-36.975-36.975    C151.087,286.875,167.663,270.3,188.062,270.3z M135.788,518.925l28.05-49.725h255l28.05,49.725H135.788z" />
													';
												</g>';
											</svg>';
										</div>';
										<div class="lmWalking lmTrMode" data-loca="${defaultSettings.address[0]}" data-des="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconA.png"
											data-travel="WALKING">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" viewBox="0 0 51.76 51.76"
												style="enable-background:new 0 0 51.76 51.76;" xml:space="preserve">';
												<g>';
													<circle cx="15.39" cy="4.82" r="4.82" />';
													<path
														d="M45.689,46.201c-5.744-8.573-12.312-19.74-13.416-21.625c-0.1-0.342-0.232-0.689-0.414-1.038    c-1.312-2.557-2.684-5.085-4.084-7.596c1.484,0.116,2.972,0.231,4.455,0.346c1.02,2.01,2.035,4.021,3.053,6.03    c1.639,3.237,6.49,0.389,4.855-2.839c-1.312-2.593-2.867-8.425-6.254-8.688c-3.604-0.28-7.207-0.56-10.81-0.839    c-0.088-0.007-0.163,0.005-0.247,0.005c-2.724-0.729-5.917,1.193-6.495,3.97c-1.842,3.989-4.487,7.104-8.925,8.404    c-3.474,1.016-1.994,6.443,1.495,5.423c4.387-1.284,7.538-3.798,9.927-7.107c1.447,2.58,2.86,5.176,4.214,7.808    c-2.977,2.053-5.578,4.536-7.857,7.401c-0.636,0.799-0.745,1.621-0.531,2.344c-0.008,0.27,0.009,0.55,0.086,0.854    c0.877,3.472,1.753,6.938,2.631,10.406c0.931,3.696,6.782,2.646,5.843-1.074c-0.835-3.305-1.671-6.61-2.506-9.917    c2.094-2.469,4.563-4.617,7.384-6.221c0.664-0.378,1.082-0.899,1.314-1.473c3.859,5.914,7.719,14.096,11.576,19.055    C43.337,52.856,48.046,49.233,45.689,46.201z" />
													';
												</g>';
											</svg>';
										</div>';
									</div>';
								</div>';
							</div>';
						</div>';
						<!--LOCATION A-->
						<!--MID BUTTONS-->
						<div class="lmSmallButtons">';
							<div class="lmFindMore lmDirectionAandB" data-pos="${posLat},${posLng}" data-tpe="${i.types}"
								title="Find More Related Places Nearby"><span class="text">${data.config.lmNearbyRel}</span></div>';
							<div class="placeReturn lmDirectionAandB"><span class="text">Back</span></div>';
						</div>';
						<!--MID BUTTONS-->
						<!--LOCATION B-->
						<div class="lmLocfromA lmDirectionAandB lmB">';
							<div class="lmTextIcon">';
								<div class="lmTextIcon-T">Second location to meeting point</div>';
							</div>';
							<div class="lmButtonContainer">';
								<div class="lmButtonDirect">';
									<div class="lmTravelMode">';
										<div class="lmDriving lmTrMode" data-des="${defaultSettings.address[1]}" data-loca="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconB.png"
											data-travel="DRIVING">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" width="39.055px" height="39.054px" viewBox="0 0 39.055 39.054"
												style="enable-background:new 0 0 39.055 39.054;" xml:space="preserve">';
												<g>';
													<path
														d="M38.831,14.26c-0.191-0.233-0.476-0.369-0.775-0.369h-3.801c-0.938-2.474-2.16-4.898-3.549-5.813    c-4.805-3.161-17.55-3.161-22.355,0c-1.39,0.916-2.607,3.343-3.55,5.813H1c-0.302,0-0.586,0.136-0.775,0.369    c-0.19,0.232-0.266,0.539-0.204,0.834l0.563,2.728c0.096,0.465,0.506,0.797,0.979,0.797h1.126    c-1.087,1.254-1.614,2.833-1.621,4.413c-0.007,1.952,0.734,3.716,2.089,4.964c0.015,0.013,0.03,0.022,0.044,0.035v3.817    c0,0.827,0.672,1.5,1.5,1.5h3.506c0.828,0,1.5-0.673,1.5-1.5v-1.534h19.641v1.534c0,0.827,0.672,1.5,1.5,1.5h3.506    c0.826,0,1.5-0.673,1.5-1.5v-3.742c1.438-1.317,2.125-3.129,2.134-4.938c0.006-1.634-0.545-3.271-1.696-4.551h1.201    c0.475,0,0.885-0.332,0.979-0.798l0.564-2.727C39.094,14.799,39.021,14.494,38.831,14.26z M9.998,10.583    c3.83-2.521,15.229-2.521,19.057,0c0.744,0.488,1.701,2.461,2.578,4.877H7.422C8.297,13.045,9.254,11.073,9.998,10.583z     M5.512,23.408c0-1.63,1.322-2.95,2.951-2.95c1.631,0,2.951,1.32,2.951,2.95s-1.32,2.951-2.951,2.951    C6.834,26.359,5.512,25.038,5.512,23.408z M30.631,26.359c-1.629,0-2.951-1.321-2.951-2.951s1.322-2.95,2.951-2.95    c1.631,0,2.951,1.32,2.951,2.95S32.26,26.359,30.631,26.359z" />
													';
												</g>';
											</svg>';
										</div>';
										<div class="lmTransit lmTrMode" data-des="${defaultSettings.address[1]}" data-loca="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconB.png"
											data-travel="TRANSIT">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" width="582.675px" height="582.675px"
												viewBox="0 0 582.675 582.675" style="enable-background:new 0 0 582.675 582.675;"
												xml:space="preserve">';
												<g id="Layer_1_21_">';
													<path
														d="M518.288,545.7l-85.425-155.55c24.225-3.825,42.074-25.5,42.074-49.726v-229.5C474.937,49.725,425.212,0,364.012,0    h-145.35c-61.2,0-112.2,49.725-112.2,112.2v228.225c0,25.5,17.85,45.9,42.075,49.726L64.387,545.7    c-6.375,12.75-2.55,28.05,10.2,34.425c3.825,2.55,7.65,2.55,11.475,2.55c8.925,0,17.85-5.1,21.675-12.75l7.65-12.75h351.9    l7.649,12.75c5.101,8.925,12.75,12.75,21.676,12.75c3.824,0,7.649-1.274,11.475-2.55C520.837,573.75,524.663,558.45,518.288,545.7    z M398.437,430.95h-214.2l21.675-39.525h170.85L398.437,430.95z M394.613,345.525c-20.4,0-36.976-16.575-36.976-36.976    c0-20.4,16.575-36.975,36.976-36.975c20.399,0,36.975,16.575,36.975,36.975C431.587,327.675,415.012,345.525,394.613,345.525z     M151.087,126.225c0-39.525,31.875-71.4,70.125-71.4h138.975c38.25,0,71.4,31.875,71.4,71.4v61.2    c0,14.025-11.475,24.225-25.5,24.225h-229.5c-14.025,0-24.225-11.475-24.225-24.225L151.087,126.225L151.087,126.225z     M188.062,270.3c20.4,0,36.975,16.575,36.975,36.976c0,20.399-16.575,36.975-36.975,36.975s-36.975-16.575-36.975-36.975    C151.087,286.875,167.663,270.3,188.062,270.3z M135.788,518.925l28.05-49.725h255l28.05,49.725H135.788z" />
													';
												</g>';
											</svg>';
										</div>';
										<div class="lmWalking lmTrMode" data-des="${defaultSettings.address[1]}" data-loca="${setAdd}"
											data-direct="https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/iconB.png"
											data-travel="WALKING">';
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
												id="Capa_1" x="0px" y="0px" viewBox="0 0 51.76 51.76"
												style="enable-background:new 0 0 51.76 51.76;" xml:space="preserve">';
												<g>';
													<circle cx="15.39" cy="4.82" r="4.82" />';
													<path
														d="M45.689,46.201c-5.744-8.573-12.312-19.74-13.416-21.625c-0.1-0.342-0.232-0.689-0.414-1.038    c-1.312-2.557-2.684-5.085-4.084-7.596c1.484,0.116,2.972,0.231,4.455,0.346c1.02,2.01,2.035,4.021,3.053,6.03    c1.639,3.237,6.49,0.389,4.855-2.839c-1.312-2.593-2.867-8.425-6.254-8.688c-3.604-0.28-7.207-0.56-10.81-0.839    c-0.088-0.007-0.163,0.005-0.247,0.005c-2.724-0.729-5.917,1.193-6.495,3.97c-1.842,3.989-4.487,7.104-8.925,8.404    c-3.474,1.016-1.994,6.443,1.495,5.423c4.387-1.284,7.538-3.798,9.927-7.107c1.447,2.58,2.86,5.176,4.214,7.808    c-2.977,2.053-5.578,4.536-7.857,7.401c-0.636,0.799-0.745,1.621-0.531,2.344c-0.008,0.27,0.009,0.55,0.086,0.854    c0.877,3.472,1.753,6.938,2.631,10.406c0.931,3.696,6.782,2.646,5.843-1.074c-0.835-3.305-1.671-6.61-2.506-9.917    c2.094-2.469,4.563-4.617,7.384-6.221c0.664-0.378,1.082-0.899,1.314-1.473c3.859,5.914,7.719,14.096,11.576,19.055    C43.337,52.856,48.046,49.233,45.689,46.201z" />
													';
												</g>';
											</svg>';
										</div>';
									</div>';
								</div>';
							</div>';
						</div>';
						<!--LOCATION B-->
					</div>`;
					$(element).find(".lmDirection").append(appendDir);
					mark++;
					//locArray.push(pID);
					marker.addListener("click", function () {
						$(element).find(".lmDirectionAandBContainer").hide();
						var dataLat = this.position.lat();
						var dataLng = this.position.lng();
						$("." + pID).css("display", "flex");
						setLoc(pID, dataLat, dataLng, results);
					});
				} //if political
			} //if premise
		} //if locality
	});
	$(element)
		.find(".detailsContainer .placeContainer")
		.on("click", function () {
			$(element).find(".lmDirectionAandBContainer").hide();
			var upID = $(this).data("place");
			var dataLat = $(this).data("lat");
			var dataLng = $(this).data("lng");
			$("." + upID).css("display", "flex");
			setLoc(upID, dataLat, dataLng, results);
		});
}

// ADD MARKER IN THE CENTER ROUTE
function getCenterMap(centerCoord, getRad) {
	var halfway = {
		midpoint: {
			center: centerCoord,
			population: getRad,
		},
	};
	for (var city in halfway) {
		var cityCircle = new google.maps.Circle({
			strokeColor: "#FFFFFF",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#00A0AF",
			fillOpacity: 0.35,
			map: map,
			center: halfway[city].center,
			radius: getRad,
		});
	}
}

// CLICK .detailsContainer .placeContainer - getSpecific Location
function setLoc(upID, dataLat, dataLng, results) {
	var service = new google.maps.places.PlacesService(map);
	var locationDetails;
	service.getDetails(
		{
			placeId: upID,
		},
		function (place, status) {
			results.map(function (i) {
				place.place_id == i.place_id ? (locationDetails = i) : "";
			});
			var lmLocForAddress = place.formatted_address;
			var lmLocForphone = place.international_phone_number ? place.international_phone_number : place.formatted_phone_number ? place.formatted_phone_number : "N/A";
			var lmLocName = place.name;
			var lmLocOpeningHours = place.opening_hours;
			var lmLocPhotos = place.photos ? place.photos : "N/A";
			var lmLocReviews = place.reviews;
			var lmLocTypes = place.types[0];
			var lmLocUrl = place.url;
			var lmLocWebsite = place.website ? "<a href=" + place.website + " target='_blank'>View Website</a>" : "<a href='#'>N/A</a>";
			var lmLocRate = place.rating ? place.rating : "N/A";
			var output;
			//$(element).find('.detailsContainerMain').css({"overflow-y":"hidden"});
			$(element).find(".detailsContainer").hide();
			$(element).find(".lmLocationModal").fadeIn();
			output = "<div class='lmModalImageContainer'>";
			if (lmLocPhotos != "N/A") {
				lmLocPhotos.map(function (i) {
					output += "<div class='lmModalSlider' style='background-image:url(" + i.getUrl() + ")'>";
					output += "<img src='" + i.getUrl() + "' alt='" + lmLocName + "'>";
					output += "</div>";
				});
			} else {
				output += "<div class='lmModalSlider' style='background-image:url(https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg)'>";
				output += "<img src='https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg' alt='No Image Available'>";
				output += "</div>";
			}
			output += "</div>";
			output += "<div class='lmRating'>";
			output += "<div class='lmRating1'></div>";
			output += "<div class='lmRating2'>" + lmLocRate + "</div>";
			output += "</div>";
			output += "<div class='lmModalDetails'>";
			output += "<div class='lmModalNameRate'>";
			output += "<div class='lmModalName'>";
			output += "<i class='fa fa-1x fa-building'></i>";
			output += lmLocName;
			output += "</div>";
			output += "</div>";
			output += "<div class='lmModalAddress'>";
			output += "<i class='fa fa-1x fa-compass'></i>";
			output += "<a href='" + lmLocUrl + "' target='_blank'>" + lmLocForAddress + "</a>";
			output += "</div>";
			output += "<div class='lmModalPhone'>";
			output += "<i class='fa fa-1x fa-phone'></i>";
			output += "<a href=tel:" + lmLocForphone.split(" ").join("-") + ">" + lmLocForphone + "</a>";
			output += "</div>";
			output += "<div class='lmModalWebsite'>";
			output += "<i class='fa fa-1x fa-globe'></i>";
			output += lmLocWebsite;
			output += "</div>";
			if (lmLocReviews) {
				output += "<h4 class='lmModalReviewTitle'>MOST USEFUL REVIEWS</h4>";
				output += "<div class='lmModalReviews'>";
				lmLocReviews.map(function (i) {
					var rte = i.rating.toFixed();
					output += "<div class='lmModalReviewContainer'>";
					output += "<div class='lmModalReviewProfileDetails'>";
					output += "<div class='lmModalReviewProfile'>";
					output += "<img src='" + i.profile_photo_url + "'>";
					output += "</div>";
					output += "<div class='lmModalReviewProfileTime'>";
					output += "<h3 class='lmModalReviewDetails'>" + i.author_name + "</h3>";
					output += "<div class='lmModalTime'>";
					output += "<div class='lmModalRates'>";
					output += "<img src='https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/star" + rte + ".png'>";
					output += "</div>";
					output += i.relative_time_description;
					output += "</div>";
					output += "</div>";
					output += "</div>";
					output += "<div class='lmModalText'>" + i.text + "</div>";
					output += "</div>";
				}); //lmLocReview Map
				output += "</div>";
			}
			output += "</div>";
			$(element).find(".lmLocationModal").html(output);
			if ($(".lmModalImageContainer img").length > 1) {
				$(".lmModalImageContainer").slick({
					dots: true,
					arrows: false,
					prevArrow: "<i class='fa fa-angle-left fa-2x arrLeft'></i>",
					nextArrow: "<i class='fa fa-angle-right fa-2x arrRight'></i>",
					infinite: true,
					adaptiveHeight: true,
					speed: 500,
					autoPlay: true,
				});
			}

			$(element)
				.find(".placeReturn")
				.on("click", function () {
					$(element).find(".detailsContainer").fadeIn();
					$(element).find(".lmLocationModal").hide();
					initMap();
				});

			var infOutput = "<div  class='lmLocOpening'>";
			infOutput += "<div class='lmLocBname lmModalName'>";
			//infOutput += "<i class='fa fa-1xB fa-building'></i>";
			infOutput += "<div class='lmImage'><img src='" + place.icon + "'></div>";
			infOutput += lmLocName;
			infOutput += "</div>";
			infOutput += "<h4 class='lmModalBHours'>BUSINESS HOURS</h4>";
			if (place.opening_hours) {
				lmLocOpeningHours.weekday_text.map(function (a) {
					var day = a.split(/\s(.+)/)[0];
					var time = a.split(/\s(.+)/)[1];
					infOutput += "<div class='lmLocWeek'>";
					infOutput += "<div class='lmLocDays lmLocDayLabel'>" + day + "</div>";
					infOutput += "<div class='lmLocDays lmLocDayHours'>" + time + "</div>";
					infOutput += "</div>";
				});
			} else {
				infOutput += "No specified business hours.";
			}
			infOutput += "</div>";
			var infowindow = new google.maps.InfoWindow({
				content: infOutput,
				maxWidth: 400,
				position: new google.maps.LatLng(parseFloat(dataLat), parseFloat(dataLng)),
				pixelOffset: new google.maps.Size(0, -50),
			});
			infowindow.close();

			window.INSITE.device != "mobile" ? infowindow.open(map) : infowindow.close();
		}
	);
	map.panTo(new google.maps.LatLng(parseFloat(dataLat), parseFloat(dataLng)));
	map.setZoom(18);
	//getCenterMap(centerCoord,getRad);
}
// GET IMAGES
function getPhoto(place) {
	var retPhoto = !place.photos
		? "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
		: place.photos[0].getUrl({
				maxWidth: 1920,
		  });
	return retPhoto;
}

// GET NEARBY STORE
function getNearbyStores(service, map, posL, typ, defaultSettings) {
	var subType = [
		"administrative_area_level_1",
		"administrative_area_level_2",
		"administrative_area_level_3",
		"administrative_area_level_4",
		"administrative_area_level_5",
		"colloquial_area",
		"country",
		"establishment",
		"finance",
		"floor",
		"food",
		"general_contractor",
		"geocode",
		"health",
		"intersection",
		"locality",
		"natural_feature",
		"neighborhood",
		"place_of_worship",
		"political",
		"point_of_interest",
		"post_box",
		"postal_code",
		"postal_code_prefix",
		"postal_code_suffix",
		"postal_town",
		"premise",
		"room",
		"route",
		"street_address",
		"street_number",
		"sublocality",
		"sublocality_level_4",
		"sublocality_level_5",
		"sublocality_level_3",
		"sublocality_level_2",
		"sublocality_level_1",
		"subpremise",
	];
	var gType = typ.split(",");
	var fType = subType.includes(gType[0]) ? gType[1] : gType[0];
	var newLtLn = posL.split(",");
	var bounds = new google.maps.LatLngBounds();
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 14,
		center: {
			lat: parseFloat(newLtLn[0]),
			lng: parseFloat(newLtLn[1]),
		},
		mapTypeId: "roadmap",
	});
	var marker = new google.maps.Marker({
		map: map,
		position: {
			lat: parseFloat(newLtLn[0]),
			lng: parseFloat(newLtLn[1]),
		},
		animation: google.maps.Animation.DROP,
	});
	var request = {
		location: new google.maps.LatLng(parseFloat(newLtLn[0]), parseFloat(newLtLn[1])),
		radius: 1609.34,
		type: [fType],
	};
	//var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, function placeStoreMarker(results, status) {
		var mark = 1;
		results.map(function (i) {
			var posLat = i.geometry.location.lat();
			var posLng = i.geometry.location.lng();
			if (!i.types.includes("locality")) {
				if (!i.types.includes("premise")) {
					console.log(i.types);
					var moreMarker = new google.maps.Marker({
						map: map,
						position: new google.maps.LatLng(posLat, posLng),
						icon: {
							url: "https://irt-cdn.multiscreensite.com/2b211955d3454388bf5c9a8c22376cd5/dms3rep/multi/mobile/icon" + mark + ".png",
							scaledSize: new google.maps.Size(40, 40), // scaled size
						},
						animation: google.maps.Animation.DROP,
					});
					getRes(results, defaultSettings);
					bounds.extend(moreMarker.position);
					map.fitBounds(bounds);
				}
			}
			mark++;
		}); //results map
	});
}

function cb() {
	console.log("init");
}
