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
			logo: "https://ebslon.com/static/media/logo.7c0796c57daf5a0334b0.png",
			companyname: "Ebslon Infotech",
			overview: "Lorem Ipsum is simply dummy text.",
			city: "Hyderabad",
			state: "Telangana",
			country: "US",
			featured: "true",
			year: "2019",
			companysize: "50-100",
			rate: "$25 - $49",
			services: "App Development, Digital Marketing, Software Development",
			portfolio: "/"
		}, {
			logo: "https://ebslon.com/static/media/logo.7c0796c57daf5a0334b0.png",
			companyname: "Ebslon Infotech",
			overview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
			city: "Hyderabad",
			state: "Telangana",
			country: "US",
			featured: "true",
			year: "2019",
			companysize: "50-100",
			rate: "$25 - $49",
			services: "App Development, Digital Marketing, Software Development, SEO",
			portfolio: "/"
		}, {
			logo: "https://ebslon.com/static/media/logo.7c0796c57daf5a0334b0.png",
			companyname: "Ebslon Infotech",
			overview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
			city: "Delhi",
			state: "Delhi",
			country: "India",
			featured: "true",
			year: "2019",
			companysize: "50-100",
			rate: "$25 - $49",
			services: "App Development, Digital Marketing, Software Development, SEO",
			portfolio: "/"
		}]
	}
};

let list = data.config.list;
let searches = {};

// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js", function () {
		let data_list = new Collection(list).data();
		searches.all = data_list;
		// Locations Filter
		let location_options = new Create(data_list).dropdown("location");
		$(element).find(".madWidget-Dropdown-Wrapper[data-key='location'] .madWidget-Options-Value").html(location_options);
		// Services Filter
		let services_options = new Create(data_list).dropdown("services");
		$(element).find(".madWidget-Dropdown-Wrapper[data-key='services'] .madWidget-Options-Value").html(services_options);

		// Create List
		let item_structure = new Create(data_list).structure();
		$(element).find(".madWidget-Result-Company").html(item_structure);
	});
});

// Dropdown Click
$(element).find(".madWidget-Dropdown-Wrapper").click(function () {
	$(element).find('.madWidget-Dropdown-Options').removeClass("show-Options")
	$(this).find('.madWidget-Dropdown-Options').addClass("show-Options")
}).mouseleave(function () {
	$(element).find('.madWidget-Dropdown-Options').removeClass("show-Options")
});

// Dropdown Item Click
$(element).on("click", ".madWidget-Value-Item", function () {
	let value = $(this).text();
	let filter_for = $(this).parents(".madWidget-Dropdown-Wrapper").attr("data-key");
	searches[filter_for] = value;
	$(element).find(`.madWidget-Dropdown-Wrapper[data-key='${filter_for}'] .madWidget-Dropdown-Text`).text(value);
	$(element).find('.madWidget-Dropdown-Options').removeClass("show-Options");

	let searched_list = new Search(searches.all).items();
	console.log(searched_list)
	let item_structure = new Create(searched_list).structure();
	$(element).find(".madWidget-Result-Company").html(item_structure);
});

// Read More Button
// $(element).on("click", ".madWidget-Text-Button", function () {
// 	let text = $(this).find(".madWidget-Button-Show").text() == "Read More";
// 	if (text) {
// 		$(this).parents('.madWidget-Description-Text').addClass("madWidget-Description-Text-Active");
// 		$(this).find(".madWidget-Button-Show").text("Read Less");
// 		$(this).find(".madWidget-Button-Ellipsis").text("");
// 	} else {
// 		$(this).parents('.madWidget-Description-Text').removeClass("madWidget-Description-Text-Active");
// 		$(this).find(".madWidget-Button-Show").text("Read More");
// 		$(this).find(".madWidget-Button-Ellipsis").text("...");
// 	}
// });

// Services Open
$(element).on("click", ".madWidget-Services-More", function () {
	$(this).parents(".madWidget-Services-Wrapper").find(".madWidget-Services-ServiceList").addClass("madWidget-Services-ServiceList-Active");
});
$(element).on("click", ".madWidget-Close", function () {
	$(this).parents(".madWidget-Services-Wrapper").find(".madWidget-Services-ServiceList").removeClass("madWidget-Services-ServiceList-Active");
});

