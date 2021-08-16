import express from 'express';

const sanitizer = require('string-sanitizer');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const port = process.env.PORT || 5000;
const expressApp = express();

export function sendEmail(emailAddress: string, emailProvider: any, res: express.Response) {
  console.log(`Sending email to ${emailAddress}`)

  const msg = {
    to: emailAddress,
    from: 'chenphilh@gmail.com',
    subject: 'Test Subject',
    text: 'Test text',
  };
  emailProvider
    .send(msg)
    .then((response) => {
      console.log(response[0]);
      res.status(response[0].statusCode);
      res.send(response[0].statusMessage);
    })
    .catch((error) => {
      console.log("Error in sending email!");
      console.error(error.response.body.errors);
      res.status(error.code);
      res.send(error.response.body.errors[0].message);
    });
}

export function handleRequest(req: express.Request, res: express.Response, emailProvider: any) {
  const emailAddress = req.body.emailAddress;
  if (!sanitizer.validate.isEmail(emailAddress)) {
    res.status(403);
    res.send('Please enter a valid email address!');
    return;
  }
  sendEmail(emailAddress, emailProvider, res);
}

function server(app: any, emailProvider: any) {
  emailProvider.setApiKey(process.env.SENDGRID_API_KEY);
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cors({ origin: 'http://localhost:3000', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' }));
  app.post('/send_email', (req: express.Request, res: express.Response) =>
    handleRequest(req, res, emailProvider)
  );
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

server(expressApp, sgMail);
