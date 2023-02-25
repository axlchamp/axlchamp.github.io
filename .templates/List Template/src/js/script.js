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
		list: [{
				title: "HOME",
				alias: "home",
				path: "/",
				inNavigation: false,
				subNav: []
			},
			{
				title: "SERVICES",
				alias: "services",
				path: "/services",
				inNavigation: true,
				subNav: ['Inner Page 1', 'Inner Page 2', 'Inner Page 3']
			},
			{
				title: "TEAM",
				alias: "team",
				path: "/team",
				inNavigation: true,
				subNav: []
			},
			{
				title: "PRODUCTS",
				alias: "products",
				path: "/products",
				inNavigation: true,
				subNav: []
			},
			{
				title: "GALLERY",
				alias: "gallery",
				path: "/gallery",
				inNavigation: true,
				subNav: []
			},
			{
				title: "CONTACT",
				alias: "contact",
				path: "/contact",
				inNavigation: true,
				subNav: []
			}
		]
	}
};

let list = data.config.list;
let collect = new Collection();

// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	let responseData = collect.data(list);
	console.log(responseData);
});


// COLLECTION FOR WIDGET LIST
function Collection() {
	this.data = (collection) => {
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

css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css', 'slickSliderCSs');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css', 'slickSliderCSsThemes');
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
