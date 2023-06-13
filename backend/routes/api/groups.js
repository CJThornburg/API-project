const express = require('express');
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const group = require('../../db/models/group');



const validateSignup = [
    // check('email')
    //   .exists({ checkFalsy: true })
    //   .isEmail()
    //   .withMessage('Please provide a valid email.'),

    handleValidationErrors
];



router.get("/", async (req, res) => {

    const groups = await Group.findAll()



    for (let i = 0; i < groups.length; i++) {

        const member = await groups[i].getMemberships()
        const count = member.length



        groups[i].dataValues.numMembers = count
        const preImage = await GroupImage.findOne({ where: { id: i, preview: true } })
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
    res.status(404)
    return res.json(
        err
    )

})






















module.exports = router;
