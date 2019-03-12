const Joi = require('joi');
const Boom = require('boom');
const Sequelize = require('sequelize');
const { EventSkeleton } = require('./../skeletons/event');
const { CATEGORIES_COUNT, EVENTS_COUNT_PER_PAGE } = require('./../config');
const { sendMail } = require('./../services/mail');
const { Category, User, Event, Visitor, Message } = require('./../models');

const fetchAllEvents = async (request, h) => {
  const { pageNum } = request.params;
  const { limit } = request.query;
  
  const result = await Event.findAndCountAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    offset: limit * (pageNum - 1),
    attributes: ['id', 'title', 'address', 'date'],
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

  return h.response({ events: result.rows, eventsCount: result.count});
}

const fetchEventsSearch = async (request, h) => {
  const { q, limit } = request.query;
  
  const events = await Event.findAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    where: {
      title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${q}%`)
    },
    attributes: ['id', 'title']
  });

  return h.response(events);
}

const fetchEventDetails = async (request, h) => {
  const { eventId } = request.params;

  const eventDetails = await Event.findById(eventId, {
    attributes: ['id', 'title', 'address', 'location', 'description', 'date'],
    include: [
      {
        model: Category,
        attributes: ['id', 'name', 'key']
      },
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Visitor,
        attributes: ['updatedAt'],
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ]
      }
    ]
  });

  if (eventDetails === null)
    return Boom.notFound();

  return h.response(eventDetails);
}

const fetchEventMessages = async (request, h) => {
  const { eventId } = request.params;

  const eventMessages = await Message.findAll({
    where: { eventId },
    attributes: ['message', 'updatedAt'],
    include : [
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  if (eventMessages === null)
    return Boom.notFound();

  return h.response(eventMessages);
}

const createEvent = async (request, h) => {
  const payload = new EventSkeleton(request.payload);
  const { id } = request.auth.credentials;
  let err, createdEvent;

  [err, createdEvent] = await Event.createEvent({ payload, userId: id });
  if (err)
    return Boom.badRequest(err);

  return h.response({ id: createdEvent.id });
}

const updateEvent = async (request, h) => {
  const { eventId } = request.params;
  const payload = new EventSkeleton(request.payload);
  const { id } = request.auth.credentials;
  let err, data;

  [err, data] = await Event.updateEvent({ payload, userId: id, eventId });
  if (err) {
    if (err === 404)
      return Boom.notFound();

    if (err === 400)
      return Boom.badRequest();

    return Boom.badRequest(err);
  }

  sendMail({ ...data });

  return h.response({ id: eventId });
}

const deleteEvent = async (request, h) => {
  const { eventId } = request.params;
  const { id } = request.auth.credentials;
  let err, destroyed;

  [err, destroyed] = await Event.deleteEvent({ eventId, userId: id });
  if (err === 404)
    return Boom.notFound();

  if (err === 400)
    return Boom.badRequest();

  return h.response();
}

const initEventsController = server => {
  server.route({
    method: 'GET',
    path: '/events/page/{pageNum}',
    config: {
      handler: fetchAllEvents,
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
    path: '/events/search',
    config: {
      handler: fetchEventsSearch,
      validate: {
        query: {
          q: Joi.string().optional(),
          limit: Joi.number().integer().min(1).max(12).optional().default(EVENTS_COUNT_PER_PAGE)
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/event/{eventId}/details',
    config: {
      handler: fetchEventDetails,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/event/{eventId}/messages',
    config: {
      handler: fetchEventMessages,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/event/add',
    config: {
      auth: 'basic',
      handler: createEvent,
      validate: {
        payload: {
          title: Joi.string().max(80).trim().min(6).required(),
          address: Joi.string().required(),
          location: Joi.object().keys({ lat: Joi.number().required(), lng: Joi.number().required() }).length(2).required(),
          description: Joi.string().max(10000).empty('').optional(),
          date: Joi.date().required(),
          categoryId: Joi.number().integer().min(1).max(CATEGORIES_COUNT).required()
        }
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/event/{eventId}/edit',
    config: {
      auth: 'basic',
      handler: updateEvent,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        },
        payload: {
          title: Joi.string().max(80).trim().min(6).required(),
          address: Joi.string().required(),
          location: Joi.object().keys({ lat: Joi.number().required(), lng: Joi.number().required() }).length(2).required(),
          description: Joi.string().max(10000).empty('').optional(),
          date: Joi.date().required(),
          categoryId: Joi.number().integer().min(1).max(CATEGORIES_COUNT).required()
        }
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/event/{eventId}/destroy',
    config: {
      auth: 'basic',
      handler: deleteEvent,
      validate: {
        params: {
          eventId: Joi.number().integer().min(1).required()
        }
      }
    }
  });
}

module.exports = initEventsController;
