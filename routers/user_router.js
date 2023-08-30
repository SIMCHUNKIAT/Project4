const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/', authMiddleware, userController.listUsers)
router.get('/:itemID', authMiddleware, userController.getUser)
router.patch('/:itemID', authMiddleware, userController.updateUser)
router.delete('/delete', userController.deleteUser)
router.post('/:itemID/add-portfolio', authMiddleware, userController.addPortfolioToUser)

module.exports = router