function Search(obj) {
	let $this = this;
	this.items = function () {
		let filters = {
			location: searches.location ? searches.location : "",
			services: searches.services ? searches.services : ""
		}
		console.log(filters)
		return multiFilter(obj, filters);
	};

	function multiFilter(obj, filters) {
		const filterKeys = Object.keys(filters);
		return obj.filter(function (eachObj) {
			return filterKeys.every(function (eachKey) {
				if (!filters[eachKey].length) {
					return true; // passing an empty filter means that filter is ignored.
				}
				return eachObj[eachKey].includes(filters[eachKey]);
			});
		});
	}
}

function Create(obj) {
	let $this = this;
	this.structure = function () {
		return obj.map(i => {
			return `<div class="madWidget-Company-Details">
				<div class="madWidget-Details-Panel">
					<div class="madWidget-Details-Image">
						<img src="${i.logo}" alt="${i.companyname}">
					</div>
					<div class="madWidget-Details-Name">
						<span>${i.companyname}</span>
						<i class="fa-solid fa-shield"></i>
					</div>
					<div class="madWidget-Details-Description">
						<div class="madWidget-Description-Text">${i.overview}<p class="madWidget-Text-Button"><span class="madWidget-Button-Ellipsis">...</span><span class="madWidget-Button-Show">Read More</span></p></div>
					</div>
					<div class="madWidget-Details-Info">
						<div class="madWidget-Info-Panel">
							<div class="madWidget-Panel-Wrapper">
								<div class="madWidget-Wrapper-Icon">
									<i class="fa-solid fa-location-dot"></i>
								</div>
								<div class="madWidget-Wrapper-Text">${i.city} ${i.country ? ", " + i.country : ""}</div>
							</div>
							<div class="madWidget-Panel-Wrapper">
								<div class="madWidget-Wrapper-Icon">
									<i class="fa-solid fa-calendar-days"></i>
								</div>
								<div class="madWidget-Wrapper-Text">${i.year ? i.year : "-"}</div>
							</div>
						</div>
						<div class="madWidget-Info-Panel">
							<div class="madWidget-Panel-Wrapper">
								<div class="madWidget-Wrapper-Icon">
									<i class="fa-solid fa-user-group"></i>
								</div>
								<div class="madWidget-Wrapper-Text">${i.companysize}</div>
							</div>
							<div class="madWidget-Panel-Wrapper">
								<div class="madWidget-Wrapper-Icon">
									<i class="fa-solid fa-clock"></i>
								</div>
								<div class="madWidget-Wrapper-Text">${i.rate}</div>
							</div>
						</div>
					</div>
				</div>
				<hr class="madWidget-Details-Divider">
				</hr>
				<div class="madWidget-Details-Panel">
					<div class="madWidget-Details-Title">Services Type:</div>
					<div class="madWidget-Services-Wrapper">
						<div class="madWidget-Details-Services">
							${i.services.split(",").length > 3 ? $this.services(i.services) + `<div class="madWidget-Services-Item madWidget-Services-More">+ See More</div>`:$this.services(i.services)}
						</div>
						<div class="madWidget-Services-ServiceList">
							<i class="fa-solid fa-xmark madWidget-Close"></i>
							${$this.services_full(i.services)}
						</div>
					</div>
					<div class="madWidget-Details-Buttons">
						<a href="#" class="madwidget-Button-Quote">
							<span class="text">Get A Quote</span>
							<i class="fa-solid fa-caret-right"></i>
						</a>
						<a href="#" class="madwidget-Button-Portfolio">
							<span class="text">View Portfolio</span>
							<i class="fa-regular fa-eye"></i>
						</a>
					</div>
				</div>
			</div>`;
		});
	};
	this.services = function (str) {
		let services_list = str.split(",").filter((i, index) => index < 3);
		return services_list.map(i => {
			return `<div class="madWidget-Services-Item">${i}</div>`;
		}).join("");
	};
	this.services_full = function (str) {
		return str.split(",").map(i => {
			return `<div class="madWidget-Services-Item">${i}</div>`;
		}).join("");
	};
	this.dropdown = function (key) {
		if (key == "services") {
			let unique_services = obj.map(i => i.services.split(',')).flat();
			var uniqueItems = Array.from(new Set(unique_services));
			return uniqueItems.map(i => {
				return `<div class="madWidget-Value-Item">${i}</div>`;
			}).join("");
		}
		return removeDuplicates(obj, "location").map(i => {
			return `<div class="madWidget-Value-Item">${i[key]}</div>`;
		}).join("");
	}

	function removeDuplicates(array, key) {
		return array.reduce(function (arr, item) {
			const removed = arr.filter(function (i) {
				return i[key] !== item[key];
			});
			return [...removed, item];
		}, []);
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
			item.location = i.city + ", " + i.country;
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