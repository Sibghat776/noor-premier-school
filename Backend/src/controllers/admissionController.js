const { Admission } = require('../models');
const { body, validationResult } = require('express-validator');

const admissionRules = [
  body('studentName').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('fatherName').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('cnicOrBForm').trim().notEmpty().isLength({ max: 20 }).escape(),
  body('classApplying').trim().notEmpty().isLength({ max: 50 }).escape(),
  body('contactNumber').trim().notEmpty().isLength({ max: 15 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('address').trim().notEmpty().isLength({ max: 500 }).escape(),
];

exports.admissionRules = admissionRules;

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { studentName, fatherName, cnicOrBForm, classApplying, contactNumber, email, address } = req.body;
  const admission = await Admission.create({ studentName, fatherName, cnicOrBForm, classApplying, contactNumber, email, address });
  res.status(201).json(admission);
};

exports.getAll = async (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const admissions = await Admission.findAll({
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  res.json(admissions);
};

exports.updateStatus = async (req, res) => {
  const admission = await Admission.findByPk(req.params.id);
  if (!admission) return res.status(404).json({ message: 'Admission not found' });
  const { status } = req.body;
  if (!['pending', 'reviewed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  await admission.update({ status });
  res.json(admission);
};

exports.remove = async (req, res) => {
  const admission = await Admission.findByPk(req.params.id);
  if (!admission) return res.status(404).json({ message: 'Admission not found' });
  await admission.destroy();
  res.json({ message: 'Admission deleted' });
};
