

const gameServices = require('../services/game.services')
const { validationResult } = require('express-validator')

//const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.CreateRoom = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { _id:userId , socketId } = req.user;

        const room = await gameServices.CreateRoom({userId , socketId})

        res.status(201).json({ room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.JoinRoom = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { roomId } = req.body;
        const { _id:userId , socketId } = req.user;

        const room = await gameServices.JoinRoom(roomId, userId , socketId)

        res.status(201).json({ room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.LeaveRoom = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { roomId } = req.body;
        const { _id:userId , socketId } = req.user;

        const room = await gameServices.LeaveRoom(roomId, userId , socketId)

        res.status(201).json({ room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.StartGame = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { _id:userId } = req.user;

        const { roomId} = req.body;

        const game = await gameServices.StartGame({userId , roomId })

        res.status(201).json({ game })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.EnterGame = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { _id:userId } = req.user;

        const { gameId } = req.body;

        const game = await gameServices.EnterGame({gameId , userId })

        res.status(201).json({ game })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.SetOrder = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { _id:userId } = req.user;

        const { order:newOrder , gameId } = req.body;

        const order = await gameServices.SetOrder({gameId , order:newOrder })

        res.status(201).json({ order })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}

module.exports.SendPlayerJoinNotification = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { roomId } = req.body;

        const room = await gameServices.SendPlayerJoinNotification(roomId)

        res.status(201).json({ room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" });
    }
}


module.exports.playCard = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { gameId , card } = req.body;
        const { _id:userId } = req.user;

        const game = await gameServices.PlayMyCards({ gameId , card , userId })

        res.status(201).json({ game })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" , msg : error });
    }
}

module.exports.test = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { gameId , card } = req.body;
        const { _id:userId } = req.user;

        const game = await gameServices.PlayMyCards({ gameId , card , userId })

        res.status(201).json({ game })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ errors: "Internal server error" , msg : error });
    }
}