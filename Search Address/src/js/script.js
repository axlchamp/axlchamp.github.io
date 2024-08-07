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
	config: {
		list: [{
			"ICP": "",
			"Street No.": "Unit 1/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Outage"
		}, {
			"ICP": "",
			"Street No.": "Unit 2/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 3/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 4/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 101/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 102/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 103/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 104/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 105/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 106/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 107/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 108/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 109/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 110/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 111/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 112/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 201/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 202/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 203/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 204/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 205/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 206/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 207/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 208/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 209/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 210/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 211/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 212/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 301/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 302/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 303/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 304/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 305/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 306/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 307/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 308/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 309/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 310/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 311/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 312/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 401/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 402/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 403/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 404/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 405/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 406/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 407/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 408/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 409/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 410/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 411/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 412/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 501/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 502/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 503/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 504/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}, {
			"ICP": "",
			"Street No.": "Unit 505/32",
			"Street Name": "Anzac Road",
			"Suburb": "Browns Bay",
			"City": "Auckland",
			"Post Code": "0630",
			"Lot No.": "",
			"Stage": "",
			"Network Status": "Good"
		}]
	}
};

let list = data.config.list;
let searched_data = {}


// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js", function () {
		dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.6.0/pagination.min.js", function () {
			let responseData = new Collection(list).data();
			searched_data.all = responseData;

			let dropdown_structure = new Create(responseData).dropdown();
			$(element).find(".saw-Options-Value").html(dropdown_structure);
		});
	});
});

$(element).find(".saw-Container-Dropdown").keyup(function (e) {
	let search_value = $(this).val();
	searched_data.searched_value = search_value;

	let location_data = search_value.length > 5 ? new Create(searched_data.all).search_location(search_value) : searched_data.all;
	let dropdown_structure = new Create(location_data).dropdown();
	$(element).find(".saw-Options-Value").html(dropdown_structure);

	$(element).find(".saw-Dropdown-Options").removeClass("show-Options");
	$(this).parent().find(".saw-Dropdown-Options").addClass("show-Options");
});

$(element).find('.saw-Container-Dropdown').click(function () {
	$(element).find(".saw-Dropdown-Options").removeClass("show-Options");
	$(this).parent().find(".saw-Dropdown-Options").addClass("show-Options");
})

$(element).find(".saw-Category-Container").mouseleave(function () {
	$(element).find(".saw-Dropdown-Options").removeClass("show-Options");
});



$(element).find('.saw-Category-Container').on("click", '.saw-Value-Item', function () {
	let parent_container = $(this).parents('.saw-Category-Container').attr("data-key");
	let value = $(this).text();
	$(element).find(`.saw-Category-Container[data-key=${parent_container}] .saw-Container-Dropdown`).val(value);
	$(element).find(".saw-Dropdown-Options").removeClass("show-Options");

	searched_data[parent_container] = value;
	let searched_value = new Create(searched_data.all).validate(value);
	let st = searched_value[0].networkstatus;
	$(element).find(".saw-Dropdown-Result").html(`${st == "Good" ? `<div class="saw-Result-Value">No issues on network</div>`:`<div class="saw-Result-Value">Outage - Planned Maintenance Underway, expected resolution 10 August 2024</div>`}`)

});


function Create(obj) {
	let $this = this;
	this.validate = function (value) {
		return obj.filter(i => `${i.streetno}, ${i.streetname}, ${i.city}, ${i.postcode}` == value);
	}
	this.search_location = function (val) {
		return obj.filter(i => val ? i.streetno.toLowerCase().includes(searched_data.searched_value.toLowerCase()) : i);
	}
	this.dropdown = function () {
		return obj.map(i => {
			return `<div class="saw-Value-Item">${i.streetno}, ${i.streetname}, ${i.city}, ${i.postcode}</div>`;
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
			item.keyword = Object.keys(i).map(k => i[k].toLowerCase()).join(',');
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

css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.css', 'slickSliderCSs');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.css', 'slickSliderCSsThemes');
css_resource('https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css', 'bs5CSS');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'fasrc');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.6.0/pagination.min.css', 'paginationCSS');

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