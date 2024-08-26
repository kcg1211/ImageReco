var express = require('express');
const jwt = require("jsonwebtoken");
const authorize = require('../authorize');
var router = express.Router();


const SECRET_KEY = 'your_secret_key';

// Simple user information without a database
const users = [{
    id: 1,
    username: 'admin',
    password: 'password123'
},
{
    id: 2,
    username: 'user',
    password: '123456'
}];



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// //Protected route example
// router.get('/protected', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//       if (err) {
//           return res.status(401).json({ message: 'Invalid token' });
//       }
//       res.json({ message: 'This is a protected route', user: decoded });
//   });
// });

router.get('/protected', authorize, (req, res) => {
    res.json({ message: 'This is a protected route', id: req.id, username: req.username });
});


module.exports = router;
