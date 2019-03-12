const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const { SERVER_ROUTE, EVENT_DETAILS_ROUTE } = require('./../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'email.js.development@gmail.com',
    clientId: '1037294383496-4fbotocn2lmmbfa2214f1ibqqogemdoe.apps.googleusercontent.com',
    clientSecret: 'q9l2PIOf1v-Ant3RXKmEGnsJ',
    refreshToken: '1/oj38uTZcZgCM2WoXAnmWNb7b5xi2kqy-u_8uDXuYlrA5SCEb1YxTIf9t-fC_z9dY'
  }
});

const mailOptions = {
  from: 'noreplay <reactEventApp>',
  text: 'Event was changed!'
};

const sendMail = ({ event, updatedFields }) => {
  const { id, title, visitors } = event;
  const list = updatedFields.map(field => {
    if (field !== null)
      return `<li style="color:red">${field.toUpperCase()}</li>`;
    return '';
  });

  const mailMainInfo = `
    <h1>Following event info was changed</h1>
    <ol>${list.join('')}</ol>
    <a href="${SERVER_ROUTE}/${EVENT_DETAILS_ROUTE}/${id}">Check it out</a>
  `;

  // if (list.some(item => item !== '')) {
  //   visitors.forEach(visitor => {
  //     transporter.sendMail({
  //       ...mailOptions,
  //       subject: title,
  //       to: visitor.user.email,
  //       html: mailMainInfo
  //     }, (err, res) => {
  //       err ? console.log(err) : console.log('Email sent to ', visitor.user.email);
  //     });
  //   });
  // }
}

module.exports = {
  sendMail
};