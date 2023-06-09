const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models')
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// middleware to check body if it even holds the right params needed for the route
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];


// login user
router.post('/', validateLogin, async (req, res, next) => {
    //credential will be email or username
    const { credential, password } = req.body;

    // unscoped removed the default scope options
    // an return if username matched cred or email matches cred
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    // if user was not found or if bcrypt hashes password and does not match throw an error
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
    }

    // gets to this point know the user should be could so save user objet
    //! but with only the id, email and username
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };

    // pass in res and safeUser "obj" so token can be added to res, remember this just has id, email and username
    await setTokenCookie(res, safeUser);

    // return safeuser objet
    return res.json({
        user: safeUser
    });
}
);




// log out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
}
);


// api/session get
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            fistName: user.firstName,
            lastName: user.lastName
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
}
);





module.exports = router;
