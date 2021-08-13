import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/send', (req, res) => {
  console.log('send endpoint!');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.send('hi');
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
