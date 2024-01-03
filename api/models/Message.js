// models/Message.js

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // message: {
        //     text: { type: DataTypes.STRING },
        // },

        users: {
            type: DataTypes.JSON, // Use JSON type for array-like structure
            allowNull: false,
        },

        // users: {
        //     type: DataTypes.TEXT, // Use TEXT type for array-like structure
        //     allowNull: false,
        //     get: function () {
        //         return JSON.parse(this.getDataValue('users'));
        //     },
        //     set: function (value) {
        //         this.setDataValue('users', JSON.stringify(value));
        //     },
        // },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Assuming your user model is named Users
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return Message;
};
