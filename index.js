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

// let arr = [];
// let log = [];

// app.get('/api/users', function (req, res) {
//   res.json(arr);
//   console.log('Log arr: ', log);
// });

// app.post('/api/users', function (req, res) {
//   let user = {};
//   const { username } = req.body;
//   let id = new mongoose.Types.ObjectId();

//   user.username = username;
//   user._id = id;

//   arr.push(user);

//   res.json(user);
// });

// app.post('/api/users/:_id/exercises', function (req, res) {
//   let { description, duration, date } = req.body;
//   const { _id } = req.params;

//   const user = arr.find((u) => parseInt(u._id.toString()) === parseInt(_id));

//   console.log(user);

//   let exercise = {
//     description: description,
//     duration: parseInt(duration),
//     date: !date ? new Date().toDateString() : new Date(date).toDateString(),
//   };

//   log.push({ ...user, log: [{ ...exercise }], count: log.length });

//   if (!date) {
//     res.json({
//       ...user,
//       description: description,
//       duration: parseInt(duration),
//       date: new Date().toDateString(),
//     });
//   } else {
//     res.json({
//       ...user,
//       description: description,
//       duration: parseInt(duration),
//       date: new Date(date).toDateString(),
//     });
//   }
// });

// app.get('/api/users/:_id/logs', function (req, res) {
//   const { _id } = req.params;
//   const { from, to, limit } = req.query;
//   let userLogArr;

//   const userLog = log.find((u) => parseInt(u._id.toString()) === parseInt(_id));

//   function filterByDate(array, from, to) {
//     const fromDate = new Date(from);
//     const toDate = new Date(to);

//     // Filter the array
//     const filteredArray = array.filter((item) => {
//       // Convert item's date to a Date object
//       const itemDate = new Date(item.date);

//       // Check if itemDate is within the range
//       return itemDate >= fromDate && itemDate <= toDate;
//     });

//     return filteredArray;
//   }

//   if (from && to) {
//     userLogArr = filterByDate(log, from, to);
//   }

//   if (limit) {
//     userLogArr = log.slice(0, limit);
//   }

//   if (from || to || limit) {
//     res.json({
//       username: userLog.username,
//       _id: userLog._id.toString(),
//       count: log.length,
//       log: userLogArr,
//     });
//   } else {
//     res.json({
//       username: userLog.username,
//       _id: userLog._id.toString(),
//       count: log.length,
//       log: log,
//     });
//   }
// });

let users = [];
let logs = [];

app.post('/api/users', function (req, res) {
  const { username } = req.body;
  let id = new mongoose.Types.ObjectId();

  let user = {
    username: username,
    _id: id,
  };

  users.push(user);
  res.json(user);
});

app.get('/api/users', function (req, res) {
  res.json(users);
});

app.post('/api/users/:_id/exercises', function (req, res) {
  let { description, duration, date } = req.body;
  const { _id } = req.params;

  const user = users.find((u) => u._id.toString() === _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let exercise = {
    description: description,
    duration: parseInt(duration),
    date: !date ? new Date().toDateString() : new Date(date).toDateString(),
  };

  logs.push({ userId: _id, ...exercise });

  res.json({
    username: user.username,
    _id: user._id,
    ...exercise,
  });
});

app.get('/api/users/:_id/logs', function (req, res) {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find((u) => u._id.toString() === _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let userLogs = logs.filter((log) => log.userId === _id);

  if (from) {
    const fromDate = new Date(from);
    userLogs = userLogs.filter((log) => new Date(log.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userLogs = userLogs.filter((log) => new Date(log.date) <= toDate);
  }

  if (limit) {
    userLogs = userLogs.slice(0, limit);
  }

  res.json({
    username: user.username,
    count: userLogs.length,
    _id: user._id,
    log: userLogs.map(({ userId, ...log }) => log),
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
