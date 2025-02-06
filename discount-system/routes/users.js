const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const User = require('../models/User');
const { calculateDiscount } = require('../controllers/userController');
const router = express.Router();

// Set up file storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Parse Excel file
    const file = xlsx.readFile(req.file.path);
    const sheetName = file.SheetNames[0];
    const sheet = file.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Process each user and calculate discounts
    for (let user of data) {
      const existingUser = await User.findOne({ email: user.Email });
      if (existingUser) {
        existingUser.projects.push({
          startDate: new Date(user["Project Start Date"]),
          endDate: new Date(user["Project Completed Date"]),
          amount: user.Amount
        });
        existingUser.discount = calculateDiscount(existingUser);
        await existingUser.save();
      } else {
        const newUser = new User({
          name: user.Name,
          email: user.Email,
          phoneNumber: user["Phone Number"],
          projects: [{
            startDate: new Date(user["Project Start Date"]),
            endDate: new Date(user["Project Completed Date"]),
            amount: user.Amount
          }],
          discount: calculateDiscount({ projects: [{ amount: user.Amount }] })
        });
        await newUser.save();
      }
    }

    res.status(200).json({ message: 'File processed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
