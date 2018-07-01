const request = require('request');
const config  = require('../auth/config');
const User    = require('../model/instagram-user');
const jwt     = require('jsonwebtoken');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// get home page
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getHome = (req, res) => {
	res.status(200).json({ 
		success: true, 
		message: "Successfully fetched the home page"
	});
};

// get instagram login
module.exports.getInstagramLogin = (req, res) => {
	res.redirect(config.instagram.auth_url);
}

// post instagram login
module.exports.postInstagramLogin = (req, res) => {
	// Request data
	let instagramCredentials = {
		client_id     : config.instagram.client_id,
		client_secret : config.instagram.client_secret,
		grant_type    : 'authorization_code',
		redirect_uri  : config.instagram.redirect_uri,
		code          : req.query.code
	};

	// Request option
	let options = {
		url    : 'https://api.instagram.com/oauth/access_token',
		method : 'POST',
		form   : instagramCredentials
	};

	// Start the request
	request(options, (error, response, userData) => {
		let instagramData = JSON.parse(userData);

		if(error || instagramData.error_type){
	        return res.status(500).json({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: instagramData
	        });
	    }

		let query = User.findOne({'username': instagramData.user.username});

		query.exec((err, profiles) => {
			if(profiles){
				const token = jwt.sign(instagramData, process.env.jwt_secret, { expiresIn: '5h' });
				res.cookie('instagram-user-cookies', token);

				return res.redirect('/api/profile');
			}

			if(!profiles){
				let user = {
					'id'              : instagramData.user.id,
					'username'        : instagramData.user.username,
					'full_name'       : instagramData.user.full_name,
					'bio'             : instagramData.user.bio,
					'website'         : instagramData.user.website,
					'profile_picture' : instagramData.user.profile_picture,
					'access_token'    : instagramData.access_token
				};

				User.create(user, function (error) {
					if (error) return res.status(500).json(error);

					const token = jwt.sign(instagramData, process.env.jwt_secret, { expiresIn: '5h' });
					res.cookie('instagram-user-cookies', token);

					return res.redirect('/api/profile');
				});	
			}
		});
	}); 
};

// get instagram profile
module.exports.getProfile = (req, res) => {
	return res.status(200).json({
		success : true,
		message : "Successfully fetched instagram profile",
		profile : req.user
	});
}

// logout instagram profile
module.exports.getLogout = (req, res) => {
	req.logout();
  	res.clearCookie('instagram-user-cookies');
  	res.redirect('/api');
}