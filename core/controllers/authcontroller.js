const express = require('express');
const router = express.Router();
const authMid = require('../middleware/auth')

router.use(authMid);

router.get('/', async (req, res) => {
    res.send({ ok: true, user: req.userId});
});

module.exports = router