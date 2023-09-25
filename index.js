const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', function (req, res) {
  res.json(arr);
});

let arr = [];
let user = {};
let log = [];

app.post('/api/users', function (req, res) {
  arr.push({
    username: req.body.username,
    _id: new mongoose.Types.ObjectId(),
  });

  res.json({
    username: req.body.username,
    _id: new mongoose.Types.ObjectId(),
  });
});

app.post('/api/users/:_id/exercises', function (req, res) {
  let { description, duration, date } = req.body;

  const user = arr.find(
    (u) => parseInt(u._id.toString()) === parseInt(req.params._id)
  );

  let exercise = {
    description: description,
    duration: parseInt(duration),
    date: !date ? new Date().toDateString() : new Date(date).toDateString(),
  };

  log.push(exercise);

  if (!date) {
    res.json({
      ...user,
      description: description,
      duration: parseInt(duration),
      date: new Date().toDateString(),
    });
  } else {
    res.json({
      ...user,
      description: description,
      duration: parseInt(duration),
      date: new Date(date).toDateString(),
    });
  }
});

app.get('/api/users/:_id/logs', function (req, res) {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  let userLogArr;

  const userLog = arr.find((u) => parseInt(u._id.toString()) === parseInt(_id));

  function filterByDate(array, from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Filter the array
    const filteredArray = array.filter((item) => {
      // Convert item's date to a Date object
      const itemDate = new Date(item.date);

      // Check if itemDate is within the range
      return itemDate >= fromDate && itemDate <= toDate;
    });

    return filteredArray;
  }

  if (from && to) {
    userLogArr = filterByDate(log, from, to);
  }

  if (limit) {
    userLogArr = log.slice(0, limit);
  }

  if (from || to || limit) {
    res.json({
      username: userLog.username,
      _id: userLog._id.toString(),
      count: log.length,
      log: userLogArr,
    });
  } else {
    res.json({
      username: userLog.username,
      _id: userLog._id.toString(),
      count: log.length,
      log: log,
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
