WebFont.load({
	google: {
		families: ['Oswald', 'Rubik']
	}
});

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
		title: "This is a sample Title",
		stage_count: "2",
		questionList: [{
			question: "Is this a sample question 1?",
			input: "radiobutton",
			answer: "Cheating Spouses,Custody,Checkmate,Background Check,Run a Tag",
			stage: "1"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Cheating Spouses 1,Cheating Spouses 2,Cheating Spouses 3",
			related: "Cheating Spouses",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Custody 1, Custody 2, Custody 3",
			related: "Custody",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Checkmate 1,Checkmate 2,Checkmate 3",
			related: "Checkmate",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Background Check 1,Background Check 2,Background Check 3",
			related: "Background Check",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Run a Tag 1,Run a Tag 2,Run a Tag 3",
			related: "Run a Tag",
			stage: "2"
		}]
	}
};

// ! ANCHOR: WIDGET VARIABLES

let collect = new Collection();
let questionList = data.config.questionList;
let stage_count = parseInt(data.config.stage_count);
let currentStage = 1;
let scroll = 106;

// ! ANCHOR: INITIALIZATION
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js', function () {
		let resp = collect.data(questionList);
		let stages = new Create(resp).stage_count();
		$(element).find(".funnel-Stage-Container").html(stages);
		let questions = new Create(resp).questions();
		$(element).find(".funnel-Container-Slide").html(questions);

		// Slider Q&A
		$(element).find(".funnel-Container-Slide").slick({
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			draggable: false,
			dots: false
		});
	});
});


// ! ANCHOR CLICK EVENTS
$(element).find(".funnel-Footer-Next").click(function () {
	$(this).addClass("funnel-Button-Active");
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage+1}"]`).addClass('funnel-Stage-Number-Active');
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage+1}"]`).next().addClass('funnel-Stage-Number-Active');
	$(element).find(".funnel-Container-Slide").slick('slickGoTo', currentStage);
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).html('<i class="fa-solid fa-check"></i>').addClass('funnel-Stage-Number-Done');
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).next().addClass('funnel-Stage-Number-Done');

	if (stage_count.length >= currentStage) {
		document.querySelector(`.funnel-Stage-Container`).scrollTo({
			left: scroll * (currentStage - 2),
			behavior: 'smooth'
		});
		let is_Final_Stage = currentStage == stage_count.length ? currentStage : currentStage++;
		let result = is_Final_Stage == stage_count.length;

		if (is_Final_Stage - 1 == stage_count.length - 2) {
			$(this).find("span").text("SUBMIT");
		}

		if (result) {
			setTimeout(function () {
				$(element).find(`.funnel-Stage-Number[data-index="${currentStage+1}"]`).addClass('funnel-Stage-Number-Done');
			}, 3000);
		}
	}
	$(element).find(".funnel-Footer-Prev").removeClass("funnel-Footer-Prev-Inactive");
});

$(element).find(".funnel-Footer-Prev").click(function () {
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage - 1}"]`).html(`<span>${currentStage - 1}</span>`);
	if (currentStage >= 2) {
		$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).removeClass('funnel-Stage-Number-Active');
		$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).next().removeClass('funnel-Stage-Number-Active');
		$(element).find(`.funnel-Stage-Number[data-index="${currentStage-1}"]`).removeClass('funnel-Stage-Number-Done');
		$(element).find(`.funnel-Stage-Number[data-index="${currentStage - 1}"]`).next().removeClass('funnel-Stage-Number-Done');
		currentStage--;

		document.querySelector(`.funnel-Stage-Container`).scrollTo({
			left: scroll * (currentStage - 3),
			behavior: 'smooth'
		});
		if (currentStage <= 1) $(element).find(".funnel-Footer-Prev").addClass("funnel-Footer-Prev-Inactive");
		$(element).find(".funnel-Container-Slide").slick('slickGoTo', currentStage - 1);
	}
});


// $(element).find(".funnel-Main-Container").on('click', ".funnel-Stage-Number", function () {
// 	let index = $(this).attr("data-index");
// 	document.querySelector(`.funnel-Stage-Container`).scrollTo({
// 		left: scroll * (index - 1),
// 		behavior: 'smooth'
// 	});
// });

// ! ANCHOR KEYPRESS EVENTS
// ! ANCHOR MOUSE EVENTS


// ! ANCHOR FUNCTIONS
function Create(obj, a) {
	this.answer_ = {
		radiobutton: function (item) {
			let options = item.answer.split(',');
			let filler = options.length % 3 != 2 ? "" : `<div class="funnel-Answer-Radiobutton funnel-Answer-Radiobutton-Filler"></div>`;
			return options.map((j, index) => {
				return `<div class="funnel-Answer-Radiobutton" data-answer="${index}">
					<div class="funnel-Radiobutton-Item">
					<i class="fa-regular fa-square"></i>
						<span>${j}</span>
					</div>
				</div>`;
			}).join("") + filler;
		},
		textbox: function (item) {
			return `<input type="text" placeholder="Type your answer here..">`;
		}
	};
	this.question_count = () => {
		return obj.map((i, index) => {
			return `<div class="funnel-Stage-Number ${index == 0 ? "funnel-Stage-Number-Active":""}" data-index="${index+1}">
						<span>${index+1}</span>
					</div>
					<div class="funnel-Stage-Divider ${index == 0 ? "funnel-Stage-Number-Active":""}"></div>`;
		}).join('') + `<div class="funnel-Stage-Number" data-index="${obj.length+1}">
						<span><i class="fa-solid fa-square-poll-vertical"></i></span>
					</div>`;
	};
	this.questions = () => {
		return obj.map((i, index) => {
			return `<div class="funnel-Slide-Item">
				<div class="funnel-Section-Questions">
					<div class="funnel-Questions-Item">
						${index+1} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet convallis nisl
						sit amet imperdiet. Nam eu tellus sapien. Nunc pellentesque accumsan tempus.
					</div>
				</div>
				<div class="funnel-Section-Answer">
					${this.answer_[i.input](i)}
				</div>
			</div>`;
		}).join("") + `<div class="funnel-Slide-Item">RESULT</div>`;
	};

	return this;
}

function Collection() {
	this.data = (collection) => {
		return collection.map(i => {
			let item = {};
			Object.keys(i).filter(j => {
				item[removeSpecial(j).toLowerCase()] = typeof i[j] == "object" ? i[j].href : this.removeExtra(i[j]);
			});
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

// ! ANCHOR RESOURCES
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.css', 'slickSliderCSs');
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