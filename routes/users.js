const express = require('express');
const router = express.Router();
const flash = require("connect-flash");
const middleware = require("../middleware/auth.js");
const User = require("../models/user.js");
const tmbd = require("../tmdb.js");

/* GET users listing. */
router.get('/', (req, res)  => {
	res.send('respond with a resource');
});

router.get('/:id/requests', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			console.log(err);
		} else {
			res.render('../views/requests', {title: "Profile - Groovie", user: user});
		}
	});
});

router.get('/:id/requests/new', (req, res) => {
	let foundContent = [];
	res.render('../views/new', {title: "New Request - Groovie", foundContent: foundContent});
})

router.post('/search', (req, res) => {
	if (req.body.title && req.body.title.length > 0) {
		if (req.body.mode === '0') {
			tmdb.getMovieDataByTitle(req.body.title).then(
				(result) => {
					res.render('../views/new', {title: "New Request - Groovie", foundContent: tmdb.contentData, mode: req.body.mode, lastQuery: req.body.title});
				},
				(error) => {
					req.flash("error", error);
					res.redirect("back");
				}
			);
		} else if (req.body.mode === "1") {
			tmdb.getTvShowDataByTitle(req.body.title).then(
				(result) => {
					foundContent = tmdb.contentData;
					foundContent.forEach((content) => {
					});
					res.render('../views/new', {title: "New Request - Groovie", foundContent: tmdb.contentData, mode: req.body.mode, lastQuery: req.body.title});
				},
				(error) => {
					console.log(error);
					res.redirect("back");
				}
			)
		}
	} else {
		req.flash("error", "Search failed");
		res.render('../views/new', {title: "New Request - Groovie", foundContent: tmdb.contentData})
	}
})

router.post('/:id/requests/new', (req, res) => {
	let alreadyExists = false;
	// Check if content already exists in requests
	if (req.body.mode === 0) {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				user.requested_movies.forEach((movie) => {
					if (movie.movie_id === req.body.movieId) {
						alreadyExists = true;
					}});
				// if content is not already in requests, add it
				if (!alreadyExists) {
					for (let movie of tmdb.contentData) {
						if (movie.id == req.body.movieId) {
							User.updateOne({
								_id: req.params.id
							}, {
								$push: {
									requested_movies : {
										movie_id: movie.id,
										movie_title: movie.title,
										movie_release_date: movie.date,
										movie_description: movie.description,
										movie_rating: movie.rating,
										movie_poster: movie.posterUrl
									}
								}
							}, (err, response) => {
							});
							break;
						}
					}
				}
			}
		});
	} else if (req.body.mode === 1) {
		// Check if content already exists in requests
		User.findById(req.params.id, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				user.requested_tv_shows.forEach((tvShow) => {
					if (tvShow.tv_show_id === req.params.id) {
						alreadyExists = true;
					}});
			}
		});
		// if content is not already in requests, add it
		if (!alreadyExists) {
			for (let tvShow of tmdb.contentData) {
				if (tvShow.id == req.body.tvShowId) {
					User.updateOne({
						_id: req.params.id
					}, {
						$push: {
							requested_tv_shows : {
								tv_show_id: tvShow.id,
								tv_show_title: tvShow.title,
								tv_show_first_air_date: tvShow.date,
								tv_show_description: tvShow.description,
								tv_show_rating: tvShow.rating,
								tv_show_poster:tvShow.posterUrl 
							}
						}
					}, (err, response) => {
					});
					break;
				}
			}
		}
	}
});


router.delete('/:id/:type/:content_id', (req, res) => {
	if (req.params.type === "movie") {
		User.update({_id: req.params.id}, {"$pull" : {"requested_movies" : {"movie_id" : req.params.content_id}}}, {safe: true}, (err, obj) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("back")
			}
		});
	} else if (req.params.type === "tvShow") {
		User.update({_id: req.params.id}, {"$pull" : {"requested_tv_shows" : {"tv_show_id" : req.params.content_id}}}, {safe: true}, (err, obj) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("back")
			}
		});
	}
});


module.exports = router;
