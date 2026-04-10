const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  sector: { type: String, default: '' },
  cv: {
    personalInfo: {
      name: String, email: String, phone: String, city: String, objective: String
    },
    education: [{ degree: String, school: String, year: String, description: String }],
    experience: [{ title: String, company: String, duration: String, description: String }],
    skills: [String],
    languages: [{ language: String, level: String }],
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now }
  },
  savedJobs: [{ title: String, company: String, url: String, savedAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
