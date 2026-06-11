import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export function createUser(req, res) {
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role
    })

    user.save().then(() => {
        res.json({
            message: "user created successfuly"
        })
    }).catch(() => {
        res.json({
            message: "Failed to create user"
        })
    })
}


export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;


    User.findOne({ email: email }).then((user) => {
        /*
        const rounds = bcrypt.getRounds(user.password)
        console.log("=====",rounds);
        */

        console.log("password:",password);
        console.log("password::",user.password);

        if (user === null) {
            res.status(404).json({
                message: "No user found"
            })
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if (isPasswordCorrect) {

                const token = jwt.sign({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    image: user.image
                },"jwt-secretKey")

                res.status(200).json({
                    message: "Login succeful",
                    token: token
                })
            } else {
                res.satus(404).json({
                    message: "Invalid password"
                })
            }

        }
    })
}
