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
		stage_count: "10",
		questionList: [{
			question: "Is this a sample question 1?",
			input: "radiobutton",
			answer: "Cheating Spouses,Custody,Background Check",
			stage: "1"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Cheating Spouses 1,Cheating Spouses 2",
			related: "Cheating Spouses",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Custody 1,Custody 2",
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
			answer: "Background Check 1,Background Check 2",
			related: "Background Check",
			stage: "2"
		}, {
			question: "Is this a sample question 2?",
			input: "radiobutton",
			answer: "Run a Tag 1,Run a Tag 2,Run a Tag 3",
			related: "Run a Tag",
			stage: "2"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Cheating 1,Cheating 2",
			related: "Cheating Spouses 1",
			stage: "3"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Spouses 1,Spouses 2",
			related: "Cheating Spouses 2",
			stage: "3"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Child 1,Child 2",
			related: "Custody 1",
			stage: "3"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Property 1,Property 2",
			related: "Custody 2",
			stage: "3"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Criminal History 1,Criminal History 2",
			related: "Background Check 1",
			stage: "3"
		}, {
			question: "Is this a sample question 3?",
			input: "radiobutton",
			answer: "Education 1,Education 2",
			related: "Background Check 2",
			stage: "3"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Sample 1,Sample 2",
			related: "Cheating 1",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Cheating 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Sample 1,Sample 2",
			related: "Spouses 1",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Spouses 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Child 1",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Child 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Property 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Property 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Property 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Property 2",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Criminal History 1",
			stage: "4"
		}, {
			question: "Is this a sample question 4?",
			input: "radiobutton",
			answer: "Test 1, Test 2",
			related: "Criminal History 2",
			stage: "4"
		}]
	}
};

// ! ANCHOR: WIDGET VARIABLES

let collect = new Collection();
let actionLink = "../src/php/actions.php";
let questionList = data.config.questionList;
let stage_count;
let currentStage = 1;
let scroll = 106;
let stage_answers = {
	0: "main"
};
// ! ANCHOR: INITIALIZATION
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js', function () {
		let resp = collect.data(questionList);
		let stages = new Create(resp).stage_count();
		$(element).find(".funnel-Stage-Container").html(stages);
		let questions = new Create(resp).questions();
		$(element).find(".funnel-Container-Slide").html(questions);
	});
});

// ! ANCHOR CLICK EVENTS
//! Checkboxes
$(element).on("click", ".funnel-Radiobutton-Item", function () {
	$(element).find(`.funnel-Radiobutton-Item i`).remove();
	$(element).find(`.funnel-Radiobutton-Item`).not(this).prepend('<i class="fa-regular fa-square"></i>').removeClass("funnel-Radiobutton-Item-Active");
	$(this).prepend('<i class="fa-regular fa-square-check"></i>').addClass("funnel-Radiobutton-Item-Active");
	$(element).find(".funnel-Footer-Next").removeClass("funnel-Footer-Next-Inactive");
});

//! Textbox
$(element).on('keyup', ".funnel-Answer-Textbox", function () {
	let value = $(this).val();
	if (value) {
		$(element).find(".funnel-Footer-Next").removeClass("funnel-Footer-Next-Inactive");
	} else {
		$(element).find(".funnel-Footer-Next").addClass("funnel-Footer-Next-Inactive");
	}

	$(this).attr("data-answer", value);
});

//! Next Button
$(element).find(".funnel-Footer-Next").click(function () {

	$(this).addClass("funnel-Footer-Next-Inactive");

	// Done stage
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).html('<i class="fa-solid fa-check"></i>').addClass('funnel-Stage-Number-Done');
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).next().addClass('funnel-Stage-Number-Done');

	if (currentStage <= stage_count) {
		document.querySelector(`.funnel-Stage-Container`).scrollTo({
			left: scroll * (currentStage - 2),
			behavior: 'smooth'
		});
		currentStage++;
		if (stage_count < currentStage) {
			$(this).find("span").text("Proceed to Payment");
		}
	}
	// Next active stage
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).addClass('funnel-Stage-Number-Active');
	$(element).find(`.funnel-Stage-Number[data-index="${currentStage}"]`).next().addClass('funnel-Stage-Number-Active');
	$(element).find(".funnel-Footer-Prev").removeClass("funnel-Footer-Prev-Inactive");

	$(element).find(".funnel-Slide-Item").removeClass("funnel-Slide-Item-Active");
	if (questionList[currentStage - 2].input == "radiobutton") {
		let answer = $(element).find(".funnel-Radiobutton-Item-Active").parent().attr("data-answer");
		stage_answers[currentStage - 1] = answer;
		$(element).find(`.funnel-Slide-Item[data-answer="${currentStage <= stage_count ? answer :"result"}"]`).addClass("funnel-Slide-Item-Active").attr("data-move", "next");
	}

	if (questionList[currentStage - 2].input == "textbox") {
		$(element).find(`.funnel-Slide-Item[data-stage="${currentStage}"]`).addClass("funnel-Slide-Item-Active").attr("data-move", "next");
	}

	if (currentStage > stage_count) {
		let final_result = new Create(stage_answers).result();
		$(element).find(".funnel-Slide-Item[data-answer=result]").html(final_result).addClass("result-active");
	}
});

