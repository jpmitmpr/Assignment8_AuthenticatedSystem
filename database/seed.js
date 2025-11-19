const { sequelize, User, Project, Task } = require('./setup');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });

  // --- USERS ---
  const hashed = await bcrypt.hash("password123", 10);

  const user1 = await User.create({
    username: "john",
    email: "john@example.com",
    password: hashed
  });

  const user2 = await User.create({
    username: "jane",
    email: "jane@example.com",
    password: hashed
  });

  // --- PROJECTS ---
  const proj1 = await Project.create({
    title: "Website Redesign",
    userId: user1.id
  });

  const proj2 = await Project.create({
    title: "Mobile App",
    userId: user1.id
  });

  // --- TASKS ---
  await Task.create({ title: "Design wireframes", projectId: proj1.id });
  await Task.create({ title: "Setup backend", projectId: proj1.id });
  await Task.create({ title: "Build login screen", projectId: proj2.id });

  console.log("Database seeded!");
  process.exit();
}

seed();
