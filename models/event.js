'use strict';
const Sequelize = require('sequelize');
const { tryCatchHelper, errorsHelper } = require('./../helpers/formatting');
const { EventNotification } = require('./../skeletons/event');
let Category, User, Visitor, Notification, Message;

function validateTitle(value) {
  const regExp = /^[a-z0-9,.?!@<>"':;#№$%&*()\-+= ]+$/img;
  if (value.replace(/\s+/g, '').length < 6)
    throw new Error('event title must be at least 6 characters long');
  
  if (value.length > 80)
    throw new Error('event title must be at most 80 characters long');
 
  if (regExp.test(value) === false)
    throw new Error('event title can contain only alphanumeric symbols, comas, dots, exclamation marks');
}

module.exports = (sequelize) => {
  const Event = sequelize.define('event', {
    title: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: { validateTitle }
    },
    address: {
      allowNull: false,
      type: Sequelize.STRING
    },
    location: {
      allowNull: false,
      type: Sequelize.JSON
    },
    description: Sequelize.TEXT,
    date: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {});

  Event.associate = function(models) {
    ({ Category, User, Visitor, Notification, Message } = models);
    Event.belongsTo(Category);
    Event.belongsTo(User);
    Event.hasMany(Visitor);
    Event.hasMany(Notification);
    Event.hasMany(Message);
  };

  Event.createEvent = async ({ payload, userId }) => {
    let err, event;
  
    [err, event] = await tryCatchHelper(Event.create({ ...payload, userId }));
    if (err)
      return [errorsHelper.invalidModel(err)]
  
    return [null, event]
  }

  Event.updateEvent = async ({ payload, userId, eventId }) => {
    const eventObj = await Event.findById(eventId, {
      include: [
        {
          model: Visitor,
          include: [{ model: User, attributes: ['email'] }]
        }
      ]
    });
    if (eventObj === null)
      return [404]

    if (eventObj.userId !== userId)
      return [400]

    await Event.update({ ...payload }, { where: { id: eventId } });

    const visitorsArray = eventObj.visitors.map(visitor => visitor.dataValues.userId);
    
    await User.update({ notified: false }, { where: { id: visitorsArray } });

    const updatedEventObj = await Event.findById(eventId);

    const event = new EventNotification(eventObj.dataValues);

    const updatedFields = Object.entries(event).map(item => {
      if (item[0] === 'date')
        return item[1].getTime() !== updatedEventObj.dataValues[item[0]].getTime() ? item[0] : null;
      
      if (item[1] !== updatedEventObj.dataValues[item[0]]) {
        if (item[0] === 'categoryId')
          return 'category';
        return item[0];
      }

      return null;
    });
  
    return [null, { event: eventObj.dataValues, updatedFields } ]
  }

  Event.deleteEvent = async ({ eventId, userId }) => {
    const event = await Event.findById(eventId, { attributes: ['userId'] });
    if (event === null)
      return [404]

    if (event.userId !== userId)
      return [400]

    await Event.destroy({ where: { id: eventId } });
   
    return [null]
  }

  return Event;
};