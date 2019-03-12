'use strict';
const Sequelize = require('sequelize');
let Event;

module.exports = (sequelize) => {
  const Category = sequelize.define('category', {
    name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING
    },
    key: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING
    }
  }, {});

  Category.associate = function(models) {
    ({ Event } = models);
    Category.hasMany(Event);
  };

  return Category;
};