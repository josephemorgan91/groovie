const User = require("./models/user.js");
const express = require('express');
const fetch = require("node-fetch");
const flash = require("connect-flash");
const API_KEY = require("./apikey.js")

tmdb = {
	baseURL : 'https://api.themoviedb.org/3/',
	configData : null,
	baseImageUrl : null,
	contentData: [],
	defaultMoviePosterUrl : "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1245&q=80",
	getConfig : function() {
		return new Promise(function(resolve, reject) {
			console.log("In getConfig");
			let url = ''.concat(tmdb.baseURL, 'configuration?api_key=', API_KEY);
			console.log(url);
			fetch(url)
				.then((result) => {
					return result.json();
				})
				.then((data) => {
					tmdb.baseImageUrl = data.images.secure_base_url + data.images.poster_sizes[3];
					tmdb.configData = data.images;
					console.log("Resolving getConfig");
					resolve("Config Loaded");
				})
				.catch((err) => {
					flash(err);
					console.log("rejecting getConfig")
					reject(new Error(`Error getting TMDB config: ${err}`));
				});
		});
	},
	getMovieDataByTitle: function(title) {
		return new Promise(function(resolve, reject) {
			let url = ''.concat(tmdb.baseURL, 'search/movie?api_key=', API_KEY, '&query=', title);
			fetch(url)
				.then((result) => {
					return result.json();
				})
				.then((data) => {
					if (data.results) {
						tmdb.contentData.length = 0;
						for (let i = 0; i < data.results.length; ++i) {
							tmdb.contentData[i] = {
								id: data.results[i].id,
								title: data.results[i].title,
								date: data.results[i].release_date,
								description: data.results[i].overview,
								rating: data.results[i].vote_average,
								posterUrl: tmdb.baseImageUrl + data.results[i].poster_path
							};
							if (data.results[i].poster_path === null) {
								tmdb.contentData[i].posterUrl = tmdb.defaultMoviePosterUrl;
							}
							resolve("Search results found");
						}
					} else {
						flash("error", "No results found, try another search!");
						reject(new Error(`Error getting search results: ${err}`));
					}
				});
		});
	},
	getTvShowDataByTitle : function(title) {
		return new Promise(function(resolve, reject) {
			let url = ''.concat(tmdb.baseURL, 'search/tv?api_key=', API_KEY, '&query=', title);
			fetch(url)
				.then((result) => {
					return result.json();
				})
				.then((data) => {
					if (data.results) {
						tmdb.contentData.length = 0;
						for (let i = 0; i < data.results.length; ++i) {
							tmdb.contentData[i] = {
								id: data.results[i].id,
								title: data.results[i].name,
								date: data.results[i].first_air_date,
								description: data.results[i].overview,
								rating: data.results[i].vote_average,
								posterUrl: tmdb.baseImageUrl + data.results[i].poster_path
							};
							if (data.results[i].poster_path === null) {
								tmdb.contentData[i].posterUrl = tmdb.defaultMoviePosterUrl;
							}
							resolve("Search results found");
						}
					} else {
						flash("error", "No results found, try another search!");
						reject(new Error(`Error getting search results: ${err}`));
					}
				});
		});
	}
}

module.exports = tmdb;
