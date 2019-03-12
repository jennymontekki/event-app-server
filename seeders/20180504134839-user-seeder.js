'use strict';
const faker = require('faker');
const _ = require('lodash');

const userHost = {
  id: 41,
  name: 'test.userHost',
  email: 'test.userHost@gmail.com',
  password: '$2a$10$gQ3aYnYt/QLBo2wgDfEdIOYuPnCVBvJU546owduHvt3MRnbjwXIiK',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJ0ZXN0LnVzZXJIb3N0IiwiZW1haWwiOiJ0ZXN0LnVzZXJIb3N0QGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEwOjMwLjg5MVoiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEwOjMwLjg5MVoiLCJpYXQiOjE1Mjg4NDE0MzF9.HAGdlb4FFecmmFNhN7mZ8UHQ_aMJx5xJwMEwjBb0CN4',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const userAuthenticated = {
  id: 42,
  name: 'test.userAuthenticated',
  email: 'test.userAuthenticated@gmail.com',
  password: '$2a$10$Ts6.axl6HbGFtNfqenpdZeGIBa5oW.rHKb565da9w8F4VuvDzsv1S',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJ0ZXN0LnVzZXJBdXRoZW50aWNhdGVkIiwiZW1haWwiOiJ0ZXN0LnVzZXJBdXRoZW50aWNhdGVkQGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEyOjExLjQ1M1oiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEyOjExLjQ1M1oiLCJpYXQiOjE1Mjg4NDE1MzF9.DBdo369FhQfIeRZtWRH4iraqdeHR5o5iXdtg1sbSpFo',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const userVisitor = {
  id: 43,
  name: 'test.userVisitor',
  email: 'test.userVisitor@gmail.com',
  password: '$2a$10$dOegXQzELCw/hti4wm1RQujEGvKZ9Pwqgo0W.aVPO6smD5QHuVwS2',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJ0ZXN0LnVzZXJWaXNpdG9yIiwiZW1haWwiOiJ0ZXN0LnVzZXJWaXNpdG9yQGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEzVDA3OjAzOjQxLjEzNVoiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEzVDA3OjAzOjQxLjEzNVoiLCJpYXQiOjE1Mjg4NzM0MjF9.a7wdOWeEE-BLv8UHANU1d1-tFzYZYXMndWAggTSqrUA',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const usersToSeed = _.times(40, (n) => ({
  id: n + 1,
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password(),
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
}));

usersToSeed.push(userHost);
usersToSeed.push(userAuthenticated);
usersToSeed.push(userVisitor);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', usersToSeed, {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', usersToSeed, {})
};