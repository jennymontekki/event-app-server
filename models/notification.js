'use strict';
const Sequelize = require('sequelize');
const { tryCatchHelper, errorsHelper } = require('./../helpers/formatting');
let Event, User;

module.exports = (sequelize) => {
  const Notification = sequelize.define('notification', {
    type: {
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

  Notification.associate = function(models) {
    ({ Event, User } = models);
    Notification.belongsTo(Event);
    Notification.belongsTo(User);
  };

  Notification.createNotifications = async payload => {
    let err, notificationObj;
  
    [err, notificationObj] = await tryCatchHelper(Notification.bulkCreate(payload));
    if (err)
      return [errorsHelper.invalidModel(err)]
    const notification = { ...notificationObj.dataValues };
  
    return [null, notification]
  }

  Notification.deleteNotification = async ({ notificationId, userId }) => {
    const notification = await Notification.findById(notificationId, { attributes: ['userId'] });
    if (notification === null)
      return [404]

    if (notification.userId !== userId)
      return [400]

    await Notification.destroy({ where: { id: notificationId } });
   
    return [null]
  }

  return Notification;
};