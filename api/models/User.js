// models/User.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
           
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, Infinity],
            },
        },
        isAvatarImageSet: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        avatarImage: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },

        phone: {
        type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    });

    return User;
};
