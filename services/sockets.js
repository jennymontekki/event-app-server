const socketIo = require('socket.io');
const { User, Event, Visitor, Message, Notification } = require('./../models');
const { notificationTypes } = require('./../config');

let connections = [], io;

const messageToClient = data => io.sockets.in(data.roomId).emit('messageToClient', data);

const createNotifications = async ({ roomId, user }) => {
  const event = await Event.findById(roomId, {
    include: [
      {
        model: Visitor,
        include: [{
          model: User,
          include: [{model: Notification}]
        }]
      },
      {
        model: User,
        include: [{model: Notification}]
      }
    ]
  });

  const usersToNotify = event.visitors.map(visitor => visitor.user.notifications.find(notification => notification.eventId === roomId) ? null : visitor.user.id).filter(userId => userId !== null);

  const notifications = usersToNotify.map(userId => ({ eventId: roomId, userId, type: notificationTypes.newMessages }));

  if (!event.user.notifications.find(notification => notification.eventId === roomId)) notifications.push({ eventId: event.id, userId: event.userId, type: notificationTypes.newMessages });

  const notificationsToCreate = notifications.filter(notification => notification.userId !== user.id);

  await Notification.createNotifications(notificationsToCreate);
}

const connectionHandler = socket => {
  socket.once('disconnect', () => {
    connections = connections.filter(connection => connection.socket.id !== socket.id);
    socket.disconnect();
  });

  socket.on('authenticate', async data => {
    const { socketId, token } = data;
  
    const user = await User.findOne({
      where: { token },
      include: [
        { model: Event },
        { model: Visitor }
      ]
    });

    if (!user) return;
  
    const roomsVisitor = user.visitors.map(visitor => visitor.eventId);
    const roomsHost = user.events.map(event => event.id);
    const rooms = [...roomsVisitor, ...roomsHost];
  
    rooms.forEach(room => socket.join(room));
  
    connections = connections.map(connection => connection.socket.id === socket.id ? { ...connection, token, user: user.dataValues, rooms } : connection);
  });

  socket.on('messageToServer', async data => {
    const { roomId, message } = data;
  
    const user = connections.find(connection => connection.socket.id === socket.id).user;

    const messageToAdd = { eventId: roomId, message, userId: user.id };
    await Message.createMessage(messageToAdd);

    const addedMessage = await Message.findOne({ attributes: ['updatedAt'], where: { eventId: roomId, message, userId: user.id } });

    const response = { ...addedMessage.dataValues, roomId, message, user: { name: user.name } };
    messageToClient(response);

    await createNotifications({ roomId, user });
  });

  socket.on('enterLeaveRoom', data => {
    const { type, roomId } = data;

    if (type === 'enter') {
      socket.join(roomId);
      connections = connections.map(connection => connection.socket.id === socket.id ? { ...connection, rooms: [...connection.rooms, roomId] } : connection);
      return;
    }

    socket.leave(roomId);
    connections = connections.map(connection => connection.socket.id === socket.id ? { ...connection, rooms: connection.rooms.filter(room => room !== roomId) } : connection);
  });

  socket.on('socketDisconnect', () => connections = connections.filter(connection => connection.socket.id !== socket.id));

  connections.push({ socket });
}

const initSocketsService = server => {
  io = socketIo.listen(server.listener);
  io.sockets.on('connection', connectionHandler)
}

module.exports = { initSocketsService };