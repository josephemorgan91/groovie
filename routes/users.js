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
	let foundMovies = [];
	res.render('../views/new', {title: "New Request - Groovie", foundMovies: foundMovies});
})

router.post('/search', (req, res) => {
	if (req.body.title && req.body.title.length > 0) {
		tmdb.getMovieDataByKeyword(req.body.title).then(
			(result) => {
				res.render('../views/new', {title: "New Request - Groovie", foundMovies: tmdb.movieData})
			},
			(error) => {
				flash("error", error);
				res.redirect("back");
			}
		);
	} else {
		flash("error", "Search failed");
		res.render('../views/new', {title: "New Request - Groovie", foundMovies: tmdb.movieData})
	}
})

router.post('/:id/requests/new', (req, res) => {
	let newMovie;
	for (let movie of tmdb.movieData) {
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
});


router.delete('/:id/:movie_id', (req, res) => {
	User.update({_id: req.params.id}, {"$pull" : {"requested_movies" : {"movie_id" : req.params.movie_id}}}, {safe: true}, (err, obj) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("back")
		}

	});
});


module.exports = router;
