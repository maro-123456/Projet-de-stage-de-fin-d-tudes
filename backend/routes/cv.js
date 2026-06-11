const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get CV
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.cv);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Save/Update CV
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { personalInfo, education, experience, skills, languages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'cv.personalInfo': personalInfo, 'cv.education': education, 'cv.experience': experience, 'cv.skills': skills, 'cv.languages': languages, 'cv.lastUpdated': new Date() },
      { new: true }
    );
    res.json({ message: 'CV sauvegardé', cv: user.cv });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Save CV score & feedback
router.post('/score', authMiddleware, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { 'cv.score': score, 'cv.feedback': feedback }, { new: true });
    res.json({ score: user.cv.score, feedback: user.cv.feedback });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
