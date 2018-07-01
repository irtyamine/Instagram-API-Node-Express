const mongoose = require('mongoose');

const instagramUser = mongoose.Schema({
	id              : { type: Number, unique: true },
	username        : String,
	full_name       : String,
	bio             : String,
	website         : String,
	profile_picture : String,
	access_token    : String,
    dateCreated 	: 	{ type: Date, default: Date.now, expires: 86400 }
});

module.exports = mongoose.model('InstagramUser', instagramUser);