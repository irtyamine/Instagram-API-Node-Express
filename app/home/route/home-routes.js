const express   = require('express');
const router    = express();

const homeController  = require('../controller/home-controller');
const userMiddleware  = require('../middleware/instagram-user-middleware');

/* Get home page */
router.route('/').get(homeController.getHome);
router.route('/login').get(homeController.getInstagramLogin);
router.route('/auth/instagram').get(homeController.postInstagramLogin);
// get profile
router.route('/profile').get(userMiddleware.authorizeAccess, homeController.getProfile);
router.route('/logout').get(homeController.getLogout);

module.exports = router;
