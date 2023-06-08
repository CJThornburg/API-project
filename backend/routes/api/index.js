const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');



// any routes that make it to this router will be  middleware
router.use(restoreUser);


module.exports = router;
