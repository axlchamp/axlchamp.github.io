const dmAPI = {
	runOnReady: (functionName, callback) => functionName ? callback() : console.error("Please Enter Function Name!"),
	loadScript: (url, callback) => {
		const script = document.createElement("script");
		script.src = url;
		const firstScript = document.getElementsByTagName("script")[0];
		firstScript.parentNode.insertBefore(script, firstScript);
		script.onload = callback;
	}
};

let element = $('.widget-abc123');
let data = {
	device: "desktop",
	config: {
		list: [{
			street: "Level 1/48-50 Smith Street Mall",
			city: "Darwin",
			state: "NT",
			postal: "8000"
		}, {
			street: "217-225 Flinders Street",
			city: "Adelaide",
			state: "SA",
			postal: "5000"
		}, {
			street: "37 Clifton St",
			city: "Perth",
			state: "WA",
			postal: "6000"
		}, {
			street: "118 Olinda - Monbulk Road",
			city: "Melbourne",
			state: "VIC",
			postal: "3788"
		}]
	}
};

let list = data.config.list;
let city_list = {};

// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js", function () {
		let location_list = new Collection(list).data();
		city_list.list = location_list;

	});
});

$(element).on("mouseenter touchstart", ".svgAus-Pin-City", function (event) {
	let city = $(this).attr("data-city");
	let filters = {
		city
	};
	let filtered = multiFilter(city_list.list, filters);
	let content_window = new Create(filtered).infowindow();
	$(element).find('.svgAus-Tool-Container').html(content_window);
	let infowindow_height = $(element).find(".svgAus-Container-Infowindow").height() + 30;

	let left = $(this).offset().left - 105;
	let top = $(this).offset().top - infowindow_height;
	if (data.device == "desktop") {
		$(element).find('.svgAus-Tool-Container').css({
			top: top,
			left: left,
			opacity: 1
		});
	} else {
		$(element).find('.svgAus-Tool-Container').css({
			opacity: 1
		});
	}
})
$(element).on("mouseleave touchend", function () {
	$(element).find('.svgAus-Tool-Container').css({
		opacity: 0
	});
});


function Create(obj) {
	let $this = this;
	this.infowindow = function () {
		return obj.map(i => {
			return `<div class="svgAus-Container-Infowindow">
				<div class="svgAus-Infowindow-Title">${i.city}</div>
				<div class="svgAus-Infowindow-street">${i.street}</div>
				<div class="svgAus-Infowindow-city">${i.city}</div>
				<div class="svgAus-Infowindow-stateZip">${i.state}, ${i.postal}</div>
			</div>`;
		}).join("");
	}

}

// COLLECTION FOR WIDGET LIST
function Collection(collection) {
	this.data = () => {
		return collection.map(i => {
			let item = {};
			Object.keys(i).filter(j => {
				if (i.inNavigation) return j;
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

function multiFilter(obj, filters) {
	const filterKeys = Object.keys(filters);
	return obj.filter(function (eachObj) {
		return filterKeys.every(function (eachKey) {
			if (!filters[eachKey].length) {
				return true; // passing an empty filter means that filter is ignored.
			}
			return filters[eachKey] == eachObj[eachKey];
		});
	});
}
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.css', 'slickSliderCSs');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.css', 'slickSliderCSsThemes');
css_resource('https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css', 'bs5CSS');
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