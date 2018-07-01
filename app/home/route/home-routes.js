const express   = require('express');
const router    = express();

const homeController = require('../controller/home-controller');

/* Get home page */
router.route('/').get(homeController.getHome);
router.route('/login').get(homeController.getInstagramLogin);
router.route('/auth/instagram').get(homeController.postInstagramLogin);

module.exports = router;
