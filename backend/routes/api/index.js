const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');
// dont need to deconstruct the next two because they are single exports
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const groupImageRouter = require('./groupImage.js');
const eventImageRouter = require('./eventImages.js');
// any routes that make it to this router will be  middleware
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/venues', venuesRouter);
router.use('/events', eventsRouter);
router.use('/group-images', groupImageRouter);
router.use('/event-images', groupImageRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
