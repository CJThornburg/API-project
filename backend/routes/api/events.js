const express = require('express');
const { Event, Group, Venue, EventImage, Attendance, Membership, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const { Op } = require('sequelize')
const { dateF, priceF } = require('../../utils/date')

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
        .custom(async (price, { req }) => {
            price = price.toString().split('.');
            if (price[1].length > 2 || Number(price[0]) < 0)
                throw new Error('Please provide a valid price')
        }),
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

const validateNewEventImage = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage('url is required'),
    check('preview')
        .isBoolean()
        .withMessage('preview must be "true" or "false')
        .exists()
        .withMessage('preview is required'),
    handleValidationErrors
];




const validateQuery = [
    check('page')
        .custom(async (value, { req }) => {
            let { page } = req.query

            if (page) {
                if (parseInt(page) < 1) {
                    throw new Error("Page must be greater than or equal to 1")
                }
            }
        }),
    check('size')
        .custom(async (value, { req }) => {
            let { size } = req.query

            if (size) {
                if (parseInt(size) < 1) {
                    throw new Error("Size must be greater than or equal to 1")
                }
            }
        }),
    check('name')
        .custom(async (value, { req }) => {
            let { name } = req.query

            if (name) {
                if (typeof name !== "string") {
                    throw new Error("name must be a string")
                }
            }
        }),

    check('type')
        .custom((value, { req }) => {
            let { type } = req.query
            if (!type) return true
            if (type) {
                return type === "Online" || type === "In person"
            }
        })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('startDate')
        .custom(async (value, { req }) => {
            let { startDate } = req.query


            if (startDate) {


                const date = new Date(startDate)





                if (date.toDateString() === "Invalid Date") {
                    throw new Error("must be a valid datetime")
                }
            }
        }),





    handleValidationErrors
];

router.get("/", validateQuery, async (req, res) => {

    let { page, size, name, type, startDate } = req.query

    page = parseInt(page)
    size = parseInt(size)

    let defaultPage = 1;
    let defaultSize = 20;


    if (page <= 0 || isNaN(page)) {
        page = defaultPage
    }

    if (page > 10) {
        page = defaultPage
    }

    if (isNaN(size) || size <= 0) {
        size = defaultSize
    }
    //if there is a size limit:
    if (size > 20) size = defaultSize
    const pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);




    const where = {};


    if (name && typeof name === "string") {
        where.name = name
    }

    if (type && (type === "Online" || type === "In person")) {
        where.type = type;
    }

    if (startDate) {
        // const dateObj = new Date(startDate)

        const timeMs = new Date(startDate).getTime()
        // dateIso = date.toISOString()

        // 86,400,000
        let min = (timeMs - 86400000)
        let max = (timeMs + 86400000)


        where.startNum = { [Op.between]: [min, max] }
    }



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
        ],
        attributes: ["id",
            "groupId",
            "venueId",
            "name",
            "type",
            "startDate",
            "endDate"],
        where,
        ...pagination
    })


    for (let i = 0; i < events.length; i++) {
        events[i].dataValues.startDate = dateF(events[i].dataValues.startDate)
        events[i].dataValues.endDate = dateF(events[i].dataValues.endDate)



        const eventPre = await EventImage.findOne({ where: { preview: true, eventId: events[i].dataValues.id } })
        if (eventPre) {
            events[i].dataValues.previewImage = eventPre.dataValues.url
        } else {
            events[i].dataValues.previewImage = null
        }
    }



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
            exclude: ["createdAt", "updatedAt", "startNum", "endNum"]
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
    event.dataValues.startDate = dateF(event.dataValues.startDate)
    event.dataValues.endDate = dateF(event.dataValues.endDate)







    event.dataValues.price = priceF(event.dataValues.price)











    res.json(event)
})





router.post("/:eventId/images", requireAuth, grabCurrentUser, validateNewEventImage, async (req, res, next) => {
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

    const group = event.dataValues.groupId
    const groupOwner = await Group.findOne({ where: { id: group, organizerId: id } })
    console.log(event.toJSON())
    console.log(groupOwner)
    if (permissionCheck || groupOwner) {
        let newEventImage = EventImage.build({
            url,
            preview,
            eventId: parseInt(eventId)

        })
        await newEventImage.save()
        delete newEventImage.dataValues.eventId
        delete newEventImage.dataValues.updatedAt
        delete newEventImage.dataValues.createdAt
        return res.json(newEventImage)
    } else {
        const err = new Error()
        err.status = 403
        err.title = "Forbidden"
        err.message = "Forbidden"
        return next(err)
    }


})








