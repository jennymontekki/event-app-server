# EVENTS APP

Events application allows people to look through events, add or edit own events, subscribe to others events, and have a chat with each other, it is built with React + Redux + bootstrap 4 + Google maps + Hapi + Sequelize + Nodemailer + Socket.io.

## Requirements

node version 8-9.
sequelize-cli installed `npm i -g sequelize-cli`.

## Getting Started

Application requires next actions to be done before using it:

1. Clone or download repository.
2. Open terminal and go to the `server` folder.
3. Run `npm i`.
4. Run `npm start`.
5. Open another terminal and go to the `client` folder.
6. Run `npm i`.
7. Run `npm start`.

Congratulations! Events application is up and running...

***

## Features:

### Client side:

- Built with **JavaScript** libraries such as **React-Redux** and **ReactJS**(version 16).
- Implements *`component based`* architecture:
  - [x] containers/presentational components.
  - [x] one-way dataflow.
  - [x] lifecycle hooks.
  - [x] custom HOCs.
  - [x] custom middleware.
  - [x] react-router-dom + react-router-redux.
- Implements *`form inputs data validation`* and *`notification system`* and *`loading spinner`* for better UX.
- Implements *`JWT based athorization`*.
- Implements *`404 HTTP interceptor`*.
- Integrates **Google maps** and **place autocomplete**.
- Implements *`pagination`* for dynamic content loading.
- Uses semantic **HTML5**.
- Uses **Socket.io**.
- **Bootstrap 4** and **CSS3(BEM)** used for responsive web design implementation.
- Uses module bundler **Webpack** for module system benefits, also for transpiling ES6 to ES5.
- **ES2015** syntax.
- Uses **Jest** + **Enzyme** for unit testing.

***

### Server side:

- Built with **Node.js** framework **Hapi.js**.
- Provides *`endpoints`* for fetching events data, editing, creating, deleting events.
- Implements *`JWT based athorization`*.
- Implements *`hashing passwords`*.
- For storing users and events data used SQL database **SQLite**(dev), **PostgreSQL**(prod).
- **ORM sequelize** used for manipulating database purposes.
- Includes plugin that protects specific endpoints from interacting with unathorized users.
- Includes plugin that  notifies visitors about event changes.
- Integrates **Nodemailer** for sending emails to visitors when event that they've been subscribed to changes.
- Uses **Socket.io**.
- Uses *`migrations and seeders for manipulating database structure and data`*.
- Implements **Joi** *`data validation for routes and models`*.
- **ES2015** syntax + **async await** functionality.
- Uses **Mocha** + **Expect** for unit testing.

***

## PS:

In case something goes wrong(that is unlikely to happen) i recommend to shut down server and run:
  1. sequelize db:migrate:undo:all
  2. sequelize db:migrate
  3. sequelize db:seed:all
  4. Run `npm start` from server folder afterwards.