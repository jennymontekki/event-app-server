// const initPreResponseHook = server => {
//   const preResponse = (request, h) => {

//     if (request.auth && !request.response.isBoom && request.auth.credentials && !request.auth.credentials.notified)
//       request.response.header('event-changes-notification', 'true');

//     return h.continue;
//   };

//   server.ext('onPreResponse', preResponse);
// }

// module.exports = initPreResponseHook;

const initPreResponseHook = server => {
  const preResponse = (request, h) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (request.auth && !request.response.isBoom && request.auth.credentials && !request.auth.credentials.notified)
          request.response.header('event-changes-notification', 'true');
          Promise.resolve(resolve(h.continue));
      }, 2000);
    })
  };

  server.ext('onPreResponse', preResponse);
}

module.exports = initPreResponseHook;
