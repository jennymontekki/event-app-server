const expect = require('expect');
const request = require('supertest');
const { server } = require('./../index');
const { Event } = require('./../models');
const { getTestUsers, getEventDetailsNewEvent, getEventDetailsEditedEvent } = require('./../helpers/dataForTests');

const { userHost, userAuthenticated, userVisitor } = getTestUsers();
const eventDetailsNewEvent = getEventDetailsNewEvent();
const eventDetailsEditedEvent = getEventDetailsEditedEvent();

let userTemp = {};
let eventId = null;

describe('add event api', () => {
  it('should create a new event', done => {
    request(server.listener)
      .post('/api/event/add')
      .set('Authorization', userHost.token)
      .send(eventDetailsNewEvent)
      .expect(200)
      .expect(res => {
        eventId = res.body.id;
        expect(res.body).toEqual({ id: expect.any(Number) });
      })
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 400 for attempt to create a new event with invalid body', done => {
    request(server.listener)
      .post('/api/event/add')
      .set('Authorization', userHost.token)
      .send({})
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for attempt to create a new event for user with wrong', done => {
    request(server.listener)
      .post('/api/event/add')
      .set('Authorization', 'wrong token')
      .send(eventDetailsNewEvent)
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for attempt to create a new event for unathenticated user', done => {
    request(server.listener)
      .post('/api/event/add')
      .send(eventDetailsNewEvent)
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });
});

describe('edit event api', () => {
  it('should edit event', done => {
    request(server.listener)
      .put(`/api/event/${eventId}/edit`)
      .set('Authorization', userHost.token)
      .send(eventDetailsEditedEvent)
      .expect(200)
      .expect(res => expect(res.body).toEqual({ id: expect.any(Number) }))
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 400 for attempt to edit event for authenticated user that did not create this event', done => {
    request(server.listener)
      .put(`/api/event/${eventId}/edit`)
      .set('Authorization', userAuthenticated.token)
      .send(eventDetailsEditedEvent)
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for attempt to edit event for unauthenticated user', done => {
    request(server.listener)
      .put(`/api/event/${eventId}/edit`)
      .send(eventDetailsEditedEvent)
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 404 for attempt to edit event that does not exist', done => {
    request(server.listener)
      .put('/api/event/1000000000/edit')
      .set('Authorization', userHost.token)
      .send(eventDetailsEditedEvent)
      .expect(404)
      .end((err, res) => err ? done(err) : done());
  });
});

describe('delete event api', () => {
  it('should return 404 for attempt to delete event that does not exist', done => {
    request(server.listener)
      .delete('/api/event/1000000000/destroy')
      .set('Authorization', userHost.token)
      .send()
      .expect(404)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 400 for attempt to delete event for authenticated user that did not create this event', done => {
    request(server.listener)
      .delete(`/api/event/${eventId}/destroy`)
      .set('Authorization', userAuthenticated.token)
      .send()
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for attempt to delete event for unauthenticated user', done => {
    request(server.listener)
      .delete(`/api/event/${eventId}/destroy`)
      .send()
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });

  it('should delete recently created event', done => {
    request(server.listener)
      .delete(`/api/event/${eventId}/destroy`)
      .set('Authorization', userHost.token)
      .send()
      .expect(200)
      .end((err, res) => err ? done(err) : done());
  });
});

