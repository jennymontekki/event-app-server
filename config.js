const HOST = 'ec2-3-18-185-218.us-east-2.compute.amazonaws.com';
const PORT = 80;
const JWT_AUTH_SECRET_KEY = '123456789';
const CATEGORIES_COUNT = 8;
const EVENTS_COUNT_PER_PAGE = 6;
const EVENT_DETAILS_ROUTE = 'event/details';
const SERVER_ROUTE = 'http://localhost:3000';

const notificationTypes = { newMessages: 'NEW MESSAGES' };

module.exports = {
  HOST,
  PORT,
  JWT_AUTH_SECRET_KEY,
  CATEGORIES_COUNT,
  EVENTS_COUNT_PER_PAGE,
  EVENT_DETAILS_ROUTE,
  SERVER_ROUTE,
  notificationTypes
}

  // 1) sequelize db:migrate:undo:all
  // 2) sequelize db:migrate
  // 3) sequelize db:seed:all
  