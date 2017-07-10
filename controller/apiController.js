import bodyParser from 'body-parser';
import config from '../config';

const userDAO = require('../model/user');

export const apiController = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/api/user', (req, res) => {
    console.log(req.body);

    userDAO.getUser({ firstname: 'Ishan' });
    res.sendStatus(200);
    res.end('heh?');
  });

  app.post('/api/register', (req, res) => {
    userDAO.saveUser(req.body);
    res.sendStatus(200);
  });
};
