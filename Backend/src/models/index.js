const sequelize = require('../config/database');
const Notice = require('./Notice');
const Admission = require('./Admission');
const AdminUser = require('./AdminUser');
const bcrypt = require('bcryptjs');

async function syncAndSeed() {
  await sequelize.sync({ alter: true });

  const count = await AdminUser.count();
  if (count === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await AdminUser.create({ username: 'admin', passwordHash });
    console.log('Admin user seeded: admin / admin123');
  }
}

module.exports = { sequelize, Notice, Admission, AdminUser, syncAndSeed };
