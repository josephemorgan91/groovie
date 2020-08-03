let userId = document.currentScript.getAttribute("currentUserId");

document.querySelectorAll(".add-movie-button").forEach((button) => {

	button.addEventListener('click', (e) => {
		var xhr = new XMLHttpRequest();
		var postUrl = "/users/" + userId + "/requests/new";
		xhr.open("POST", postUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieId: e.srcElement.id, mode: 0}));

		e.srcElement.classList.remove("btn-primary");
		e.srcElement.classList.add("btn-success");
		e.srcElement.textContent = "Movie added to requests!";
	})
});

document.querySelectorAll(".add-tvShow-button").forEach((button) => {

	button.addEventListener('click', (e) => {
		console.log(userId);
		var xhr = new XMLHttpRequest();
		var postUrl = "/users/" + userId + "/requests/new";
		xhr.open("POST", postUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({tvShowId: e.srcElement.id, mode: 1}));

		e.srcElement.classList.remove("btn-primary");
		e.srcElement.classList.add("btn-success");
		e.srcElement.textContent = "TV show added to requests!";
	})
});
