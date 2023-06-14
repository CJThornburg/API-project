const express = require('express');
const { Event, Group, Venue, EventImage, Attendance } = require('../../db/models');
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






router.get("/:eventId", async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {

        include: [
            {
                model: Group,
                attributes: ["id", "name", "city", "state", "private"]

            },
            {
                model: Venue,
                attributes: {
                    exclude: ["groupId", "createdAt", "updatedAt"]
                }
            },
            {
                model: EventImage,
                attributes: {
                    exclude: ["eventId", "createdAt", "updatedAt"]
                }
            },
            { model: Attendance }
        ],
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    });

    if (!event) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }
    if (event.dataValues.Attendances.length) {
        event.dataValues.numAttending = event.dataValues.Attendances.length
    } else {
        event.dataValues.numAttending = null
    }
    delete event.dataValues.Attendances



    res.json(event)
})



































module.exports = router;
