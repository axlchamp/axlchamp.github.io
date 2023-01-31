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
//https://vid.cdn-website.com/0967fed6/videos/TKHNcNaLRAiv5Xn48zKZ_IMG_3300+2-v.mp4
let element = $('.widget-abc123');
let data = {
	device: "mobile",
	config: {
		items: [{
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Speedloader7.jpeg',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Speedloader4_1.png',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Speedloader4.png',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Speedloader5.jpeg',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Photo3.png',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Screen+Shot+2022-05-26+at+8.05.02+AM.png',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Screen+Shot+2022-06-05+at+3.23.24+PM.png',
			alt: '',
			type: 'image'
		}, {
			image: 'https://irp.cdn-website.com/0967fed6/dms3rep/multi/Speedloader2.jpeg',
			alt: '',
			type: 'image'
		}],
		zoom_trigger: "mouseover", // mouseover || grab || click || toggle
		zoom_panel: false
	}
};

// WIDGET VARIABLES
let list = data.config.items;
let zoom_trigger = data.config.zoom_trigger;
let zoom_panel = data.config.zoom_panel;
let device = data.config.device;

dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', function () {
		dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-zoom/1.7.21/jquery.zoom.min.js', function () {
			let item_list = new Collection(list).get_data();
			let structure = new Create(item_list).item_structure();

			$(element).find('.slideMagnify-Section-Container').html(structure).slick({
				slidesToShow: device == "mobile" ? 1 : 3,
				centerMode: true,
				centerPadding: '0px',
				arrows: true,
				prevArrow: `<i class="fa-solid fa-chevron-left slideMagnify-Arrow-Prev slick-prev"></i>`,
				nextArrow: `<i class="fa-solid fa-chevron-right  slideMagnify-Arrow-Next slick-next"></i>`,
				autoplay: true,
				autoplaySpeed: 4000,
				draggable: false,
				swipeToSlide: false,
				touchMove: false
			});

			$(element).find("div.slideMagnify-Item-Image").each(function () {
				let image_Src = $(this).find("img.slideMagnify-Image-Element").attr("src");
				let target_el = $(this).parent().find(".slideMagnify-Main-Target");
				let option = {
					url: image_Src,
					target: target_el,
					on: zoom_trigger,
					magnify: 1
				};
				if (!zoom_panel) {
					delete option.target;
				}
				$(this).zoom(option);
			});

			if (zoom_panel) {
				$(element).find("div.slideMagnify-Item-Image").mousemove(function (e) {
					let x_mouse = e.originalEvent.x;
					let y_mouse = e.originalEvent.y;
					let offset_x = $(this).offset().left;
					let offset_y = $(this).offset().top;
					let element_w = $(this).prev().outerWidth() / 2;
					let element_h = $(this).prev().outerHeight() / 2;
					$(element).find("div.slideMagnify-Main-Target-Handler").css({
						top: (y_mouse - offset_y) - 50,
						left: (x_mouse - offset_x) - 50,
					});
				}).mouseenter(function () {
					$(this).prev().addClass("slideMagnify-Main-Target-Active");
				}).mouseleave(function () {
					$(this).prev().removeClass("slideMagnify-Main-Target-Active");
				});
			}
		});
	});
});

function Create(obj) {
	this.item_structure = () => {
		return obj.map(i => {
			return i.type == "image" ? `<div class="slideMagnify-Item-Section" data-panel="${zoom_panel}" data-image="${i.image}">
			<div class="slideMagnify-Main-Target-Handler"></div>
			<div class="slideMagnify-Main-Target"></div>
			<div class="slideMagnify-Item-Image">
				<div class="slideMagnify-Image-Icon">
					<img src="https://irp.cdn-website.com/0967fed6/dms3rep/multi/magnifying-glass-for-search-svgrepo-com.svg">
				</div>
				<img class="slideMagnify-Image-Element" src="${i.image}"/>
			</div>
		</div>` : `<div class="slideMagnify-Item-Section" data-image="${i.image}">
		<div class="slideMagnify-Main-Target"></div>
		<div class="slideMagnify-Item-Image withVideo">
			<video width="100%" controls="">
				<source src="${i.video}" type="video/mp4"></source>
				Your browser does not support HTML video.
			</video>
		</div>
	</div>`;
		}).join('');
	};
	return this;
}

function Collection(collection) {
	this.get_data = () => {
		return collection.map(i => {
			let item = {};
			Object.keys(i).filter(j => {
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