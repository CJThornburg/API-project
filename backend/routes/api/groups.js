const express = require('express');
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const group = require('../../db/models/group');
const { Op } = require('sequelize')



const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be provided')
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters or less')
    ,
    check('about')
        .exists({ checkFalsy: true })
        .withMessage('About must be provided')
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .custom((value, { req }) => {
            return value === "Online" || value === "In person"
        })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .withMessage("private option must be selected")
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is Required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('state is Required'),
    handleValidationErrors
];

const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .custom((value, { req }) => {
            return value >= -90 && value <= 90
        })
        .withMessage("Latitude is not valid"),
    check('lng')
        .custom((value, { req }) => {
            return value >= -180 && value <= 180
        })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];

const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage('VenueId is required')
        .custom((value, { req }) => {
            let venue = Venue.findByPk(parseInt(value))
            if (venue) return true
            else return false
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

    const groups = await Group.findAll()



    for (let i = 0; i < groups.length; i++) {

        const member = await groups[i].getMemberships()
        const count = member.length



        groups[i].dataValues.numMembers = count
        const preImage = await GroupImage.findOne({ where: { id: groups[i].dataValues.id, preview: true } })
        if (preImage) {
            let trimmed = preImage.toJSON()
            groups[i].dataValues.previewImage = trimmed.url
        } else {
            groups[i].dataValues.previewImage = null
        }

    }








    return res.json({
        groups
    })
})


const addGroupInfo = async () => {

    for (let i = 0; i < groups.length; i++) {

        const member = await groups[i].getMemberships()
        const count = member.length



        array[i].dataValues.numMembers = count
        const preImage = await GroupImage.findOne({ where: { id: groups[i].dataValues.id, preview: true } })
        if (preImage) {
            let trimmed = preImage.toJSON()
            array[i].dataValues.previewImage = trimmed.url
        } else {
            array[i].dataValues.previewImage = null
        }

    }
}



router.get("/current", requireAuth, grabCurrentUser, async (req, res) => {



    const addGroups = new Set()

    let id = req.currentUser.data.id
    const groups = await Group.findAll(
        { where: { organizerId: id } }
    )



    const memberOf = await Membership.findAll({ where: { userId: id } })



    // groupsCompleted = addGroupInfo(groups)
    // memberOfCompleted = addGroupInfo(memberOf)


    for (let i = 0; i < groups.length; i++) {

        const member = await groups[i].getMemberships()
        const count = member.length



        groups[i].dataValues.numMembers = count
        addGroups.add(groups[i].dataValues.id)
        const preImage = await GroupImage.findOne({ where: { id: groups[i].dataValues.id, preview: true } })
        if (preImage) {
            let trimmed = preImage.toJSON()
            groups[i].dataValues.previewImage = trimmed.url
        } else {
            groups[i].dataValues.previewImage = null
        }

    }

    for (let i = 0; i < memberOf.length; i++) {

        if (!addGroups.has(memberOf[i].groupId)) {
            let group = await Group.findOne({ where: { id: memberOf[i].groupId } })
            const member = await group.getMemberships()
            const count = member.length
            group.dataValues.numMembers = count
            const preImage = await GroupImage.findOne({ where: { id: groups[i].dataValues.id, preview: true } })
            if (preImage) {
                let trimmed = preImage.toJSON()
                group.dataValues.previewImage = trimmed.url
            } else {
                group.dataValues.previewImage = null
            }

            groups.push(group)
        }



    }



    return res.json({
        groups,

    })
})






router.get("/:groupId", async (req, res, next) => {
    const { groupId } = req.params


    const group = await Group.findByPk(groupId, {

        include: [
            {
                model: GroupImage,
                attributes: {
                    exclude: ["groupId", "createdAt", "updatedAt"]
                }
            },
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            { model: Venue },

        ]

    })

    if (group) {

        let trimmedGroup = group.toJSON()
        const member = await group.getMemberships()
        const count = member.length
        trimmedGroup.numMembers = count
        trimmedGroup.Organizer = trimmedGroup.User
        delete trimmedGroup.User


        return res.json(
            trimmedGroup
        )
    }
    const err = new Error()
    err.message = "Group couldn't be found"
    err.status = 404
    next(err)

})







router.post("/", requireAuth, grabCurrentUser, validateNewGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body

    let id = req.currentUser.data.id

    const exist = await Group.findOne({ where: { name: name } })

    let newGroup
    if (!exist) {
        newGroup = Group.build({
            name,
            about,
            type,
            private,
            city,
            state,
            organizerId: id
        })

        await newGroup.save()

    } else {
        const err = new Error()
        err.message = "This group already exists :("
        err.status = 400
        next(err)
    }


    return res.json(
        newGroup
    )

})





