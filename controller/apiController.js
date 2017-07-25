import bodyParser from 'body-parser';
import config from '../config';
import moment from 'moment';

const userDAO = require('../model/user');

export const apiController = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/test', (req, res) => {
    console.log('Here is your moment: ' + moment());
    res.end('Yellow!' + moment(1500964949260).format('l'));
  });
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
