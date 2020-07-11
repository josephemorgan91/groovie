let userId = document.currentScript.getAttribute("currentUserId");

document.querySelectorAll(".add-movie-button").forEach((button) => {

	button.addEventListener('click', (e) => {
		console.log(userId);
		var xhr = new XMLHttpRequest();
		var postUrl = "/users/" + userId + "/requests/new";
		xhr.open("POST", postUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieId: e.srcElement.id}));
	})
});
