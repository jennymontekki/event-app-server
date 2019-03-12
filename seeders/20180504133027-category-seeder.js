'use strict';
const categories = [
  { id: 1, name: 'Health Science', key: 'category-health-science' },
  { id: 2, name: 'Life Science', key: 'category-life-science' },
  { id: 3, name: 'Engineering', key: 'category-engineering' },
  { id: 4, name: 'Materials Science', key: 'category-materials-science' },
  { id: 5, name: 'Chemistry', key: 'category-chemistry' },
  { id: 6, name: 'Earth Science', key: 'category-earth-science' },
  { id: 7, name: 'Computer Science', key: 'category-computer-science' },
  { id: 8, name: 'Physics', key: 'category-physics' },
];

const categoriesToSeed = categories.map(key => ({ ...key, createdAt: new Date(), updatedAt: new Date() }));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Categories', categoriesToSeed, {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Categories', categoriesToSeed, {})
};