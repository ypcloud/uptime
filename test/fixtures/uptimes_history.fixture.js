const ObjectId = require('mongodb').ObjectId;

module.exports = [
  {
    _id: new ObjectId('59ced13c750d195bab575bbe'),
    _id_uptime: new ObjectId('59cecf14750d195a7c987702'),
    down_start_date: 1506972863,
    down_end_date: 1507577663,
    description: 'Infra/Mongo, down_end_date = down_start_date + 604800 (7 days)'
  },
  {
    _id: new ObjectId('59cedcaf750d195f44c2744b'),
    _id_uptime: new ObjectId('59cecf14750d195a7c987702'),
    down_start_date: 1507577663,
    down_end_date: 1508182464,
    description: 'Infra/Mongo, down_end_date = down_start_date + 604800 (7 days)'
  },
  {
    _id: new ObjectId('59cedcaf750d195f44c2745c'),
    _id_uptime: new ObjectId('59d270e8750d192d08575f98'),
    down_start_date: 1506963688,
    down_end_date: 0,
    description: '59d270e8750d192d08575f98, down_end_date = down_start_date + 604800 (7 days)'
  },
  {
    _id: new ObjectId('59d29266750d192da0e6d143'),
    _id_uptime: new ObjectId('59d270e8750d192d08575f9c'),
    down_start_date: 1506816000,
    down_end_date: 1506823200,
    description: 'ElasticSearch, down Oct. 1st, from 12:00am to 2:00am'
  },
  {
    _id: new ObjectId('59d294bf750d192da0e6d146'),
    _id_uptime: new ObjectId('59d27108750d192d0857609c'),
    down_start_date: 1506816000,
    down_end_date: 1506823200,
    description: 'console-server, down Oct. 1st, from 12:00am to 2:00am'
  },
  {
    _id: new ObjectId('59d294c4750d192da0e6d147'),
    _id_uptime: new ObjectId('59d27108750d192d0857609c'),
    down_start_date: 1506902400,
    down_end_date: 1506945600,
    description: 'console-server, down Oct. 2nd, from 12:00am to 12:00pm'
  }
];
