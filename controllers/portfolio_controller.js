const PortfolioModel = require('../models/portfolioModel')

const PortfolioControllers = {

    listItems: async (req, res) => {
        const items = await PortfolioModel.find()
        res.json(items)
    },

    getItem: async (req, res) => {
        const itemID = req.params.itemID
        let portfolioItem = null

        try {
            // use model to find by id
            portfolioItem = await PortfolioModel.findById(itemID)
        } catch (err) {
            // if any error -> return response 500
            res.statusCode = 500
            return res.json()
        }

        // if not exists -> return response 404
        if (!portfolioItem) {
            console.log('does not exisxts')
            res.statusCode = 404
            return res.json()
        }

        // return json response of the fetched data
        return res.json(portfolioItem)
    },

    createItem: async (req, res) => {
        // get the data from request
        const data = req.body

        // TODO: data validation

        // let imageData = data.image
        // if (!imageData) {
        //     imageData = ''
        // }

        // insert to DB using model
        const result = await PortfolioModel.create({
            name: data.name,
            description: data.description,
            image: data.image ?? '',
            loanQuantum: data.loanQuantum,
            grossReturn: data.grossReturn,
            minAmount: data.minAmount,
            highlights: data.highlights,
            issuer: data.issuer,
            purpose: data.purpose,
            currency: data.currency,
            typeOfFinance: data.typeOfFinance,
            issuerLocation: data.issuerLocation,
            closeDate: data.closeDate,
            tenure: data.tenure,
            assetClass: data.assetClass,
        })

        res.statusCode = 201
        res.json({
            msg: "Created successfully"
        })
    },

    updateItem: async (req, res) => {
        // get the data from the req body
        const data = req.body

        // TODO: validation

        // try get the item from DB, if not exists, return 404 not found response
        let item = null // -> will evaluate to a falsy value

        try {
            item = await PortfolioModel.findById(req.params.itemID)
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

        // if image is given to be updated, then update, else no change
        let image = item.image
        if (data.image) {
            image = data.image
        }

        console.log(image)

        // use menu item model to update into database
        try {
            await PortfolioModel.updateOne(
                {
                    _id: req.params.itemID
                },
                {
                    name: data.name,
                    description: data.description,
                    image: data.image ?? '',
                    loanQuantum: data.loanQuantum,
                    grossReturn: data.grossReturn,
                    minAmount: data.minAmount,
                    highlights: data.highlights,
                    issuer: data.issuer,
                    purpose: data.purpose,
                    currency: data.currency,
                    typeOfFinance: data.typeOfFinance,
                    issuerLocation: data.issuerLocation,
                    closeDate: data.closeDate,
                    tenure: data.tenure,
                    assetClass: data.assetClass,
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

    deleteItem: async (req, res) => {
        // get item ID from req, and perform validations
        let itemID = req.body.itemID

        // ensure data is present: number is within array data range

        // remove item from array 
        await PortfolioModel.deleteOne({ _id: itemID })

        res.json()
    },
}

module.exports = PortfolioControllers