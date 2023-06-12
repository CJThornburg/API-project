const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is Required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is Required'),
  handleValidationErrors
];


// create user account
router.post('/', validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  //save password
  const hashedPassword = bcrypt.hashSync(password);
  // const userCheck = await User.findOne({
  //   where: { "username": username }
  // })


  // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", userCheck)'abor


  user = await User.create({ email, username, hashedPassword, firstName, lastName });




  // need to make safe user obj to pass to setTokenCookie function

  // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", user)
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    lastName: user.lastName,
    firstName: user.firstName
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}
);




module.exports = router;
