const express = require('express');
const { Event, Group, Venue } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');




router.get("/", async (req, res) => {
    const events = await Event.findAll({


        include: [
            {
                model: Group,
                attributes: ["id", "name", "city", "state"]

            },
            {
                model: Venue,
                attributes: ["id", "city", "state"]
            }
        ]
    })

    const returnObj = {}
    returnObj.Events = events
    return res.json(returnObj)
})










































module.exports = router;
