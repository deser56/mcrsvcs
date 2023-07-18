const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');

const connectionString = 'postgres://deser56:J3dyjXtcTb1E@ep-shiny-cake-336723-pooler.us-east-2.aws.neon.tech/neondb';
const pool = new Pool({
  connectionString: connectionString,
  ssl:true
});

const collectionName = 'authenticator';

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const { user, pass } = req.body;
  try {
    await pool.query('INSERT INTO ' + collectionName + ' (username, password) VALUES ($1, $2)', [user, pass]);
    res.sendStatus(201);
  } catch (error) {
    console.error('Error signing up:', error);
    res.sendStatus(500);
  }
});

app.post('/signin', async (req, res) => {
  const { user, pass } = req.body;
  try {
    const result = await pool.query('SELECT * FROM ' + collectionName + ' WHERE username = $1 AND password = $2', [user, pass]);
    if (result.rowCount > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.sendStatus(500);
  }
});

const port = 3000;

// Function to connect to the database
async function tryConnect() {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (e) {
    console.error('Error connecting to the database:', e);
  }
}

// Start the server
tryConnect().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
