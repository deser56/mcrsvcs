const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { MongoClient } = require('mongodb');

const connectionString = 'mongodb+srv://wanpatty168:4nQmrFD0KESLfunc@cluster0.45cy7xk.mongodb.net/';

let db;

async function tryConnect() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    db = client.db('cluster0');
    console.log('Connected to the database');
  } catch (e) {
    console.error('Error connecting to the database:', e);
  }
}

const collectionName = 'authenticator';

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { user, pass } = req.body;
  try {
    await db.collection(collectionName).insertOne({
      username: user,
      password: pass,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error signing up:', error);
    res.sendStatus(500);
  }
});

app.post('/signin', async (req, res) => {
  const { user, pass } = req.body;
  try {
    const userFound = await db.collection(collectionName).findOne({
      username: user,
      password: pass,
    });
    if (userFound) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.sendStatus(500);
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

tryConnect().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
