const config = require('../config')
  sg = require('sendgrid')(config.mail.sendgrid)


function mailUser(user, subject, body){
  console.log('mailing', user, subject, body)
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: user.email,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: 'login@simplehedron.com',
      },
      content: [
        {
          type: 'text/html',
          value: body,
        },
      ],
    },
  });

  return sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.statusCode);
    });
}

module.exports = {
  mailUser
}