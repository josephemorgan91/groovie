const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const middleware = require("../middleware/middleware.js");


/* GET home page. */
router.get('/', (req, res) => {
	res.redirect("/login");
});

router.get('/register', (req, res) => {
	res.render("../views/register.ejs", {title: 'Groovie - Register'});
});

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			passport.authenticate("local") (req, res, () => {
				res.redirect('/');
			});
		}
	})
})

router.get('/login', function(req, res, next) {
	res.render('login.ejs', { title: 'Groovie - The Granny Movie Request Interface' });
});

router.post('/login', passport.authenticate("local", {
	successRedirect: "/login",
	failureRedirect: "/login",
	failureFlash: true }), (req, res) => {});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect("/login");
});

// TODO: Add auth middleware
router.get('/all_requests', (req, res) => {
	User.find({}, (err, user) => {
		if (err) {
			flash("error", err);
		} else {
			res.render('all_requests.ejs');
		}
	})
});

module.exports = router;
