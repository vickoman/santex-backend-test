const User = require('./User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 *  Generate Token
 * @param {*} user 
 * @param {*} secret 
 * @param {*} expiration 
 * @returns Token
 */
const generateToken = (user, secret, expiration) => {
    const { id, name, lastName, email } = user;
    return jwt.sign({ id, name, lastName, email }, secret, { expiresIn: expiration });
};

/**
 * Authenticate user
 * @param {input} Object
 * @returns Token
 */
const auth = async (_, { input }) => {
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User Does not exists');
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        throw new Error('Password is incorrect');
    }
    return {
        token: generateToken(user, process.env.SECRET, '24h')
    }
};

/**
 *  CreateUser
 * @param {input} Object UserInput
 * @returns UserObject
 */
const createUser = async (_, { input }) => {
    // check if user exists
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    }

    // Create hash for password
    const salt =  await bcrypt.genSalt(10);
    input.password = await bcrypt.hash(password, salt);

    // save user in db
    try {
        const user = new User(input);
        user.save();
        return user;
    } catch (err) {
        console.log(err);
    }
};

/**
 * Get all users
 * @returns Array of Users
 */
const getUsers = async () => {
    return User.find();
};

/**
 * Get user by id
 * @param {*} ctx  Grab id from context
 * @returns  UserObject
 */
const getUser = async (_, {}, ctx) => {
    return ctx.user;
};

module.exports = {
    auth,
    createUser,
    getUsers,
    getUser
}