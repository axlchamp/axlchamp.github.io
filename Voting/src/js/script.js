// GSX
let element = $('.widget-abc123');
let data = {
	config: {
		goodVoteTitle: "Like this?",
		badVoteTitle: "Dont Like this?",
		voteDescription: "You can't change this once submitted!",
		goodButtonText: "Yes, I like it",
		badButtonText: "No, I don't like it",
		key: "keyX06ffWMhI3x610",
		airtable: "https://api.airtable.com/v0/appuY2AKhmBPErow1/Sheet1",
		showLike: true,
		showDislike: true,
		id: "ID1"
	}
};

let endpoint = 'https://personalappaxl.000webhostapp.com/php/actions.php';

let create = new Create();
let vote = new Voting();
let call = new Call();

let key = data.config.key;
let airtable = data.config.airtable;
let id = data.config.id;

// Popup Title
let goodVoteTitle = data.config.goodVoteTitle;
let badVoteTitle = data.config.badVoteTitle;
// Popup Button Text
let goodButtonText = data.config.goodButtonText;
let badButtonText = data.config.badButtonText;
let voteDescription = data.config.voteDescription;

// Toggle
let showLike = data.config.showLike;
let showDislike = data.config.showDislike;

loadScript(document, "script", "SwalJS", "//cdn.jsdelivr.net/npm/sweetalert2@10", function () {
	voteListener();
});

function voteListener() {
	let getVotes = {
		action: "Get Votes",
	};
	let getdata = call.ajax(getVotes);
	getdata.then(response => {
		let parseResponse = JSON.parse(response).result;
		let resp = JSON.parse(parseResponse).records;
		let structure = create.structure(resp);
		$(element).find(".voting-Container-Count").html(structure);
	});
}

function Create() {
	this.structure = (obj) => {
		let filter = {
			id: id
		};
		let filtered = multiFilter(obj, filter);

		return filtered.map(i => {
			let likeBtn = showLike ? `
			<div class="voting-Panel-Upvote" data-id="${i.id}" data-feedback="Upvote">
				<i class="far fa-thumbs-up"></i>
				<span class="count">${i.fields.Upvote}</span>
			</div>` : '';

			let dislikeBtn = showDislike ? `<div class="voting-Panel-Downvote" data-id="${i.id}"  data-feedback="Downvote">
				<i class="far fa-thumbs-down"></i>
				<span class="count">${i.fields.Downvote}</span>
			</div>` : '';
			return `
				<div class="voting-Section-Icons" record-id='${btoa(JSON.stringify(i))}'>
					${likeBtn}
					${dislikeBtn}
					
				</div>`;
		}).join("");
	};
}

$(element).on("click", ".voting-Panel-Upvote,.voting-Panel-Downvote", function () {
	let voteID = $(this).attr("data-id");
	// Storage
	let isVoted = localStorage.getItem(voteID);
	if (isVoted) {
		Swal.fire("Warning!", "You already voted", "warning");
		return;
	}

	let record = JSON.parse(atob($(this).parent().attr("record-id")));
	let feedback = $(this).attr("data-feedback");
	let recordToUpdate = {
		"records": [{
			"id": record.id,
			"fields": {
				"id": record.fields.id,
				"Name": record.fields.Name,
				"Upvote": feedback == "Upvote" ? record.fields.Upvote + 1 : record.fields.Upvote,
				"Downvote": feedback == "Downvote" ? record.fields.Downvote + 1 : record.fields.Downvote,
			}
		}]
	};

	let upVote = {
		action: "Up Votes",
		id: $(this).attr("data-id"),
		feedback,
		record: JSON.stringify(recordToUpdate)
	};
	vote.confirm(upVote, voteID);
});

function Voting() {
	this.confirm = (vote, voteID) => {

		let option = {
			title: vote.feedback == "Upvote" ? goodVoteTitle : badVoteTitle,
			text: voteDescription,
			icon: vote.feedback == "Upvote" ? "success" : "error",
			showCancelButton: true,
			confirmButtonColor: vote.feedback == "Upvote" ? '#3dd681' : '#d63d3d',
			cancelButtonColor: '#000000',
			confirmButtonText: vote.feedback == "Upvote" ? goodButtonText : badButtonText,
		};

		Swal.fire(option).then((result) => {
			if (result.isConfirmed) {
				this.update(vote, voteID);
			}
		});
	};
	this.update = (vote, voteID) => {
		let getdata = call.ajax(vote);
		getdata.then(response => {
			let status = JSON.parse(response).status;
			if (status) {
				localStorage.setItem(voteID, true);
				voteListener();
			} else {
				alert("Vote Failed");
			}
		});
	}
}

function Call() {
	this.ajax = (vote) => {
		vote.key = key;
		vote.airtable = airtable;
		let settings = {
			url: endpoint,
			method: "POST",
			data: JSON.stringify(vote)
		};
		return $.ajax(settings);
	};
}


// Plugins
const cssId = 'fontAwesomeSource';
if (!document.getElementById(cssId)) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.id = 'fontAwesomeSource';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://use.fontawesome.com/releases/v5.5.0/css/all.css';
	link.integrity = 'sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU';
	link.crossOrigin = 'anonymous';
	head.appendChild(link);
}

// Reusable
function multiFilter(obj, filters) {
	const filterKeys = Object.keys(filters);
	return obj.filter(function (eachObj) {
		return filterKeys.every(function (eachKey) {
			if (!filters[eachKey].length) {
				return true; // passing an empty filter means that filter is ignored.
			}
			return filters[eachKey] == eachObj.fields[eachKey];
		});
	});
}

function loadScript(d, s, id, url, callback) {
	$('#' + id).remove();
	var fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return
	}
	script = d.createElement(s);
	script.id = id;
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