describe('auth sign-up api', () => {
  it('should create new user and authenticate him', done => {
    request(server.listener)
      .post('/api/auth/sign-up')
      .send({ name: `${userAuthenticated.name}${Math.round(Math.random() * 1000000)}`, email: `${Math.round(Math.random() * 1000000)}${userAuthenticated.email}`, password: userAuthenticated.name })
      .expect(200)
      .expect(res => {
        userTemp = res.body.user;
        userTemp.token = res.body.token;
        expect(res.body).toEqual({ token: expect.any(String), user: { name: expect.any(String), email: expect.any(String), token: expect.any(String) } });
      })
      .end((err, res) => err ? done(err) : done());
  });

  it('should return message \'email is already taken\' if desired email is already taken', done => {
    request(server.listener)
      .post('/api/auth/sign-up')
      .send({ name: 'any name', email: userAuthenticated.email, password: 'any password' })
      .expect(401)
      .expect(res => expect(res.body.message).toBe('email is already taken'))
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 400 for attempt to sign up with invalid body', done => {
    request(server.listener)
      .post('/api/auth/sign-up')
      .send({ name: 'any name', email: 'any wrong email', password: 'any password' })
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return message \'name is already taken\' if desired name is already taken', done => {
    request(server.listener)
      .post('/api/auth/sign-up')
      .send({ name: userAuthenticated.name, email: 'any.email@gmail.com', password: 'any password' })
      .expect(401)
      .expect(res => expect(res.body.message).toBe('name is already taken'))
      .end((err, res) => err ? done(err) : done());
  });
});

describe('auth sign-in api', () => {
  it('should authenticate user', done => {
    request(server.listener)
      .post('/api/auth/sign-in')
      .send({ email: userVisitor.email, password: userVisitor.name })
      .expect(200)
      .expect(res => {
        userTemp.token = res.body.token;
        expect(res.body).toEqual({ token: expect.any(String), user: { name: expect.any(String), email: expect.any(String) } });
      })
      .end((err, res) => err ? done(err) : done());
  });

  it('should return message \'user with this email does not exist\' for wrong email input', done => {
    request(server.listener)
      .post('/api/auth/sign-in')
      .send({ email: 'wrong.email@gmail.com', password: userAuthenticated.name })
      .expect(401)
      .expect(res => expect(res.body.message).toBe('user with this email does not exist'))
      .end((err, res) => err ? done(err) : done());
  });

  it('should return message \'wrong credentials\' for wrong password input', done => {
    request(server.listener)
      .post('/api/auth/sign-in')
      .send({ email: userAuthenticated.email, password: 'wrong password' })
      .expect(401)
      .expect(res => expect(res.body.message).toBe('wrong credentials'))
      .end((err, res) => err ? done(err) : done());
  });
});

describe('myEvents and subscribedEvents api', () => {
  it('should return events that were created by this user', done => {
    request(server.listener)
      .get('/api/events/my-events/page/1')
      .set('Authorization', userHost.token)
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.events).toEqual([{
          id: 61,
          title: 'test event 1',
          address: 'Ushakova Ave, 25, Kherson, Khersons\'ka oblast, Ukraine, 73009',
          date: '2018-06-13T14:00:13.000Z',
          category: { id: 6, name: 'Earth Science', key: 'category-earth-science' },
          user: { name: 'test.userHost' }
        }]);
      })
      .end((err, res) => err ? done(err) : done());
  });

  it('should return events that user has been subscribed to', done => {
    request(server.listener)
      .get('/api/events/subscribed/page/1')
      .set('Authorization', userAuthenticated.token)
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.events).toEqual([{
          id: 61,
          title: 'test event 1',
          address: 'Ushakova Ave, 25, Kherson, Khersons\'ka oblast, Ukraine, 73009',
          date: '2018-06-13T14:00:13.000Z',
          category: { id: 6, name: 'Earth Science', key: 'category-earth-science' },
          user: { name: 'test.userHost' }
        }]);
      })
      .end((err, res) => err ? done(err) : done());
  });
});

describe('subscribe and unsubscribe api', () => {
  it('should subscribe user to event', done => {
    request(server.listener)
      .post('/api/users/61/subscribe')
      .set('Authorization', userTemp.token)
      .send()
      .expect(200)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for unathenticated user on subscribe', done => {
    request(server.listener)
      .post('/api/users/61/subscribe')
      .send()
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });

  it('should unsubscribe user from event', done => {
    request(server.listener)
      .delete('/api/users/61/unsubscribe')
      .set('Authorization', userTemp.token)
      .send()
      .expect(200)
      .end((err, res) => err ? done(err) : done());
  });
});

describe('auth sign-out api', () => {
  it('should unauthenticate user', done => {
    request(server.listener)
      .delete('/api/auth/sign-out')
      .set('Authorization', userTemp.token)
      .send()
      .expect(200)
      .end((err, res) => err ? done(err) : done());
  });

  it('should return 401 for unauthenticated user', done => {
    request(server.listener)
      .delete('/api/auth/sign-out')
      .send()
      .expect(401)
      .end((err, res) => err ? done(err) : done());
  });
});