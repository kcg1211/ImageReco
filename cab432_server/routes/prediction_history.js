const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authorize = require('../authorize');

router.get('/', authorize, (req, res) => {
    const userDir = path.join(__dirname, '..', 'predictions', req.username);

    //Return empty array as JSON if directory not found
    if (!fs.existsSync(userDir)) {
        return res.json({ predictions: [] });
    }

    // Read directory and send JSON
    fs.readdir(userDir, (err, files) => {
        if (err) {
            console.error('Error reading user directory:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        const predictions = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(userDir, file);
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            });

        res.json({ predictions });
    });
});

module.exports = router;