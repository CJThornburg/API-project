const express = require('express');
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const { Op } = require('sequelize');
const { dateF } = require('../../utils/date')



const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be provided')
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters or less')
        .custom(async (value, { req }) => {
            const group = await Group.findOne({ where: { name: req.body.name } })

            if (group) {
                throw new Error('Group already exist');
            }
        })
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

const validateUpdateGroup = [
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


const validateMemberUpdate = [
    check('memberId')
        .exists({ checkFalsy: true })
        .withMessage('memberId is required')
    // .custom(async (value, { req }) => {
    //     const userCheck = await User.findByPk(req.body.memberId)

    //     if (!userCheck) {
    //         throw new Error("User couldn't be found");
    //     }
    // })
    ,
    check('status')
        .exists({ checkFalsy: true })
        .custom(async (value, { req }) => {
            if (req.body.status === "pending") {
                throw new Error("Cannot change a membership status to pending");
            }

        })
        .withMessage('Cannot change a membership status to pending')
    ,
    handleValidationErrors
];

const validateMemberDelete = [
    check('memberId')
        .exists({ checkFalsy: true })
        .withMessage('memberId is required')
        .custom(async (value, { req }) => {
            const userCheck = await User.findByPk(req.body.memberId)

            if (!userCheck) {
                throw new Error("User couldn't be found");
            }
        }),
    handleValidationErrors
];

const validateNewGroupImage = [
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



router.get("/", async (req, res) => {

    const groups = await Group.findAll()



    for (let i = 0; i < groups.length; i++) {

        const member = await groups[i].getMemberships()
        const count = member.length
        groups[i].dataValues.createdAt = dateF(groups[i].dataValues.createdAt)
        groups[i].dataValues.updatedAt = dateF(groups[i].dataValues.updatedAt)


        groups[i].dataValues.numMembers = count
        const preImage = await GroupImage.findOne({ where: { id: groups[i].dataValues.id, preview: true } })
        if (preImage) {
            let trimmed = preImage.toJSON()
            groups[i].dataValues.previewImage = trimmed.url
        } else {
            groups[i].dataValues.previewImage = null
        }

    }

    let Groups = groups
    return res.json({
        Groups
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


        console.log(groups[i])
        groups[i].dataValues.createdAt = dateF(groups[i].dataValues.createdAt)
        groups[i].dataValues.updatedAt = dateF(groups[i].dataValues.updatedAt)
        groups[i].dataValues.numMembers = count
        addGroups.add(groups[i].dataValues.id)
        const preImage = await GroupImage.findOne({ where: { id: groups[i].toJSON().id, preview: true } })
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
            const preImage = await GroupImage.findOne({ where: { id: memberOf[i].toJSON().id, preview: true } })
            if (preImage) {
                let trimmed = preImage.toJSON()
                group.dataValues.previewImage = trimmed.url
            } else {
                group.dataValues.previewImage = null
            }

            groups.push(group)
        }



    }




    let Groups = groups
    return res.json({
        Groups,

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
    return next(err)

})







router.post("/", requireAuth, grabCurrentUser, validateNewGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body

    let id = req.currentUser.data.id

    const exist = await Group.findOne({ where: { name: name } })


    if (!exist) {
        let newGroup = Group.build({
            name,
            about,
            type,
            private,
            city,
            state,
            organizerId: id
        })

        await newGroup.save()

        let grabNewGroup = await Group.findOne({ where: { name: name } })

        let newMember = await Membership.build({
            userId: id,
            groupId: grabNewGroup.dataValues.id,
            status: "co-host"
        })

        await newMember.save()
        newGroup.dataValues.createdAt = dateF(newGroup.dataValues.createdAt)
        newGroup.dataValues.updatedAt = dateF(newGroup.dataValues.updatedAt)
        return res.json(
            newGroup
        )


    } else {
        const err = new Error()
        err.message = "This group already exists :("
        err.status = 400
        return next(err)
    }



})





router.put("/:groupId", requireAuth, grabCurrentUser, validateUpdateGroup, async (req, res, next) => {
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
        updatedGroupInfo.dataValues.createdAt = dateF(updatedGroupInfo.dataValues.createdAt)
        updatedGroupInfo.dataValues.updatedAt = dateF(updatedGroupInfo.dataValues.updatedAt)
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
        return next(err)
    }
    const trimmedGI = groupInfo.toJSON()

    if (trimmedGI.organizerId === id) {

        await groupInfo.destroy()


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

                {
                    model: Venue,
                    attributes: ["id", "city", "state"]
                }
            ],
            attributes: { exclude: ["createdAt", "updatedAt", "capacity", "price", "description", "startNum", "endNum"] }

        })






    for (let i = 0; i < events.length; i++) {
        let event = events[i].toJSON()
        let count = event.Attendances.length
        events[i].dataValues.numAttending = count
        delete events[i].dataValues.Attendances
        events[i].dataValues.startDate = dateF(events[i].dataValues.startDate)
        events[i].dataValues.endDate = dateF(events[i].dataValues.endDate)

        const previewI = await EventImage.findOne({ where: { eventId: event.id, preview: true } })

        if (previewI) {

            let url = previewI.dataValues.url

            events[i].dataValues.previewImage = url
        }
        else { events[i].dataValues.previewImage = null }
        delete events[i].dataValues.EventImages
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


        let newEvent = Event.build({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
            startNum: new Date(startDate).getTime(),
            endNum: new Date(endDate).getTime(),
            groupId: parseInt(groupId)
        })


        await newEvent.save()

        let dec = newEvent.dataValues.price.toString().split(".")

        if (dec[1]) {
            if (dec[1].length === 1) {
                dec[1] += "0"

                const decF = dec.join(".")
                console.log(decF)
                newEvent.dataValues.price = Number(decF)
            }
        }


        let newAttendance = await Attendance.build({
            eventId: newEvent.dataValues.id,
            userId: id,
            status: "host"

        })

        await newAttendance.save()


        delete newEvent.dataValues.startNum
        delete newEvent.dataValues.endNum
        delete newEvent.dataValues.updatedAt
        delete newEvent.dataValues.createdAt





        newEvent.dataValues.startDate = dateF(newEvent.dataValues.startDate)
        newEvent.dataValues.endDate = dateF(newEvent.dataValues.endDate)
        res.json(newEvent)

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


})


router.get("/:groupId/members", grabCurrentUser, async (req, res, next) => {
    const { groupId } = req.params;
    let id
    if (req.currentUser.data.id) {
        id = req.currentUser.data.id
    }


    let group = await Group.findByPk(groupId)

    if (!group) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        next(err)
    }
    let groupOwner = group.organizerId

    let roster
    // ig owner
    if (groupOwner === id && id) {

        roster = await Group.findByPk(groupId, {
            include: [
                {
                    model: Membership,
                    attributes: ["status", "userId"]



                }],
            attributes: []
        })

    } else {
        // if any other user
        roster = await Group.findByPk(groupId, {
            include: [
                {
                    model: Membership,
                    where: { [Op.or]: [{ status: "member" }, { status: "co-host" }] },
                    attributes: ["status", "userId"]



                }],
            attributes: []
        })

    }



    let trimmedRoster = roster.toJSON()
    let members = trimmedRoster.Memberships
    trimmedRoster.Members = members
    delete trimmedRoster.Memberships



    // if owner


    for (let i = 0; i < trimmedRoster.Members.length; i++) {
        trimmedRoster.Members[i].Membership = { status: trimmedRoster.Members[i].status }
        delete trimmedRoster.Members[i].status
        let userId = trimmedRoster.Members[i].userId
        const user = await User.findByPk(userId);
        let trimmedUser = user.toJSON()

        trimmedRoster.Members[i].id = trimmedUser.id
        trimmedRoster.Members[i].firstName = trimmedUser.firstName
        trimmedRoster.Members[i].lastName = trimmedUser.lastName
        delete trimmedRoster.Members[i].userId
    }


    res.json(trimmedRoster)
})





