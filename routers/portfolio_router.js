const express = require('express')
const router = express.Router()
const portfolioController = require('../controllers/portfolio_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.get('/', portfolioController.listItems)
router.get('/:itemID', portfolioController.getItem)
router.post('/', authMiddleware, portfolioController.createItem)
router.patch('/:itemID', authMiddleware, portfolioController.updateItem)
router.delete('/delete', portfolioController.deleteItem)

module.exports = router