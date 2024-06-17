import dbClient from '../utils/db';

const encrypt = require('crypto');

class UsersController {
  async createUser(req, res) {
    const { email, password } = req.body;

    // Validate request body
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const users = await dbClient.users;
    const user = await users.findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedpw = encrypt.createHash('sha1').update(password).digest('hex');

    // Insert new user into database
    const userObj = await users.insertOne({ email, password: hashedpw });
    const newUser = { id: userObj.insertedId, email };

    res.status(201).json(newUser);
  }
}

module.exports = new UsersController();