router.post("/:groupId/membership", requireAuth, grabCurrentUser, async (req, res, next) => {

    id = req.currentUser.data.id
    const { groupId } = req.params




    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        return next(err)
    }
    const memCheck = await Membership.findOne({ where: { userId: id, groupId: groupId } })


    if (memCheck) {

        if (memCheck.status === "pending") {
            const err = new Error()
            err.message = "Membership has already been requested"
            err.status = 400
            return next(err)
        }
        if (memCheck.status === "member") {
            const err = new Error()
            err.message = "User is already a member of the group"
            err.status = 400
            return next(err)
        }
        if (memCheck.status === "host") {
            const err = new Error()
            err.message = "User is already a host of the group"
            err.status = 400
            return next(err)
        }
        if (memCheck.status === "co-host") {
            const err = new Error()
            err.message = "User is already a co-host of the group"
            err.status = 400
            return next(err)
        }

    }

    newMember = Membership.build({
        userId: id,
        groupId,
        status: "pending"
    })

    await newMember.save()
    let trimmedMember = newMember.toJSON()




    const returnObj =
    {
        memberId: trimmedMember.id,
        status: trimmedMember.status
    }

    res.json(
        returnObj
    )
})



router.put("/:groupId/membership", requireAuth, grabCurrentUser, validateMemberUpdate, async (req, res, next) => {

    id = req.currentUser.data.id
    const { groupId } = req.params

    const { memberId, status } = req.body


    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        return next(err)
    }
    const memberCheck = await Membership.findOne({ where: { userId: memberId, groupId: groupId } })
    if (!memberCheck) {
        const err = new Error()
        err.message = "Membership between the user and the group does not exist"
        err.status = 404
        return next(err)
    }

    // group if owner
    // grab if co-host
    // let organizerId = groupCheck.toJSON().organizerId
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

    let memberCheckTrimmed = memberCheck.toJSON()

    if (status === "co-host") {
        if (owner) {
            memberCheck.status = "co-host"

            await memberCheck.save()

            memberCheck.dataValues.memberId = memberId
            delete memberCheck.dataValues.userId
            delete memberCheck.dataValues.createdAt
            delete memberCheck.dataValues.updatedAt

            return res.json(memberCheck)
        } else {
            const err = new Error()
            err.status = 403
            err.message = "Forbidden"
            return next(err)
        }

    }

    if (status === "member") {
        if (owner || coHostCheck) {
            memberCheck.status = "member"

            await memberCheck.save()

            memberCheck.dataValues.memberId = memberId
            delete memberCheck.dataValues.userId
            delete memberCheck.dataValues.createdAt
            delete memberCheck.dataValues.updatedAt

            delete memberCheck.dataValues.updatedAt

            delete memberCheck.dataValues.createdAt

            return res.json(memberCheck)
        } else {
            const err = new Error()
            err.status = 403
            err.message = "Forbidden"
            return next(err)
        }

    }






})

