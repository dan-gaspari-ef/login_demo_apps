var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

/* GET users listing. */
router.get('/', ensureLoggedIn('/'), function(req, res, next) {
  res.render('users', { user: req.user });
});

module.exports = router;
