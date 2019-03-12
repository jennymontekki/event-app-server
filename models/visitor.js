'use strict';
const Sequelize = require('sequelize');
const { tryCatchHelper, errorsHelper } = require('./../helpers/formatting');
let User, Event;

module.exports = (sequelize) => {
  var Visitor = sequelize.define('visitor', {
    eventId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {});

  Visitor.associate = function(models) {
    ({ User, Event } = models);
    Visitor.belongsTo(User);
    Visitor.belongsTo(Event);
  };

  Visitor.subscribeToEvent = async ({ eventId, userId }) => {
    let err, visitor;

    [err, visitor] = await tryCatchHelper(Visitor.create({ eventId, userId }));
    if (err)
      return [errorsHelper.invalidModel(err)]

    return [null, visitor]
  }

  Visitor.unsubscribeFromEvent = async ({ eventId, userId }) => {
    let err, visitor;

    [err, visitor] = await tryCatchHelper(Visitor.destroy({ where: { eventId, userId } }));
    if (err)
      return [errorsHelper.invalidModel(err)]

    return [null, visitor]
  }

  return Visitor;
};