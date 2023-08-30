const { validate } = require('../models/userModel')
const userModel = require('../models/userModel')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const userValidator = require('./validators/userValidator')
const portfolioModel = require('../models/portfolioModel')

const userController = {

    register: async (req, res) => {
        const data = req.body

        const validationSchema = Joi.object({
            firstName: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).max(30).required(),
            password: Joi.string().required(),
        })

        const validationResult = validationSchema.validate(data, { abortEarly: false })
        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        const hash = await bcrypt.hash(data.password, 10)

        try {
            await userModel.create({
                firstName: data.firstName,
                email: data.email,
                password: hash,
                portfolio: []
            })
        } catch (err) {
            res.statusCode = 500
            console.log(err)
            return res.json({
                msg: "failed to create user"
            })
        }
        res.json()
    },

    login: async (req, res) => {
        // get login data from request body
        const data = req.body

        // validate the data
        // const validationSchema = Joi.object({
        //  name: Joi.string().min(3).max(100).required(),
        //     email: Joi.string().min(3).required(),
        //     password: Joi.string().required(),
        // })

        // const validationResult = validationSchema.validate(data)

        const validationResult = userValidator.loginSchema.validate(data)

        if (validationResult.error) {
            res.statusCode = 400

            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // find if user exists by the username (email)

        // if not exist, return log in error statusCode 400
        let user = null

        try {
            user = await userModel.findOne({ email: data.email })
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "error occured when fetching user"
            })
        }


        if (!user) {
            res.statusCode = 401
            return res.json({
                msg: "login failed. Pls check login details"
            })
        }

        // use bcrypt to compare given password against database record
        const validLogin = await bcrypt.compare(data.password, user.password)
        if (!validLogin) {
            res.statusCode = 401
            return res.json({
                msg: "login failed, pls check login details"
            })
        }

        // if fail, return status 401 (unauthorised)
        // generate JWT using external library
        const token = JWT.sign({
            firstName: user.firstName,
            email: user.email,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "10 days",
                audience: "FE",
                issuer: "BE",
                subject: user._id.toString(),
            },
        )

        console.log(user._id.toString())
        // return response with JWT
        res.json({
            msg: "login successful",
            token: token,
        })

        // res.send('logged in')
    },

    listUsers: async (req, res) => {
        const items = await userModel.find()
        res.json(items)
    },

    getUser: async (req, res) => {
        const itemID = req.params.itemID
        let singleUser = null

        try {
            // use model to find by id
            singleUser = await userModel.findById(itemID)
        } catch (err) {
            // if any error -> return response 500
            res.statusCode = 500
            return res.json()
        }

        // if not exists -> return response 404
        if (!singleUser) {
            console.log('does not exisxts')
            res.statusCode = 404
            return res.json()
        }

        // return json response of the fetched data
        return res.json(singleUser)
    },

    updateUser: async (req, res) => {
        // get the data from the req body
        const data = req.body

        // TODO: validation
        const validationSchema = Joi.object({
            firstName: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).max(30).required(),
            portfolio: Joi.array().items(Joi.string()), // Validate array of portfolio IDs
        })
        // try get the item from DB, if not exists, return 404 not found response
        let item = null // -> will evaluate to a falsy value

        try {
            item = await userModel.findById(req.params.itemID)
        } catch (err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        if (!item) {
            res.statusCode = 404
            return res.json()
        }

        console.log(item)

        // use user model to update into database
        try {
            await userModel.updateOne(
                {
                    _id: req.params.itemID
                },
                {
                    firstName: data.firstName,
                    email: data.email,
                    portfolio: data.portfolio
                }
            )
        } catch (err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        console.log('updated')

        res.json()
    },

    deleteUser: async (req, res) => {
        // get item ID from req, and perform validations
        let itemID = req.body.itemID

        // ensure data is present: number is within array data range

        // remove item from array 
        await userModel.deleteOne({ _id: itemID })

        res.json()
    },

    addPortfolioToUser: async (req, res) => {
        try {
            const itemID = req.params.itemID
            const user = await userModel.findById(itemID)

            if (!user) {
                return res.json({
                    msg: 'User not found'
                })
            }

            const portfolioID = req.body.itemID
            const existingPortfolio = await portfolioModel.findById(portfolioID)

            if (!existingPortfolio) {
                return res.json({
                    msg: 'Portfolio not found'
                })
            }

            // Add the existing portfolio reference to the user's portfolio array
            user.portfolio.push(existingPortfolio);

            // Save the updated user with the linked portfolio
            await user.save();

            res.json({
                msg: 'Portfolio added to user'
            })

        } catch (error) {
            console.log(error)
            res.json({
                msg: 'Internal server error'
            })
        }
    }
}

module.exports = userController