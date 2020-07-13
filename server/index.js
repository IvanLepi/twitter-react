const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk('localhost/tweetsdb');
const tweets = db.get('tweets');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Tweeet!!!'
  });
});

app.get('/tweets', (req, res) => {
  tweets.find().then(tweets => {
    res.json(tweets);
  });
});

function isValidTweet(tweet) {
  return tweet.tweetUser && tweet.tweetUser.toString().trim() !== '' &&
    tweet.tweetBody && tweet.tweetBody.toString().trim() !== '';
}

app.use(rateLimit({
  windowMS: 30 * 1000, // 30 sec
  max: 1 // limit each IP to 1 requests per windowMS
}));

app.post('/tweets', (req, res) => {
  if (isValidTweet(req.body)) {
    const tweet = {
      tweetUser: filter.clean(req.body.tweetUser.toString()),
      tweetBody: filter.clean(req.body.tweetBody.toString()),
      created: new Date()
    };
    tweets.insert(tweet).then(createdTweet => {
      res.json(createdTweet);
    });
  } else {
    res.status(422);
    res.json({
      message: 'User and Tweet are required!'
    })
  }
})

app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
})