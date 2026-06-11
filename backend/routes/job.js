const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Save a job
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { title, company, url } = req.body;
    await User.findByIdAndUpdate(req.user._id, { $push: { savedJobs: { title, company, url } } });
    res.json({ message: 'Offre sauvegardée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get saved jobs
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete saved job
router.delete('/saved/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: { _id: req.params.id } } });
    res.json({ message: 'Offre supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