router.put("/:eventId", requireAuth, grabCurrentUser, validateEvent, async (req, res, next) => {

    let id = req.currentUser.data.id
    let eventId = req.params.eventId
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;


    let venue = await Venue.findByPk(parseInt(venueId))

    if (!venue) {

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
        event.startNum = new Date(startDate).getTime()
        event.endNum = new Date(endDate).getTime()

        delete event.dataValues.Group

        await event.save();


        event.dataValues.price = priceF(price)
        delete event.dataValues.endNum
        delete event.dataValues.startNum
        delete event.dataValues.updatedAt
        delete event.dataValues.createdAt
        event.dataValues.startDate = dateF(event.dataValues.startDate)
        event.dataValues.endDate = dateF(event.dataValues.endDate)


        res.json(event)



    } else {
        const err = new Error()
        err.status = 403
        err.title = "Forbidden"
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
        err.title = "Forbidden"
        err.message = "Forbidden"
        return next(err)


    }

})




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        console.log(aten[i].dataValues.status)
        delete aten[i].dataValues.status


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
        err.title = "Resource could not be found"
        err.status = 404
        return next(err)
    }


    const statusCheck = await Attendance.findOne({ where: { eventId: eventId, userId: id } })
    if (statusCheck) {


        if (statusCheck.dataValues.status === "pending") {
            const err = new Error()
            err.message = "Attendance has already been requested"
            err.status = 400
            err.title = "Bad Request"
            return next(err)
        }

        if (statusCheck.dataValues.status === "attending" || statusCheck.dataValues.status === "co-host" || statusCheck.dataValues.status === "host") {
            const err = new Error()
            err.message = "User is already an attendee of the event"
            err.status = 400
            err.title = "Bad request"
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
        err.title = "Bad request"
        return next(err)
    }


    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.title = "Resource could not be found"
        err.status = 404
        return next(err)
    }

    const groupId = eventCheck.dataValues.groupId

    const attendance = await Attendance.findOne({ where: { eventId: eventId, userId: userId } })
    if (!attendance) {
        const err = new Error()
        err.title = "Resource could not be found"
        err.message = "Attendance between the user and the event does not exist"
        err.status = 404
        return next(err)
    }

    console.log("hiiiiiii attendance querey:", attendance)

    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.title = "Resource could not be found"
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
        err.title = "Auth"
        err.message = "Forbidden"
        return next(err)
    }

    // attendance.dataValues.status = "attending"
    // await attendance.save()

    attendance.set({
        status: "attending"
    })
    attendance.save();
    console.log("hi")

    delete attendance.dataValues.createdAt
    delete attendance.dataValues.updatedAt
    res.json(attendance)
})



router.delete("/:eventId/attendance", requireAuth, grabCurrentUser, async (req, res, next) => {
    let id = req.currentUser.data.id
    let eventId = req.params.eventId
    const userId = req.body.userId


    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        const err = new Error()
        err.message = "Event couldn't be found"
        err.title = "Resource could not be found"
        err.status = 404
        return next(err)
    }


    const groupId = eventCheck.dataValues.groupId




    const attendance = await Attendance.findOne({ where: { eventId: eventId, userId: userId } })
    if (!attendance) {
        const err = new Error()
        err.message = "Attendance does not exist for this User"
        err.tittle = "Not found"
        err.status = 404
        return next(err)
    }



    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource could not be found"
        err.status = 404
        return next(err)
    }


    let owner = groupCheck.toJSON().organizerId === id
    let currentUser = userId === id

    if (!owner && !currentUser) {
        const err = new Error()
        err.status = 403
        err.title = "Auth"
        err.message = "Only the User or organizer may delete an Attendance"
        return next(err)
    }

    await attendance.destroy()

    return res.json({
        "message": "Successfully deleted attendance from event"
    })

})
module.exports = router;
