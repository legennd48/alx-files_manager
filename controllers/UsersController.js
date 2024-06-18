import redisClient from '../utils/redis';
import dbClient from '../utils/db';
const encrypt = require('crypto');

class UsersController {
  async nUser(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const users = dbClient.usersCollection;
    if (!users) {
      return res.status(500).json({ error: 'Database connection not initialized' });
    }
    
    const user = await users.findOne({ email });
    if (user) return res.status(400).json({ error: 'Already exist' });

    const hashedpw = encrypt.createHash('SHA1').update(password).digest('hex');
    const userObj = await users.insertOne({ email, password: hashedpw });
    const newUser = { id: userObj.insertedId, email };
    res.status(201).json(newUser);
  }
}

module.exports = new UsersController();

