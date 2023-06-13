const express = require('express');
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, grabCurrentUser } = require('../../utils/auth');




router.get("/", (req, res) => {

    res.json("hi")
})






















module.exports = router;
