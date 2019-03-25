const Joi = require('joi');
const { CATEGORIES_COUNT, EVENTS_COUNT_PER_PAGE } = require('./../config');
const { Category, Event, User } = require('./../models');

const fetchAllCategories = async (request, h) => {
  const categories = await Category.findAll();

  return h.response(categories);
}

const fetchEventsByCategoryId = async (request, h) => {
  const { categoryId, pageNum } = request.params;
  const { limit } = request.query;

  const result = await Event.findAndCountAll({
    limit,
    order: [ ['updatedAt', 'DESC'] ],
    offset: limit * (pageNum - 1),
    attributes: ['id', 'title', 'address', 'date'],
    include: [
      {
        model: Category,
        attributes: ['id', 'name', 'key'],
        where: { id: categoryId }
      },
      {
        model: User,
        attributes: ['name']
      },
    ]
  });

  return h.response({ events: result.rows, eventsCount: result.count });
}

const initCategoriesController = server => {
  server.route({
    method: 'GET',
    path: '/api/categories',
    handler: fetchAllCategories
  });

  server.route({
    method: 'GET',
    path: '/api/categories/{categoryId}/events/page/{pageNum}',
    config: {
      handler: fetchEventsByCategoryId,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(12).optional().default(EVENTS_COUNT_PER_PAGE)
        },
        params: {
          categoryId: Joi.number().integer().min(1).max(CATEGORIES_COUNT).required(),
          pageNum: Joi.number().integer().min(1).required()
        }
      }
    }
  });
}

module.exports = initCategoriesController;
