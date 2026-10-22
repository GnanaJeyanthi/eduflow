import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import User from '../models/User.js';
import ClassModel from '../models/ClassModel.js';
import Assignment from '../models/Assignment.js';
import { logger } from './logger.js';

async function seedRealData() {
  await mongoose.connect(env.mongodbUri);

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Find/create teacher
  const teacher = await User.findOneAndUpdate(
    { email: '2312016@nec.edu.in' },
    { 
      name: 'Professor AI', 
      email: '2312016@nec.edu.in', 
      passwordHash, 
      role: 'teacher' 
    },
    { upsert: true, new: true }
  );
  logger.info(`Teacher ensured: ${teacher.email}`);

  // 2. Find all students to enroll them
  const students = await User.find({ role: 'student' });
  const studentIds = students.map(s => s._id);

  // 3. Find/create the class
  let cls = await ClassModel.findOne({ name: 'Artificial Intelligence Fundamentals', teacher: teacher._id });
  if (!cls) {
    cls = await ClassModel.create({
      name: 'Artificial Intelligence Fundamentals', 
      subject: 'Artificial Intelligence', 
      teacher: teacher._id,
      students: studentIds,
      joinCode: 'AI-101'
    });
    logger.info(`Class created: ${cls.name}`);
  } else {
    // Make sure students are enrolled
    await ClassModel.findByIdAndUpdate(cls._id, {
      $addToSet: { students: { $each: studentIds } }
    });
    logger.info(`Class updated with students: ${cls.name}`);
  }

  // Helper for due date (in 14 days)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  // 4. Create assignments
  const assignments = [
    {
      title: 'Introduction to Artificial Intelligence',
      question: 'Write a short explanation of AI and discuss three practical applications.\n\nDescription: Explain the concept of Artificial Intelligence and describe at least three real-world applications.\n\nDifficulty: Easy',
      evaluationType: 'THEORY',
      maxScore: 10,
      rubric: [
        { criterion: 'Explanation of AI', maxPoints: 4, description: 'Clear and correct definition of AI.' },
        { criterion: 'Practical Applications', maxPoints: 6, description: 'Provides and discusses three valid real-world applications (2 points each).' }
      ]
    },
    {
      title: 'Machine Learning Basics',
      question: 'Compare the three major machine learning approaches and provide one example for each.\n\nDescription: Explain supervised learning, unsupervised learning and reinforcement learning.\n\nDifficulty: Medium',
      evaluationType: 'THEORY',
      maxScore: 20,
      rubric: [
        { criterion: 'Supervised Learning', maxPoints: 6, description: 'Clear explanation and valid example.' },
        { criterion: 'Unsupervised Learning', maxPoints: 6, description: 'Clear explanation and valid example.' },
        { criterion: 'Reinforcement Learning', maxPoints: 6, description: 'Clear explanation and valid example.' },
        { criterion: 'Overall Comparison', maxPoints: 2, description: 'Discusses how they differ fundamentally.' }
      ]
    },
    {
      title: 'AI Mini Case Study',
      question: 'Choose an AI application such as recommendation systems, healthcare AI, fraud detection or autonomous vehicles. Explain the problem, AI approach and expected benefits.\n\nDescription: Analyze a real-world AI application and explain how AI is used to solve the problem.\n\nDifficulty: Medium',
      evaluationType: 'THEORY',
      maxScore: 25,
      rubric: [
        { criterion: 'Problem Statement', maxPoints: 5, description: 'Clearly identifies the problem being solved.' },
        { criterion: 'AI Approach', maxPoints: 10, description: 'Detailed analysis of how AI solves the problem.' },
        { criterion: 'Expected Benefits', maxPoints: 10, description: 'Discusses the impact and benefits of the solution.' }
      ]
    }
  ];

  for (const asgnData of assignments) {
    const existingAsgn = await Assignment.findOne({ class: cls._id, title: asgnData.title });
    if (!existingAsgn) {
      await Assignment.create({
        class: cls._id,
        teacher: teacher._id,
        title: asgnData.title,
        question: asgnData.question,
        evaluationType: asgnData.evaluationType,
        maxScore: asgnData.maxScore,
        rubric: asgnData.rubric,
        dueDate: dueDate
      });
      logger.info(`Assignment created: ${asgnData.title}`);
    } else {
      logger.info(`Assignment already exists: ${asgnData.title}`);
    }
  }

  logger.info('SeedRealData complete.');
  logger.info('Teacher login: 2312016@nec.edu.in / password123');
  await mongoose.disconnect();
}

seedRealData().catch((err) => {
  logger.error('SeedRealData failed:', err.message);
  process.exit(1);
});
