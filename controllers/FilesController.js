/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import mime from 'mime-types';

class FilesController {
  static async postNew(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    let parentFile = null;
    if (parentId !== 0) {
      parentFile = await dbClient.db.collection('files').findOne({ _id: new dbClient.ObjectID(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileDocument = {
      userId: new dbClient.ObjectID(userId),
      name,
      type,
      isPublic,
      parentId: parentId !== 0 ? new dbClient.ObjectID(parentId) : 0,
    };

    if (type === 'folder') {
      const result = await dbClient.filesCollection.insertOne(fileDocument);
      return res.status(201).json({
        id: result.insertedId,
        ...fileDocument,
      });
    } else {
      const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
      await fs.mkdir(FOLDER_PATH, { recursive: true });
      const fileUUID = uuidv4();
      const fileExtension = mime.extension(type);
      const localPath = path.join(FOLDER_PATH, `${fileUUID}.${fileExtension}`);
      await fs.writeFile(localPath, Buffer.from(data, 'base64'));

      fileDocument.localPath = localPath;
      const result = await dbClient.filesCollection.insertOne(fileDocument);
      return res.status(201).json({
        id: result.insertedId,
        ...fileDocument,
      });
    }
  }
}

export default FilesController;
