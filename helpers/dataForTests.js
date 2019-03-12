const userHost = {
  id: 41,
  name: 'test.userHost',
  email: 'test.userHost@gmail.com',
  password: '$2a$10$gQ3aYnYt/QLBo2wgDfEdIOYuPnCVBvJU546owduHvt3MRnbjwXIiK',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJ0ZXN0LnVzZXJIb3N0IiwiZW1haWwiOiJ0ZXN0LnVzZXJIb3N0QGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEwOjMwLjg5MVoiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEwOjMwLjg5MVoiLCJpYXQiOjE1Mjg4NDE0MzF9.HAGdlb4FFecmmFNhN7mZ8UHQ_aMJx5xJwMEwjBb0CN4',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const userAuthenticated = {
  id: 42,
  name: 'test.userAuthenticated',
  email: 'test.userAuthenticated@gmail.com',
  password: '$2a$10$Ts6.axl6HbGFtNfqenpdZeGIBa5oW.rHKb565da9w8F4VuvDzsv1S',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJ0ZXN0LnVzZXJBdXRoZW50aWNhdGVkIiwiZW1haWwiOiJ0ZXN0LnVzZXJBdXRoZW50aWNhdGVkQGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEyOjExLjQ1M1oiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEyVDIyOjEyOjExLjQ1M1oiLCJpYXQiOjE1Mjg4NDE1MzF9.DBdo369FhQfIeRZtWRH4iraqdeHR5o5iXdtg1sbSpFo',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const userVisitor = {
  id: 43,
  name: 'test.userVisitor',
  email: 'test.userVisitor@gmail.com',
  password: '$2a$10$dOegXQzELCw/hti4wm1RQujEGvKZ9Pwqgo0W.aVPO6smD5QHuVwS2',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJ0ZXN0LnVzZXJWaXNpdG9yIiwiZW1haWwiOiJ0ZXN0LnVzZXJWaXNpdG9yQGdtYWlsLmNvbSIsIm5vdGlmaWVkIjp0cnVlLCJ1cGRhdGVkQXQiOiIyMDE4LTA2LTEzVDA3OjAzOjQxLjEzNVoiLCJjcmVhdGVkQXQiOiIyMDE4LTA2LTEzVDA3OjAzOjQxLjEzNVoiLCJpYXQiOjE1Mjg4NzM0MjF9.a7wdOWeEE-BLv8UHANU1d1-tFzYZYXMndWAggTSqrUA',
  notified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const event = {
  id: 61,
  title: 'test event 1',
  address: 'Ushakova Ave, 25, Kherson, Khersons\'ka oblast, Ukraine, 73009',
  location: JSON.stringify({ lat:46.635417, lng :32.616867 }),
  description: 'test event description',
  date: '2018-06-13 14:00:13.000 +00:00',
  categoryId: 6,
  userId: 41,
  createdAt: '2018-06-12 22:24:12.285 +00:00',
  updatedAt: '2018-06-12 22:24:12.285 +00:00'
};

const visitor = {
  id: 201,
  eventId: 61,
  userId: 42,
  createdAt: '2018-06-12 23:24:12.285 +00:00',
  updatedAt: '2018-06-12 23:24:12.285 +00:00'
}

const eventDetailsNewEvent = {
  title: 'test event 2',
  address: 'Paryz\'koi Komuny St, Kherson, Khersons\'ka oblast, Ukraine, 73000',
  location: {
    lat: 46.6376803,
    lng: 32.6181838
  },
  description: '',
  categoryId: 7,
  date: '2018-05-29T08:55:00.000Z'
};

const eventDetailsEditedEvent = {
  ...eventDetailsNewEvent,
  title: 'test event 3',
  description: 'event description',
  categoryId: 8,
};

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

const getTestUsers = () => ({ userHost, userAuthenticated, userVisitor });
const getTestEvent = () => event;
const getTestVisitor = () => visitor;
const getEventDetailsNewEvent = () => eventDetailsNewEvent;
const getEventDetailsEditedEvent = () => eventDetailsEditedEvent;
const getCategories = () => categories;

module.exports = {
  getTestUsers,
  getTestEvent,
  getTestVisitor,
  getEventDetailsNewEvent,
  getEventDetailsEditedEvent,
  getCategories
};