router.delete("/:groupId/membership", requireAuth, grabCurrentUser, validateMemberDelete, async (req, res, next) => {

    id = req.currentUser.data.id
    const { groupId } = req.params

    const { memberId } = req.body

    const groupCheck = await Group.findByPk(groupId)
    if (!groupCheck) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.status = 404
        return next(err)
    }

    let owner = groupCheck.toJSON().organizerId === id


    const memberCheck = await Membership.findOne({ where: { userId: memberId, groupId: groupId } })
    if (!memberCheck) {
        const err = new Error()
        err.message = "Membership does not exist for this User"
        err.status = 404
        return next(err)
    }
    let member = memberCheck.toJSON().userId === id


    if (owner || member) {
        await memberCheck.destroy();

        res.json({
            "message": "Successfully deleted membership from group"
        })

    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }
})



router.post("/:groupId/images", requireAuth, grabCurrentUser, validateNewGroupImage, async (req, res, next) => {
    const { url, preview } = req.body
    let id = req.currentUser.data.id
    let groupId = req.params.groupId



    const group = await Group.findByPk(groupId)
    if (!group) {
        const err = new Error()
        err.message = "Group couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }

    const ownerCheck = id === group.dataValues.organizerId

    // attendy, host, co-host of the event so essentialy have to have attended lol


    if (ownerCheck) {
        let newGroupImage = GroupImage.build({
            url,
            preview,
            groupId: parseInt(groupId)

        })
        await newGroupImage.save()
        delete newGroupImage.dataValues.updatedAt
        delete newGroupImage.dataValues.createdAt
        return res.json(newGroupImage)
    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


})


module.exports = router;
