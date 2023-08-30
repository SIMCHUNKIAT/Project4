const mongoose = require('mongoose')

// Creating the User Model which stores all the user accounts created in the app

const usersSchema = new mongoose.Schema(
    {
        firstName:   { type: String, required: true },
        // lastName:   { type: String, required: true },
        email:  { type: String, required: true, unique: true },
        password:   { type: String, required: true },
        userRole:   { type: String, default: "Member" },
        // address:    { type: String, required: true },
        // mobile: { type: Number, required: true }
        portfolio: []
    },
    {
        timestamps: true
    }
)

const Users = mongoose.model('Users', usersSchema)

module.exports = Users