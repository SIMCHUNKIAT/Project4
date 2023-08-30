const mongoose = require('mongoose')
const Users = require('./userModel')

// Creating the Portfolio Model which stores the portfolio

const portfolioSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        loanQuantum:    { type: Number, required: true },
        grossReturn:    { type: Number, required: true },
        minAmount: { type: Number, required: true },
        highlights: { type: String, required: true },
        issuer: { type: String, required: true },
        purpose: { type: String, required: true },
        currency: { type: String, required: true },
        typeOfFinance: { type: String, required: true },
        issuerLocation: { type: String, required: true },
        closeDate: { type: Date, required: true },
        tenure: { type: String, required: true },
        assetClass: { type: String, required: true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    },
    {
        timestamps: true
    }
)

const Portfolio = mongoose.model('Portfolio', portfolioSchema)

module.exports = Portfolio