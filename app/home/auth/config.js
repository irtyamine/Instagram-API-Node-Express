const in_client_id = process.env.instagramClientID;
const in_client_secret = process.env.instagramClientSecret;
const in_redirect_uri = 'http://localhost:9001/api/auth/instagram';
const in_auth_url     = 'https://api.instagram.com/oauth/authorize/?client_id=' + in_client_id + '&redirect_uri=' + in_redirect_uri + '&response_type=code'

module.exports.instagram = {
	client_id     : in_client_id,
	client_secret : in_client_secret,
	auth_url      : in_auth_url,
	redirect_uri  : in_redirect_uri
}
