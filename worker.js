import Queue from 'bull';
import dbClient from './utils/db';
import imageThumbnail from 'image-thumbnail';
import { promises as fs } from 'fs';

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: new dbClient.ObjectID(fileId), userId: new dbClient.ObjectID(userId) });
  if (!file) {
    throw new Error('File not found');
  }

  const thumbnailSizes = [500, 250, 100];
  const thumbnailPromises = thumbnailSizes.map(async (size) => {
    const thumbnail = await imageThumbnail(file.localPath, { width: size });
    const thumbnailPath = `${file.localPath}_${size}`;
    await fs.writeFile(thumbnailPath, thumbnail);
  });

  await Promise.all(thumbnailPromises);
});

fileQueue.on('failed', (job, err) => {
  console.error(`Job failed ${job.id} with error ${err.message}`);
});
