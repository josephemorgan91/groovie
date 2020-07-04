const User = require('../models/user.js');

const middleware = {
	checkIfAdmin: function checkIfAdmin(req, res, next) {
		if (req.isAuthenticated()) {
			User.find({"username": "jemorgan"}, (err, foundUser) => {
				console.log(foundUser);
				// console.log("Found User: " + foundUser + "\nreq.user: " + req.userId);
				if (err) {
					req.flash("error", "Something went wrong");
				} else if (foundUser._id === req.user._id) {
					console.log("Going next");
					next();
				} else {
					console.log("going back");
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			});
		}
	}
}

module.exports = middleware;
