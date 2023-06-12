const express = require('express');
const { Group, GroupImage } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



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






























module.exports = router;
