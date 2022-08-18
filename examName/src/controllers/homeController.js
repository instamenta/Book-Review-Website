const router = require('express').Router();

const { getErrorMessage } = require('../util');

router.get('/', (req, res) => {
    res.render('home/home');
});
router.get('/404', (req, res) => {
    res.render('home/404.hbs')
})
module.exports = router;