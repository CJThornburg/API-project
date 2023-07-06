const express = require('express');
const { EventImage, Group, Membership, Event } = require('../../db/models');
const router = express.Router();

const { requireAuth, grabCurrentUser } = require('../../utils/auth');




router.delete("/:imageId", requireAuth, grabCurrentUser, async (req, res, next) => {
    const { imageId } = req.params
    let id = -1
 
    // grab image
    const delImage = await EventImage.findByPk(imageId)
    if (!delImage) {
        const err = new Error()
        err.message = "Event Image couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }


    const event = await Event.findByPk(delImage.dataValues.eventId)



    let groupId = event.dataValues.groupId

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
