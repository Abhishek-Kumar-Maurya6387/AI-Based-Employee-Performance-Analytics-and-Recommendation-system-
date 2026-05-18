const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Employee name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Employee email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid employee email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
      set: (skills) => Array.isArray(skills)
        ? skills.map((skill) => String(skill).trim()).filter(Boolean)
        : [],
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);