// ! Back Button
$(element).find(".funnel-Footer-Prev").click(function () {
	delete stage_answers[currentStage - 1]
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

		let prev_stage = stage_answers[currentStage - 1];

		$(element).find(".funnel-Slide-Item").removeClass("funnel-Slide-Item-Active");
		$(element).find(`.funnel-Slide-Item[data-stage="${currentStage}"][data-answer="${prev_stage}"]`).addClass("funnel-Slide-Item-Active").attr("data-move", "prev");
		$(element).find(".funnel-Slide-Item-Active").find(".funnel-Radiobutton-Item").removeClass("funnel-Radiobutton-Item-Active");
		$(element).find(".funnel-Slide-Item-Active").find("i").removeClass("fa-square-check").addClass("fa-square");

		if (stage_count !== currentStage || stage_count <= currentStage) {
			$(element).find(".funnel-Footer-Next span").text("NEXT");
		}

		$(element).find(".funnel-Slide-Item[data-answer=result]").removeClass("result-active");
	}
});

// ! ANCHOR KEYPRESS EVENTS
// ! ANCHOR MOUSE EVENTS


// ! ANCHOR FUNCTIONS
function Create(obj, a) {
	this.answer_ = {
		radiobutton: function (item) {
			let options = item.answer.split(',');
			let filler = options.length % 3 != 2 ? "" : `<div class="funnel-Answer-Radiobutton funnel-Answer-Radiobutton-Filler"></div>`;
			return options.map((j, index) => {
				return `<div class="funnel-Answer-Radiobutton" data-answer="${j}">
					<div class="funnel-Radiobutton-Item">
					<i class="fa-regular fa-square"></i>
						<span>${j}</span>
					</div>
				</div>`;
			}).join("") + filler;
		},
		textbox: function (item) {
			return `<input type="text" class="funnel-Answer-Textbox" placeholder="Type your answer here..">`;
		}
	};
	this.stage_count = () => {
		var uniqueItems = Array.from(new Set(obj.map(i => i.stage)));
		stage_count = uniqueItems.length;
		return uniqueItems.map(i => {
			return `<div class="funnel-Stage-Number ${i == 1 ? "funnel-Stage-Number-Active":""}" data-index="${i}">
						<span>${i}</span>
					</div>
					<div class="funnel-Stage-Divider ${i == 1 ? "funnel-Stage-Number-Active":""}"></div>`;
		}).join('') + `<div class="funnel-Stage-Number" data-index="${uniqueItems.length+1}">
						<span><i class="fa-solid fa-square-poll-vertical"></i></span>
					</div>`;
	};
	this.questions = () => {
		return obj.map(i => {
			return `<div class="funnel-Slide-Item ${i.stage=="1" ? "funnel-Slide-Item-Active":""}" data-answer="${i.related ?i.related :"main"}" data-stage="${i.stage}">
				<div class="funnel-Section-Questions">
					<div class="funnel-Questions-Item">
						${i.question}
					</div>
				</div>
				<div class="funnel-Section-Answer">
					${this.answer_[i.input](i)}
				</div>
			</div>`;
		}).join("") + `<div class="funnel-Slide-Item" data-answer="result">RESULT</div>`;
	};
	this.result = () => {
		return Object.keys(obj).map((i, index) => {
			if (index == 0) return;
			return `<div class="funnel-Individual-Result">
				<div class="funnel-Result-Item">${obj[i]}</div>
			</div>`;
		}).join("");
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

function action(data) {
	return $.ajax({
		url: actionLink,
		method: "POST",
		data: JSON.stringify(data)
	});
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