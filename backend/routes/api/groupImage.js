const express = require('express');
const { GroupImage, Group, Membership } = require('../../db/models');
const router = express.Router();

const { requireAuth, grabCurrentUser } = require('../../utils/auth');




router.delete("/:imageId", requireAuth, grabCurrentUser, async (req, res, next) => {
    const { imageId } = req.params
    let id = req.currentUser.data.id

    // grab image
    const delImage = await GroupImage.findByPk(imageId)
    if (!delImage) {
        const err = new Error()
        err.message = "Group Image couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }

    let groupId = delImage.dataValues.groupId

    // grab group id
    // q group
    const group = await Group.findByPk(groupId)


    // check if
    const ownerCheck = id === group.dataValues.organizerId

    
    //q membership based on current user
    //grab if co-host
    const coHost = await Membership.findOne({ where: { groupId: groupId, userId: id, status: "co-host" } })


    if (!ownerCheck && !coHost) {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }


    await delImage.destroy();


    res.json({
        "message": "Successfully deleted"
    })


})











module.exports = router;
