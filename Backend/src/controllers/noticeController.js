const { Notice } = require('../models');

exports.getAll = async (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const notices = await Notice.findAll({
    order: [['noticeDate', 'DESC'], ['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  res.json(notices);
};

exports.create = async (req, res) => {
  const { title, description, noticeDate } = req.body;
  if (!title || !description || !noticeDate) return res.status(400).json({ message: 'All fields required' });
  const notice = await Notice.create({ title, description, noticeDate });
  res.status(201).json(notice);
};

exports.update = async (req, res) => {
  const notice = await Notice.findByPk(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  await notice.update(req.body);
  res.json(notice);
};

exports.remove = async (req, res) => {
  const notice = await Notice.findByPk(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  await notice.destroy();
  res.json({ message: 'Notice deleted' });
};
