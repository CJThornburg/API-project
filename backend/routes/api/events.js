const express = require('express');
const { Event, Group, Venue, EventImage, Attendance, Membership, User } = require('../../db/models');
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

            if (!venue) {
                throw new Error('Venue does not exist');
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


const validateAttenUpdate = [
    check('userId')
        .exists({ checkFalsy: true })
        .withMessage("userId is required"),
    check('status')
        .exists({ checkFalsy: true })
        .withMessage("status is required"),
        check('status')
        .custom((value, { req }) => {
           
            return value !== "pending"
        })
        .withMessage("Cannot change an attendance status to pending"),
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



})



router.delete("/:eventId", requireAuth, grabCurrentUser, async (req, res, next) => {
    let id = req.currentUser.data.id
    let eventId = req.params.eventId

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
        delete event.dataValues.Group
        await event.destroy()
        return res.json({
            "message": "Successfully deleted"
        })

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)


    }

})


router.get("/:eventId/attendees", grabCurrentUser, async (req, res, next) => {
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




    const group = await Group.findByPk(event.dataValues.groupId)
    const groupOwner = group.dataValues.organizerId
    const ownerCheck = id === groupOwner
    // console.log("id:", group.dataValues.id)

    let memberCheck = false;
    memberStatus = await Membership.findOne({ where: { userId: id, groupId: group.dataValues.id, status: "co-host" } })

    if (memberStatus) {
        memberCheck = true
    }
    // groupOwner  or host


    atenTest = await Attendance.findAll({
        where: { eventId: 22 },


    })


    if (ownerCheck || memberCheck) {
        aten = await Attendance.findAll({
            where: { eventId: eventId },
            attributes: ["status"],
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"],
                required: false
            }],

        })
    } else {
        aten = await Attendance.findAll({
            where: {
                eventId: eventId,
                [Op.or]: [{ status: "attending" }, { status: "waitlist" }, { status: "host" }, { status: "co-host" },]
            },
            attributes: ["status"],
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }],

        })

    }



    for (let i = 0; i < aten.length; i++) {



        aten[i].dataValues.firstName = aten[i].toJSON().User.firstName
        aten[i].dataValues.lastName = aten[i].toJSON().User.lastName
        aten[i].dataValues.id = aten[i].toJSON().User.id
        delete aten[i].dataValues.User
        aten[i].dataValues.Attendance = { status: aten[i].dataValues.status }
        delete aten[i].dataValues.status
        console.log(aten[i].toJSON())

    }

    const returnObj = { Attendees: aten }


    res.json(returnObj)










})






router.post("/:eventId/attendance", grabCurrentUser, async (req, res, next) => {
    let id = req.currentUser.data.id
    const { eventId } = req.params


    const eventCheck = await Event.findByPk(eventId)
    if (!eventCheck) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.status = 404
        return next(err)
    }


    const statusCheck = await Attendance.findOne({ where: { eventId: eventId, userId: id } })
    if (statusCheck) {


        if (statusCheck.dataValues.status === "pending") {
            const err = new Error()
            err.message = "Attendance has already been requested"
            err.status = 400
            return next(err)
        }

        if (statusCheck.dataValues.status === "attending" || statusCheck.dataValues.status === "co-host" || statusCheck.dataValues.status === "host") {
            const err = new Error()
            err.message = "User is already an attendee of the event"
            err.status = 400
            return next(err)
        }

    }


    const newAtten = await Attendance.build({
        userId: id,
        eventId,
        status: "pending"
    })

    await newAtten.save()

    delete newAtten.dataValues.updatedAt
    delete newAtten.dataValues.createdAt
    delete newAtten.dataValues.id
    delete newAtten.dataValues.eventId
    res.json(newAtten)
})



router.put("/:eventId/attendance", requireAuth, grabCurrentUser, validateAttenUpdate, async (req, res, next) => {
    let id = req.currentUser.data.id
    let eventId = req.params.eventId
    const { userId, status } = req.body

    if (status === "pending") {
        const err = new Error()
        err.message = "Cannot change an attendance status to pending"
        err.status = 400
        return next(err)
    }


    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        return next(err)
    }

    const groupId = eventCheck.dataValues.groupId


    console.log(groupId)

    const attendance = await Attendance.findOne({ where: { eventId: eventId, userId: userId } })
    if (!attendance) {
        const err = new Error()
        err.message = "Attendance between the user and the event does not exist"
        err.status = 404
        return next(err)
    }



    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        return next(err)
    }




    let owner = groupCheck.toJSON().organizerId === id

    const coHost = await Membership.findOne({ where: { userId: id, groupId: groupId } })

    let coHostCheck = false;
    if (coHost) {
        coHostCheck = coHost.toJSON().status === "co-host"
    }

    if (!owner && !coHostCheck) {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }

    attendance.dataValues.status = "attending"

    await attendance.save()

    delete attendance.dataValues.createdAt
    delete attendance.dataValues.updatedAt
    res.json(attendance)
})




module.exports = router;
