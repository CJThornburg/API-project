const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config'); //pulls jdwConfig from config obj exported in from index
const { secret, expiresIn } = jwtConfig; //deconstructs secret and expiresIn from the above object

const { User } = require('../db/models'); //




// Sends a JWT Cookie:
const setTokenCookie = (res, user) => {
    // set the payload based on the query results by id,
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    // Creates the toke:
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie in the res so when client recieves it, will auto saved by browser
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};



const restoreUser = (req, res, next) => {
    const { token } = req.cookies; //token parsed from cookies in the req

    req.user = null;    // default req.user to null to prevent undefined errors



    return jwt.verify(token, secret, null, async (err, jwtPayload) => { // checks current token, throws error if invalid, if valid returns decoded payload
        if (err) {  //if not, they are just not signed in so can move on to the next middle ware
            return next();
        }

        try {
            const { id } = jwtPayload.data;  //sets id from payload.id
            req.user = await User.findByPk(id, {  //sear by id and return email cA and uA
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token'); // if error just go to next (defensive coding)
            return next();
        }

        if (!req.user) res.clearCookie('token'); //if id no longer exist,
       
        return next();
    });
};
//connected as global middleware to check to see if there is a signed in user


const requireAuth = function (req, _res, next) {
    if (req.user) return next(); //good to go so sends to next middleware

    const err = new Error("Authentication required"); //no currently logged in user
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}



module.exports = { setTokenCookie, restoreUser, requireAuth };
