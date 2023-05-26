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
		apikey: "AIzaSyCypYDynk1pVZJxjn4UCu5pK-4-d_tw1PY",
		channelID: "UCgeftOQdZpPmAFA-r8mMi4w",
		playlistID: "PLPV3DWVWcY3RZAiv1CENFaxMekF5xYeRT",
		videoCount: "50",
		pageSize: "9"
	}
};

// WIDGET VARIABLES
let apikey = data.config.apikey;
let channelID = data.config.channelID;
let playlistID = data.config.playlistID;
let videoCount = parseInt(data.config.videoCount);
let pageSize = parseInt(data.config.pageSize);
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://apis.google.com/js/platform.js", function () {
		dmAPI.loadScript("https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js", function () {
			dmAPI.loadScript('https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js', function () {
				new Ajax(apikey).getID(channelID).then(function (response) {
					let resp = response.items[0];
					let channel_title = resp.snippet.title;
					let channel_description = resp.snippet.description;
					let channel_image = resp.snippet.thumbnails.medium.url;

					$(element).find(".youtube-Section-Image img").attr("src", channel_image);
					$(element).find(".youtube-Section-Image img").attr("alt", channel_title);
					$(element).find(".youtube-Info-Title").html(channel_title);
					$(element).find(".youtube-Info-Description").html(channel_description);

					let upload_id = playlistID ? playlistID : response.items[0].contentDetails.relatedPlaylists.uploads;
					new Ajax(apikey).data(upload_id).then(youtube_video_list => {
						let video_list = youtube_video_list.items.filter(i => i.status.privacyStatus == "public");
						$(element).find('.youtube-Pagination-Container').pagination({
							dataSource: video_list,
							pageSize,
							callback: function (data, pagination) {
								console.log(data)
								let structure = new Create(data).structure();
								$(element).find(".youtube-Container-Panel").html(structure);
							}
						});

						$(element).find(".youtube-Items-Link").magnificPopup({
							type: 'iframe',
							iframe: {
								markup: `<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>`, // HTML markup of popup, `mfp-close` will be replaced by the close button
								patterns: {
									youtube: {
										index: 'youtube.com/',
										id: 'v=',
										src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0&fs=1&mute=1'
									}
								},
								srcAction: 'iframe_src',
							}
						});
					});
				});
			});
		});
	});
});

function Ajax(apikey) {
	this.getID = function (channelID) {
		return $.ajax({
			url: `https://www.googleapis.com/youtube/v3/channels?key=${apikey}&id=${channelID}&part=contentDetails,snippet`,
		});
	};
	this.data = function (upload_id) {
		return $.ajax({
			url: `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=${upload_id}&part=snippet,contentDetails,status&maxResults=${videoCount}`
		});
	};
}

function Create(youtube_videos) {
	this.structure = function () {
		return youtube_videos.map(i => {
			let snippet = i.snippet;
			let description = snippet.description;
			let publishedAt = snippet.publishedAt;
			let ddate = new Date(publishedAt);
			var finalDate = `${parseInt(ddate.getMonth()+1) <= 9 ? "0"+parseInt(ddate.getMonth()+1):parseInt(ddate.getMonth()+1)}/${ddate.getDate() <= 9  ? "0"+ddate.getDate():ddate.getDate()}/${ddate.getFullYear()}`; //CONVERTED DATE 
			let title = snippet.title;
			let thumbnails = snippet.thumbnails.medium.url;
			let vid_id = snippet.resourceId.videoId;
			return `<div class="youtube-Panel-Wrapper">
					<div class="youtube-Wrapper-Items">
						<a href="https://www.youtube.com/watch?v=${vid_id}" class="youtube-Items-Link">
							<div class="youtube-Items-Image">
								<img src="${thumbnails}" alt="${title}">
								<i class="fa-solid fa-play youtube-Play-Icon"></i>
							</div>
						</a>
						<div class="youtube-Items-Details">
							<div class="youtube-Details-Title">${title}</div>
							<div class="youtube-Details-Published">${finalDate}</div>
							<div class="youtube-Details-Description"> ${description}</div>
						</div>
					</div>
				</div>`;
		}).join("");
	};
}

css_resource('https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.1.4/pagination.css', 'paginationCss');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css', 'magniFicPopup');
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