const express = require('express');
const { Venue, Group, Membership } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');
const { Op } = require('sequelize')




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
        .isDecimal()
        .withMessage("Latitude is not valid"),
    check('lng')
        .custom((value, { req }) => {
            return value >= -180 && value <= 180
        })
        .isDecimal()
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];


router.put("/:venueId", requireAuth, grabCurrentUser, validateVenue, async (req, res, next) => {
    let id = req.currentUser.data.id
    const { venueId } = req.params
    const { address, city, state, lat, lng } = req.body


    const venueInfo = await Venue.findByPk(venueId, {
        include: [
            {
                model: Group,
                // include: [{
                //     model: Membership,
                //     // where: {

                //     //     userId: id,

                //     // }

                // }]

            }



        ]
    }
    )


    if (!venueInfo) {
        const err = new Error()
        err.message = "Venue couldn't be found"
        err.title = "Resource Not Found"
        err.status = 404
        return next(err)
    }
    let trimmedVI = venueInfo.toJSON()

    const cohost = await Membership.findOne(
        {
            where: {
                [Op.and]: [{ userId: id }, { status: "co-host" },
                { groupId: venueInfo.toJSON().Group.id }
                ]
            }
        }

    )



    let owner = trimmedVI.Group.organizerId
    // let cohost = trimmedVI.Group.Memberships[0].status


    if (cohost === "co-host" || owner === id) {
        venueInfo.address = address,
            venueInfo.city = city,
            venueInfo.state = state,
            venueInfo.lat = lat,
            venueInfo.lng = lng

        await venueInfo.save();
        const updatedVenueInfo = await Venue.findByPk(venueId)
        return res.json(updatedVenueInfo)
    } else {
        const err = new Error()
        err.status = 403
        err.message = "Forbidden"
        return next(err)
    }







})






















module.exports = router;
