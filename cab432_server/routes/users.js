var express = require('express');
const jwt = require("jsonwebtoken");
const authorize = require('../authorize');
var router = express.Router();


const SECRET_KEY = process.env.AUTHORISATION_SECRET_KEY;

// User information without a database
const users = [{
    id: 1,
    username: 'user1',
    password: '123456'
},
{
    id: 2,
    username: 'user2',
    password: '654321'
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

router.get('/protected', authorize, (req, res) => {
    res.json({ message: 'This is a protected route', id: req.id, username: req.username });
});


module.exports = router;
