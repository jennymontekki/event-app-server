'use strict';
const _ = require('lodash');

const visitorForTests = {
  id: 201,
  eventId: 61,
  userId: 42,
  createdAt: '2018-06-12 23:24:12.285 +00:00',
  updatedAt: '2018-06-12 23:24:12.285 +00:00'
}

const visitorsToSeed = _.flatten(_.times(20, index => _.times(10, n => ({
    id: 10 * index + n + 1,
    eventId: index + 1,
    userId: n + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  })))
);

visitorsToSeed.push(visitorForTests);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Visitors', visitorsToSeed, {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Visitors', visitorsToSeed, {})
};