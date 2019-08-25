const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(403).json({
        error: "Error is taken"
    })
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({
        message: "Signup successful. Please login."
    })
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    // if error or no user
    User.findOne({ email }, (err, user) => {
        // if error or user is not found
        if (err || !user) {
            return res.status(401).json({
                error: `User with ${email} does not exist. Please signin.`
            })
        }
        // if user is found then make sure email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: `Email and password do not match.`
            })
        }
        // generate a token with userid and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({
            token, user: { _id, email, name }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({
        message: "Signed out"
    })
}

exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
    // in an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})