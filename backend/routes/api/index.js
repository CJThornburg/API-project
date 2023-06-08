const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');
// dont need to deconstruct the next two because they are single exports
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');


// any routes that make it to this router will be  middleware
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
