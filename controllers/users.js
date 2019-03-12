const Joi = require('joi');
const Boom = require('boom');
const { EVENTS_COUNT_PER_PAGE, notificationTypes } = require('./../config');
const { UserSafe } = require('./../skeletons/user');
const { Category, User, Event, Visitor, Notification } = require('./../models');

const fetchEventsByUserId = async (request, h) => {
  const { pageNum } = request.params;
  const { limit } = request.query;
  const { id } = request.auth.credentials;

  const result = await Event.findAndCountAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    offset: limit * (pageNum - 1),
    attributes: ['id', 'title', 'address', 'date'],
    where: { userId: id },
    include: [
      {
        model: Category,
        attributes: ['id', 'name', 'key']
      },
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  return h.response({ events: result.rows, eventsCount: result.count });
}

const fetchSubscribedEvents = async (request, h) => {
  const { pageNum } = request.params;
  const { limit } = request.query;
  const { id } = request.auth.credentials;

  const visitors = await Visitor.findAll({
    where: { userId: id },
    include: [{ model: Event, attributes: ['id'] }]
  });

  const subscribedEvents = Object.values(visitors).map(visitor => visitor.event.id);

  const result = await Event.findAndCountAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    offset: limit * (pageNum - 1),
    attributes: ['id', 'title', 'address', 'date'],
    where: { id: subscribedEvents },
    include: [
      {
        model: Category,
        attributes: ['id', 'name', 'key']
      },
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  return h.response({ events: result.rows, eventsCount: result.count });
}

const fetchUserMessages = async (request, h) => {
  const { pageNum } = request.params;
  const { limit } = request.query;
  const { id } = request.auth.credentials;
  
  const result = await Notification.findAndCountAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    offset: limit * (pageNum - 1),
    attributes: ['id', 'type', 'updatedAt'],
    where: { userId: id, type: notificationTypes.newMessages },
    include: [{ model: Event, attributes: ['id', 'title'] }]
  });

  return h.response({ messages: result.rows, messagesCount: result.count });
}

const deleteUserMessage = async (request, h) => {
  const { notificationId } = request.params;
  const { id } = request.auth.credentials;
  let err, destroyed;

  [err, destroyed] = await Notification.deleteNotification({ notificationId, userId: id });
  if (err === 404)
    return Boom.notFound();

  if (err === 400)
    return Boom.badRequest();

  return h.response();
}

const subscribeToEvent = async (request, h) => {
  const { eventId } = request.params;
  const { id } = request.auth.credentials;
  let err, visitor;
  
  [err, visitor] = await Visitor.subscribeToEvent({ eventId, userId:id });
  if (err)
   return Boom.badRequest(err);

  return h.response();
}

const unsubscribeFromEvent = async (request, h) => {
  const { eventId } = request.params;
  const { id } = request.auth.credentials;
  let err, visitor;
  
  [err, visitor] = await Visitor.unsubscribeFromEvent({ eventId, userId:id });
  if (err)
    return Boom.badRequest(err);

  return h.response();
}

const confirmNotification = async (request, h) => {
  const { id } = request.auth.credentials;
  let err, user;
  
  [err, user] = await User.confirmNotification(id);
  if (err)
    return Boom.badRequest(err);

  return h.response();
}

const signIn = async (request, h) => {
  const { email, password } = request.payload;
  let err, user;
  
  [err, user] = await User.findByCredentials({ email, password });
  if (err)
    return Boom.unauthorized(err);

  const token = await User.generateAuthToken(user);
  return h.response({ user: new UserSafe(user), token });
}

const signUp = async (request, h) => {
  const { name, email, password } = request.payload;
  let err, user;
  
  [err, user] = await User.createUser({ name, email, password });
  if (err)
    return Boom.unauthorized(err);

  const token = await User.generateAuthToken(user);
  return h.response({ user: new UserSafe(user), token });
}

const signOut = async (request, h) => {
  const { id } = request.auth.credentials;

  await User.removeToken(id);

  return h.response();
}

const initUsersController = server => {
  server.route({
    method: 'GET',
    path: '/events/my-events/page/{pageNum}',
    config: {
      auth: 'basic',
      handler: fetchEventsByUserId,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(12).optional().default(EVENTS_COUNT_PER_PAGE)
        },
        params: {
          pageNum: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/events/subscribed/page/{pageNum}',
    config: {
      auth: 'basic',
      handler: fetchSubscribedEvents,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(12).optional().default(EVENTS_COUNT_PER_PAGE)
        },
        params: {
          pageNum: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/users/profile/messages/page/{pageNum}',
    config: {
      auth: 'basic',
      handler: fetchUserMessages,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(12).optional().default(EVENTS_COUNT_PER_PAGE)
        },
        params: {
          pageNum: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/users/profile/notifications/{notificationId}/destroy',
    config: {
      auth: 'basic',
      handler: deleteUserMessage,
      validate: {
        params: {
          notificationId: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/users/{eventId}/subscribe',
    config: {
      auth: 'basic',
      handler: subscribeToEvent,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/users/{eventId}/unsubscribe',
    config: {
      auth: 'basic',
      handler: unsubscribeFromEvent,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/users/notification/confirm',
    config: {
      auth: 'basic',
      handler: confirmNotification
    }
  });

  server.route({
    method: 'POST',
    path: '/auth/sign-in',
    config: {
      handler: signIn,
      validate: {
        payload: {
          email: Joi.string().email().max(50).required(),
          password: Joi.string().max(30).trim().min(6).required()
        }
      }
    }
  });
  
  server.route({
    method: 'POST',
    path: '/auth/sign-up',
    config: {
      handler: signUp,
      validate: {
        payload: {
          name: Joi.string().max(50).trim().min(6).required(),
          email: Joi.string().email().max(50).required(),
          password: Joi.string().max(30).trim().min(6).required()
        }
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/auth/sign-out',
    config: {
      auth: 'basic',
      handler: signOut
    }
  });
}

module.exports = initUsersController;
