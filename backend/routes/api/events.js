const express = require('express');
const { Event, Group, Venue, EventImage, Attendance, Membership } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const { Op } = require('sequelize')


const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage('VenueId is required')
        .custom(async (value, { req }) => {
            const venue = await Venue.findByPk(parseInt(req.body.venueId))

            if (!venue){ throw new Error('Venue does not exist');
        }
        })
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters')
    ,
    check('type')
        .exists({ checkFalsy: true })
        .withMessage('State is required')
        .custom((value, { req }) => {
            return value === "Online" || value === "In person"
        })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .isDecimal([{ decimal_digits: '2' }])
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('startDate')
        .isAfter()
        .withMessage("Start date must be in the future"),
    check('endDate')
        .isAfter()
        .custom((value, { req }) => {
            return value > req.body.startDate
        })
        .withMessage('End date is less than start date'),

    handleValidationErrors
];



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








router.put("/:eventId", requireAuth, grabCurrentUser, validateEvent, async (req, res, next) => {
    let id = req.currentUser.data.id
    let eventId = req.params.eventId
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;


    let venue = await Venue.findByPk(parseInt(venueId))

    if (venue) { console.log(true) }
    else {
        const err = new Error()
        err.message = "Venue couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)

    }



    const event = await Event.findByPk(eventId, {
        include: [{
            model: Group,
            include: {
                model: Membership,
                where: {
                    status: "co-host",
                    userId: id
                },
                required: false
            }
        }],
        attributes: {
            exclude: ["createdAt",
                "updatedAt"]
        }
    })

    if (!event) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }


    let oI = event.toJSON().Group.organizerId

    if (event.toJSON().Group.Memberships[0] || oI === id) {
        event.venueId = venueId,
            event.name = name,
            event.type = type,
            event.capacity = capacity,
            event.price = price,
            event.description = description,
            event.startDate = startDate,
            event.endDate = endDate


        delete event.dataValues.Group

        await event.save();

        res.json(event)


    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }



    // const groupInfo = await Group.findByPk(groupId);

    // if (!groupInfo) {
    //     const err = new Error()
    //     err.message = "Group couldn't be found"
    //     err.title = "Resource Not Found"
    //     err.status = 404
    //     return next(err)
    // }


    // trimmedGI = groupInfo.toJSON()




    // const cohost = await Membership.findOne(
    //     {
    //         where: {
    //             [Op.and]: [{ userId: id }, { status: "co-host" }, { groupId: groupId }]
    //         }
    //     }

    // )



    // //do the thing

    // if ((trimmedGI.organizerId === id) || cohost) {


    //     newEvent = Event.build({
    //         venueId,
    //         name,
    //         type,
    //         capacity,
    //         price,
    //         description,
    //         startDate,
    //         endDate,
    //         groupId: parseInt(groupId)
    //     })


    //     await newEvent.save()


})




















module.exports = router;
