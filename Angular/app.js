let locations = {};
let sheetDetails = {
	apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c", // Replace with your API key
	sheetid: "1FSk-2bdlxFNonf92utCyIHv0TYTiearV2NoH3QcWmk0", // Replace with your Spreadsheet ID
	sheetname: "Sheet1", // Define the range
};
let random_id = Math.floor(Math.random(99999) * 99999);
let googleId = `map_${random_id}`;

const list = angular.module("propertyList", []);
list.controller("propertySearch", function ($scope, $http) {
	$scope.mapid = googleId;
	$http.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`).then(function (response) {
		let propertyData = new Collection(response.data).response();
		$scope.properties = propertyData;
		$scope.propertyTypes = [...new Set(propertyData.map((p) => p.property_type))];
		locations.list = propertyData;
		// Initialize filters
		$scope.searchQuery = "";

		$scope.changeSelected = function (property) {
			// Update selected property
			$scope.selectedProperty = property;

			// Reinitialize the map with the filtered data
			initMap($scope.properties.filter($scope.combinedFilter), $scope);
		};

		$scope.combinedFilter = function (property) {
			// Filter properties based on selected type and search query
			const matchesType = !$scope.selectedProperty || property.property_type === $scope.selectedProperty;
			const matchesSearch = !$scope.searchQuery || property.name.toLowerCase().includes($scope.searchQuery.toLowerCase());
			return matchesType && matchesSearch;
		};

		// Watch for changes in searchQuery
		$scope.$watch("searchQuery", function () {
			// Reinitialize the map with the filtered data
			initMap($scope.properties.filter($scope.combinedFilter), $scope);
		});

		// Initialize the map with all properties initially
		initMap($scope.properties, $scope);
	});
});
function mapStart() {
	console.info("Initializing Map...");
}

function initMap(obj, $scope) {
	let defaultZoom = 8;
	let markerSize = 24;
	let markerEvent = true;
	let trigger = "click";
	let isShowName = true;
	let isShowAddress = true;
	let isShowButton = true;
	let newTab = "_blank";
	let buttonText = "View Property";
	let bounds = new google.maps.LatLngBounds();
	let infowindow = new google.maps.InfoWindow();
	let markers = [];

	map = new google.maps.Map(document.getElementById(googleId), {
		center: { lat: 37.7749, lng: -122.4194 },
		zoom: defaultZoom,
	});

	obj.map((i, index) => {
		let icon = {
			url: i.markericon,
			scaledSize: new google.maps.Size(markerSize, markerSize),
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
			google.maps.event.addListener(
				marker,
				trigger,
				(marker,
				(j) => {
					let name = isShowName ? `<div class="googlemap-InfoWindow-Name"><span>${i.name}</span></div>` : "";
					let address = isShowAddress ? `<div class="googlemap-InfoWindow-Address"><span>${i.location}</span></div>` : "";
					let button = isShowButton ? `<div class="googlemap-InfoWindow-Button"><a class="googlemap-Button-Link" href="${i.link}" target="${newTab}">${buttonText}</a></div>` : "";
					let form = `<div class="googleMap-Container-InfoWindow">
						${name}
						${address}
						${button}
					</div>`;

					// $(element).on(trigger, ".googleMap-Locations-Sidebar", function () {
					// 	let markerIndex = $(this).attr("data-index");
					// 	if (marker.id == markerIndex) {
					// 		google.maps.event.trigger(marker, trigger);
					// 		map.setCenter({
					// 			lat: marker.getPosition().lat(),
					// 			lng: marker.getPosition().lng(),
					// 		});
					// 		map.setZoom(12);
					// 		// let circle = new Create().circle(map);
					// 		// circle.bindTo('center', marker, 'position');
					// 	}
					// });

					return function () {
						// $(element).find(`.googleMap-Locations-Sidebar`).removeClass("googleMap-Sidebar-Selected");
						// $(element).find(`.googleMap-Locations-Sidebar[data-name="${i.name}"]`).addClass("googleMap-Sidebar-Selected");
						infowindow.setContent(form);
						infowindow.open(map, marker);
					};
				})(marker, i)
			);
		}
	});
	// Listen to the 'bounds_changed' event of the map object
	google.maps.event.addListener(map, "bounds_changed", function () {});
}

function Collection(obj) {
	this.response = function () {
		let header = obj.values[0];
		let values = obj.values.filter((i, index) => index !== 0);
		return values.map((i) => {
			let items = {};
			header.map((k, index) => {
				items[removeSpecial(k.toLowerCase())] = k == "Price" ? parseFloat(i[index].replace(/,/g, "")) : i[index];
				items.keyword = i
					.map((k) => (i[k] ? (i[k].includes("http") ? null : i[k].trim()) : null))
					.join(" ")
					.replace(/\s+/g, " ")
					.trim();
			});
			return items;
		});
	};

	function removeSpecial(str) {
		let pattern = str.replace(/[^A-Z0-9]/gi, `_`);
		return pattern;
	}
}
