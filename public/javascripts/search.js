let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageUrl = null;
let movieData = [];
let currentUserId = document.currentScript.getAttribute("currentUserId");
let currentUserName = document.currentScript.getAttribute("currentUserName");

let getConfig = function() {
	let url = ''.concat(baseURL, 'configuration?api_key=', API_KEY);
	fetch(url)
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			baseImageUrl = data.images.secure_base_url + data.images.poster_sizes[3];
			configData = data.images;
			console.log('config:', data);
			console.log('config fetched');
		})
		.catch((err) => {
			alert(err);
		});
}

let runSearch = function(keyword) {
	let url = ''.concat(baseURL, 'search/movie?api_key=', API_KEY, '&query=', keyword);
	console.log("Keyword is: " + keyword);
	console.log(url);
	fetch(url)
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			for (let i = 0; i < 3; ++i) {
				movieData[i] = {
					movie_id: data.results[i].id,
					movie_title: data.results[i].title,
					movie_release_date: data.results[i].release_date,
					movie_description: data.results[i].overview,
					movie_rating: data.results[i].vote_average,
					movie_poster: baseImageUrl + data.results[i].poster_path
				};
				document.querySelector("#results").style.visibility = 'visible';
				document.querySelector("#poster_" + i).src = baseImageUrl + data.results[i].poster_path;
				document.querySelector("#movie-title_" + i).innerHTML = "<strong>" + data.results[i].title + "</strong> - <em>" + data.results[i].release_date + "</em>";
				document.querySelector("#movie-description_" + i).textContent = data.results[i].overview;
				document.querySelector("#movie-rating_" + i).textContent = data.results[i].vote_average;
			}
			console.log(JSON.stringify(movieData));

		});
}

document.addEventListener('DOMContentLoaded', getConfig);
console.log("The current user is: " + currentUserName + " - Id:" + currentUserId);

document.querySelector("#search_button").addEventListener('click', (e) => {
	runSearch(document.querySelector("#search_box").value);
});


for (let i = 0; i < 3; ++i) {
	document.querySelector("#add_button_" + i).addEventListener('click', (e) => {
		var xhr = new XMLHttpRequest();
		var postUrl = "/users/" + currentUserId + "/requests/new";
		xhr.open("POST", postUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(movieData[i]));

		document.querySelector('#add_button_' + i).classList.remove('btn-primary');
		document.querySelector('#add_button_' + i).classList.add('btn-success');
	});
}
