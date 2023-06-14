const express = require('express');
const { Event, Group, Venue, EventImage, Attendance } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const { Op } = require('sequelize')




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





router.post("/:eventId/images", requireAuth, grabCurrentUser, async (req, res, next) => {
    const { url, preview } = req.body
    let id = req.currentUser.data.id
    let eventId = req.params.eventId

    const event = await Event.findByPk(eventId)
    if (!event) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }



    // attendy, host, co-host of the event so essentialy have to have attended lol

    let permissionCheck = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: id,
            [Op.or]: [{ status: 'attending' }, { status: 'co-host' }, { status: 'host' }]
        }
    })

    if (permissionCheck) {
        let newEventImage = EventImage.build({
            url,
            preview,
            eventId: parseInt(eventId)

        })
        await newEventImage.save()
       return res.json(newEventImage)
    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


})





























module.exports = router;
