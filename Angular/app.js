const list = angular.module("propertyList", []);
list.controller("propertySearch", function ($scope, $http) {
	$http.get("app.php").then(function (response) {
		console.log(response);
		$scope.properties = response.data.slice(1);
		$scope.propertyTypes = [...new Set($scope.properties.map((p) => p.property_type))];

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

function CustomFilter(obj) {
	this.removeDuplicate = function () {
		return obj.filter((value, index, self) => index === self.findIndex((t) => t.property_type === value.property_type));
	};
}
