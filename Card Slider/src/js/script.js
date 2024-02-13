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
			name: "Aleck Anderson",
			title: "Volunteer",
			image: "https://labartisan.net/demo/template/lonelypro/lonelypro/assets/images/volunteer/12.jpg",
			email: "aleck@lingows.com",
			facebook: "https://www.facebook.com/aleck",
			twitter: "https://www.twitter.com/aleck",
			instagram: "",
			profile: "",
			linkedin: ""
		}, {
			name: "Howard Lewis",
			title: "Volunteer",
			image: "https://labartisan.net/demo/template/lonelypro/lonelypro/assets/images/volunteer/12.jpg",
			email: "howard@lingows.com",
			facebook: "https://www.facebook.com/howard",
			twitter: "https://www.twitter.com/howard",
			instagram: "https://www.instagram.com/howard",
			profile: "https://www.sample.com/howard",
			linkedin: "https://www.linkedin.com/howard"
		}, {
			name: "Jeric Silva",
			title: "Volunteer",
			image: "https://labartisan.net/demo/template/lonelypro/lonelypro/assets/images/volunteer/12.jpg",
			email: "jeric@lingows.com",
			facebook: "https://www.facebook.com/jeric",
			twitter: "https://www.twitter.com/jeric",
			instagram: "https://www.instagram.com/jeric",
			profile: "https://www.sample.com/jeric",
			linkedin: "https://www.linkedin.com/jeric"
		}],
		buttonText: "See Profile"
	}
};

let list = data.config.list;
let buttonText = data.config.buttonText;


// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js", function () {
		dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.6.0/pagination.min.js", function () {
			let responseData = new Collection(list).data();
			let card_structure = new Create(responseData).card();
			$(element).find(".cardSlider-Panel-Cards").html(card_structure).slick({
				infinite: true,
				slidesToShow: 2,
				slidesToScroll: 1,
				draggable: true,
				arrows: false
			});

			$(element).find(".cardSlider-Arrows-Prev").click(function () {
				$(element).find(".cardSlider-Panel-Cards").slick("slickPrev");
			})
			$(element).find(".cardSlider-Arrows-Next").click(function () {
				$(element).find(".cardSlider-Panel-Cards").slick("slickNext");
			});

			$(element).on("click touchstart", ".cardSlider-Icon-Plus", function () {
				$(this).parents(".cardSlider-Socials-Icon").find(".cardSlider-Icon-More").toggleClass("cardSlider-Icon-More-Active");
				$(this).find("i").toggleClass("fa-plus fa-minus");
			});

			$(element).on("mouseleave touchend", ".cardSlider-Icon-More", function () {
				$(this).parents(".cardSlider-Item-Socials").find(".cardSlider-Icon-More").removeClass("cardSlider-Icon-More-Active");
				$(this).parents(".cardSlider-Item-Socials").find(".cardSlider-Icon-Plus i").toggleClass("fa-plus fa-minus");
			});
		});
	});
});

function Create(obj) {
	let $this = this;
	this.card = function () {
		return obj.map(i => {
			let em = i.email ? `<a href="mailto:${i.email}" class="cardSlider-Icon-Email">
				<i class="fa-regular fa-envelope"></i>
			</a>` : "";
			let fb = i.facebook ? `<a href="${i.facebook}" class="cardSlider-Icon-Facebook">
				<i class="fa-brands fa-facebook-f"></i>
			</a>` : "";
			let tw = i.twitter ? `<a href="${i.twitter}" class="cardSlider-Icon-Twitter">
				<i class="fa-brands fa-twitter"></i>
			</a>` : "";
			let ig = i.instagram ? `<a href="${i.instagram}" class="cardSlider-Icon-Instagram">
				<i class="fa-brands fa-instagram"></i>
			</a>` : "";
			let li = i.linkedin ? `<a href="${i.linkedin}" class="cardSlider-Icon-Linkedin">
				<i class="fa-brands fa-linkedin"></i>
			</a>` : "";
			

			let socials = [];
			em ? socials.push(em) : "";
			fb ? socials.push(fb) : "";
			tw ? socials.push(tw) : "";
			ig ? socials.push(ig) : "";
			li ? socials.push(li) : "";

			let socialCount = socials.length > 4 ? socials.filter((k, index) => index < 3) : socials;
			let socialPlus = socials.length > 4 ? `<a class="cardSlider-Icon-Plus"><i class="fa-solid fa-plus"></i></a>` : "";
			let socialLinks = socialCount.map(j => j).join("") + socialPlus;
			let socialMore = socials.map(m => m).join("");
			let itemLink = i.profile;

			return `<div class="cardSlider-Cards-Item">
				<div class="cardSlider-Item-Image">
					<img src="${i.image}" alt="${i.name} - Profile Image">
				</div>
				<div class="cardSlider-Item-Name">${i.name}</div>
				<div class="cardSlider-Item-Subname">${i.title}</div>
				<div class="cardSlider-Item-Border"></div>
				<div class="cardSlider-Item-Socials">
					<div class="cardSlider-Socials-Icon">
						${socialLinks}
						<div class="cardSlider-Icon-More">
							${socialMore}
						</div>
					</div>
					<a href="${itemLink}" class="cardSlider-Socials-Profile">
						<span class="text">${buttonText}</span>
					</a>
				</div>
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