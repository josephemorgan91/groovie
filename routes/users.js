const express = require('express');
const router = express.Router();
const middleware = require("../middleware/auth.js");
const User = require("../models/user.js");


/* GET users listing. */
router.get('/', (req, res)  => {
  res.send('respond with a resource');
});

router.get('/:id/requests', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Found user " + user);
			res.render('../views/requests', {title: "Profile - Groovie", user: user});
		}
	});
});

router.get('/:id/requests/new', (req, res) => {
	res.render('../views/new', {title: "New Request - Groovie"})
})

router.post('/:id/requests/new', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			console.log(err);
		} else {
			user.requested_movies.push({
				movie_id: req.body.movie_id,
				movie_title: req.body.movie_title,
				movie_release_date: req.body.movie_release_date,
				movie_description: req.body.movie_description,
				movie_rating: req.body.movie_rating,
				movie_poster: req.body.movie_poster
			});
			console.log("Added movie " + req.body.movie_title);
			user.save();
		}
	});
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
