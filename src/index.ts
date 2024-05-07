import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors())
const port = 8080;

import { DbController} from './db.controller';

const dbCtrl = new DbController();

app.get('/', (_req, res) => {
  return res.send('Express Typescript on Vercel')
})

app.get('/count', async (req, res) => {
  res.send(
    await dbCtrl.query({query : "select count(*) from tusg_content_421614_466"})
  );
});

app.get('/all', async (req, res) => {
  res.send(
    await dbCtrl.query({query : "select * from tusg_content_421614_466"})
  );
});

app.post('/query', async (req, res) => {

  console.log(req);

  res.send(
    await dbCtrl.query(req.body)
  );
});


app.post('/create_table', async (req, res) => {
  res.send(
    await dbCtrl.create_table(req.body)
  );
});


app.post('/mutate_table', async (req, res) => {

  try {

    res.send(
      await dbCtrl.mutate_table()
    );

  } catch (err) {
    
    res.json(err)
  }
});

app.post('/record', async (req, res) => {

  console.log(req.body)

  try {

    res.send(
      await dbCtrl.write_record(req.body)
    );

  } catch (err) {
    
    res.json(err)
  }
});



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


