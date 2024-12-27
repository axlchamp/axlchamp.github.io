const list = angular.module("propertyList", []);
list.controller("propertySearch", function ($scope, $http) {
	let sheetDetails = {
		apikey: "AIzaSyAmbSeWrN0FsC8uCXxYBFlsW4zpa5T8B7c", // Replace with your API key
		sheetid: "1FSk-2bdlxFNonf92utCyIHv0TYTiearV2NoH3QcWmk0", // Replace with your Spreadsheet ID
		sheetname: "Sheet1", // Define the range
	};

	$http.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`).then(function (response) {
		let propertyData = new Collection(response.data).response();
		$scope.properties = propertyData;
		$scope.propertyTypes = [...new Set(propertyData.map((p) => p.property_type))];
		console.log($scope.properties);
		// Initialize filters
		$scope.searchQuery = "";

		// Change the selected property type
		$scope.changeSelected = function (property) {
			$scope.selectedProperty = property;
		};

		// Filter function to match the selected property type
		$scope.propertyFilter = function (property) {
			return !$scope.selectedProperty || property.property_type === $scope.selectedProperty;
		};
	});
});

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
