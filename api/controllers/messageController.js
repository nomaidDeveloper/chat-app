const { Message, User, sequelize } = require('../db');

// Assuming you already have the Sequelize model for Users defined

module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Message.findAll({
            where: sequelize.literal(`JSON_CONTAINS(users, '[${from, to}]')`),
            // where: sequelize.literal(`JSON_CONTAINS(users, '[${JSON.stringify([from, to])}]')`),

            order: [['updatedAt', 'ASC']],
            raw: true,
        });
        // const messages = await Message.findAll({
        //     where: {
        //         users: {
        //             [Sequelize.Op.and]: [
        //                 { [Sequelize.Op.contains]: [from] },
        //                 { [Sequelize.Op.contains]: [to] },
        //             ],
        //         },
        //     },
        //     order: [['updatedAt', 'ASC']],
        // });
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.senderId === from,
                message: msg.text,
            };
        });

        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const sender = await User.findByPk(from);

        if (!sender) {
            return res.status(404).json({ msg: 'Sender not found' });
        }

        const data = await Message.create({
            text: message,
            users: [from, to],
            senderId: sender.id,
        });

        if (data) {
            return res.json({ msg: 'Message added successfully.' });
        } else {
            return res.json({ msg: 'Failed to add message to the database' });
        }
    } catch (ex) {
        console.log("Errrrrrrrrrrrrr", ex)
        next(ex);
    }
};