router.put("/:groupId", requireAuth, grabCurrentUser, validateNewGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    let id = req.currentUser.data.id
    const groupId = req.params.groupId

    const groupInfo = await Group.findByPk(groupId);
    if (!groupInfo) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }

    const trimmedGI = groupInfo.toJSON()
    if (trimmedGI.organizerId === id) {
        groupInfo.name = name;
        groupInfo.about = about;
        groupInfo.type = type;
        groupInfo.private = private;
        groupInfo.city = city;
        groupInfo.state = state;

        await groupInfo.save();
        const updatedGroupInfo = await Group.findByPk(groupId);
        return res.json(updatedGroupInfo)
    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }



})



router.delete("/:groupId", requireAuth, grabCurrentUser, async (req, res, next) => {
    let id = req.currentUser.data.id
    const groupId = req.params.groupId


    const groupInfo = await Group.findByPk(groupId);
    if (!groupInfo) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        next(err)
    }
    const trimmedGI = groupInfo.toJSON()

    if (trimmedGI.organizerId === id) {

        const hi = await groupInfo.destroy()
        console.log(hi)

        res.json({
            "message": "Successfully deleted"
        })
    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


})



router.get("/:groupId/venues", requireAuth, grabCurrentUser, async (req, res, next) => {
    let id = req.currentUser.data.id
    const groupId = req.params.groupId




    const groupInfo = await Group.findByPk(groupId, {
        include: [
            { model: Venue },

        ]
    });
    if (!groupInfo) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        next(err)
    }
    const trimmedGI = groupInfo.toJSON()

    const cohost = await Membership.findOne(
        {
            where: {
                [Op.and]: [{ userId: id }, { status: "co-host" }, { groupId: groupId }]
            }
        }

    )



    if ((trimmedGI.organizerId === id) || cohost) {
        let returnObj = {}
        returnObj.Venues = groupInfo.Venues
        res.json(returnObj)

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


})


router.post("/:groupId/venues", requireAuth, grabCurrentUser, validateVenue, async (req, res, next) => {
    let id = req.currentUser.data.id
    const groupId = req.params.groupId
    const { address, city, state, lat, lng } = req.body

    const groupInfo = await Group.findByPk(groupId);

    if (!groupInfo) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }


    trimmedGI = groupInfo.toJSON()


    const cohost = await Membership.findOne(
        {
            where: {
                [Op.and]: [{ userId: id }, { status: "co-host" }, { groupId: groupId }]
            }
        }

    )


    if ((trimmedGI.organizerId === id) || cohost) {

        newVenue = Venue.build({
            address,
            city,
            state,
            lat,
            lng,
            groupId: parseInt(groupId)
        })


        await newVenue.save()

        newVenue = newVenue.toJSON()
        delete newVenue.createdAt
        delete newVenue.updatedAt


        res.json(newVenue)

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }



})


router.get("/:groupId/events", async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);
    console.log(group)
    if (!group) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }

    const events = await Event.findAll(
        {
            where: { groupId: groupId },
            include: [
                {
                    model: Group,
                    attributes: ["id", "name", "city", "state"]
                },
                { model: Attendance },

                // {
                // currently breaks code by making whole query return []
                //     model: EventImage,
                //     where: { preview: true },
                // },
                {
                    model: Venue,
                    attributes: ["id", "city", "state"]
                }
            ],
            attributes: { exclude: ["createdAt", "updatedAt", "capacity", "price", "description"] }

        })

    // console.log(events)




    for (let i = 0; i < events.length; i++) {
        let event = events[i].toJSON()
        let count = event.Attendances.length
        events[i].dataValues.numAttending = count
        delete events[i].dataValues.Attendances

        const eventImg = await EventImage.findOne({
            where: {
                preview: true,
                eventId: event.id
            },
        })
        if (eventImg) {
            let url = eventImg.url
            events[i].dataValues.preImage = url
        } else {
            events[i].dataValues.previewImage = null
        }


    }


    let returnObj = {}
    returnObj.Events = events

    res.json(returnObj)
})



router.post("/:groupId/events", requireAuth, grabCurrentUser, validateEvent, async (req, res, next) => {
    let id = req.currentUser.data.id
    const groupId = req.params.groupId
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const groupInfo = await Group.findByPk(groupId);

    if (!groupInfo) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }


    trimmedGI = groupInfo.toJSON()




    const cohost = await Membership.findOne(
        {
            where: {
                [Op.and]: [{ userId: id }, { status: "co-host" }, { groupId: groupId }]
            }
        }

    )



    //do the thing

    if ((trimmedGI.organizerId === id) || cohost) {


        newEvent = Event.build({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
            groupId: parseInt(groupId)
        })


        await newEvent.save()

        let dec = newEvent.dataValues.price.toString().split(".")
        //dont think I need to do this, seems like it is something postman is doing
        if (dec[1]) {
            if (dec[1].length === 1) {
                dec[1] += "0"
                console.log(dec)
                const decF = dec.join(".")
                console.log(decF)
                newEvent.dataValues.price = Number(decF)
            }
        }



        res.json(newEvent)

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }




})

module.exports = router;
