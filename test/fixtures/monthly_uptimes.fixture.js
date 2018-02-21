const ObjectId = require('mongodb').ObjectId;

module.exports = [
  {
    _id_uptime: new ObjectId('59d27108750d192d0857609c'),
    date: 1506816000,
    sla: 55,
    description: 'console-server, Oct. 1st, 2017'
  },
  {
    _id_uptime: new ObjectId('59d27108750d192d0857609c'),
    date: 1509494400,
    sla: 90,
    description: 'console-server, Nov. 1st, 2017'
  },
  {
    _id_uptime: new ObjectId('59d27108750d192d0857609c'),
    date: 1512086400,
    sla: 100,
    description: 'console-server, Dec. 1st, 2017'
  },
  {
    _id_uptime: new ObjectId('59cecf14750d195a7c987702'),
    date: 1506816000,
    sla: 100,
    description: 'Infra/Mongo, Oct. 1st, 2017'
  }
];
