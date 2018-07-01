const express   = require('express');
const router    = express();

const homeController  = require('../controller/home-controller');
const userMiddleware  = require('../middleware/instagram-user-middleware');

/* Get home page */
router.route('/').get(homeController.getHome);
router.route('/login').get(homeController.getInstagramLogin);
router.route('/auth/instagram').get(homeController.postInstagramLogin);
router.route('/profile').get(userMiddleware.authorizeAccess, homeController.getProfile);

module.exports = router;
