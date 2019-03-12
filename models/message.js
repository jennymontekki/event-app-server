'use strict';
const Sequelize = require('sequelize');
const { tryCatchHelper, errorsHelper } = require('./../helpers/formatting');
let Event, User;

module.exports = (sequelize) => {
  const Message = sequelize.define('message', {
    message: {
      allowNull: false,
      type: Sequelize.STRING
    },
    eventId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {});

  Message.associate = function(models) {
    ({ Event, User } = models);

    Message.belongsTo(Event);
    Message.belongsTo(User);
  };

  Message.createMessage = async payload => {
    let err, messageObj;
  
    [err, messageObj] = await tryCatchHelper(Message.create(payload));
    if (err)
      return [errorsHelper.invalidModel(err)]
    const message = { ...messageObj.dataValues };
  
    return [null, message]
  }

  return Message;
};