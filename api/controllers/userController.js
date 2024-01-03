const { User } = require('../db');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken');


module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user)
            return res.json({ msg: 'Incorrect email or Password', status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.json({ msg: 'Incorrect email or Password', status: false });
            
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'mysecrety_key',
                { expiresIn: '8h' } // You can adjust the expiration time as needed
              );
        // Omit password from the response
        const { password: _, ...userDataWithoutPassword } = user.get();

        return res.json({ status: true, user: userDataWithoutPassword,token:token });
    } catch (ex) {
        next(ex);
    }
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password,phone,gender } = req.body;

        const usernameCheck = await User.findOne({ where: { username } });
        if (usernameCheck)
            return res.json({ msg: 'Username already used', status: false });

        const emailCheck = await User.findOne({ where: { email } });
        if (emailCheck)
            return res.json({ msg: 'Email already used', status: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            phone,
            gender
        });

        // Omit password from the response
        const { password: _, ...userDataWithoutPassword } = user.get();
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'mysecrety_key',
            { expiresIn: '8h' } // You can adjust the expiration time as needed
          );
        return res.json({ status: true, user: userDataWithoutPassword,token:token });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: req.params.id },
            },
            attributes: ['email', 'username', 'avatarImage', 'id'],
        });

        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        // const [rowsAffected, [updatedUser]] = await User.update(
        //     {
        //         isAvatarImageSet: true,
        //         avatarImage,
        //     },
        //     {
        //         where: { id: userId },
        //         returning: true,
        //     }
        // );

        await User.update(
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { where: { id: userId }, }
        )
        const updatedUser = await User.findOne({
            where: { id: userId }
        })
        if (updatedUser) {
            return res.json({
                isSet: updatedUser.isAvatarImageSet,
                image: updatedUser.avatarImage,
            });
        } else {
            return res.json({ msg: 'User not found or avatar not updated' });
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.logOut = (req, res, next) => {
    try {
        if (!req.params.id) return res.json({ msg: 'User id is required ' });

        // Assuming onlineUsers is a global Map
        onlineUsers.delete(req.params.id);

        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
};
