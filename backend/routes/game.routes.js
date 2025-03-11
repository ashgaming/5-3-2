const express = require('express')
const router = express.Router();
const { body , query } = require("express-validator")
const gameController = require('../controllers/game.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/room/create', authMiddleware.authUser ,gameController.CreateRoom)

router.post('/room/join',[
    body('roomId').isMongoId().withMessage('Invalid roomId'),
],authMiddleware.authUser , gameController.JoinRoom)

router.post('/room/leave',[
    body('roomId').isMongoId().withMessage('Invalid roomId'),
],authMiddleware.authUser , gameController.LeaveRoom)

router.post('/start',[
    body('roomId').isMongoId().withMessage('Invalid roomId'),
],authMiddleware.authUser,gameController.StartGame)

router.post('/enter',[
    body('gameId').isMongoId().withMessage('Invalid roomId'),
],authMiddleware.authUser,gameController.EnterGame)



router.post('/set/order',[
    body('gameId').isMongoId().withMessage('Invalid roomId'),
    body('order').isString().withMessage('Invalid order'),
], authMiddleware.authUser ,gameController.SetOrder)

router.post('/player/join',[
    body('roomId').isMongoId().withMessage('Invalid roomId'),
], gameController.SendPlayerJoinNotification)

router.post('/play-card',[
    body('gameId').isMongoId().withMessage('Invalid gameId'),
    body('card').isString().withMessage('Invalid card number'),
],authMiddleware.authUser ,gameController.playCard)

router.post('/test',[
    body('roomId').isMongoId().withMessage('Invalid gameId')
],authMiddleware.authUser ,gameController.test)

module.exports = router;