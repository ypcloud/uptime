const ObjectId = require('mongodb').ObjectId;

module.exports = [
  {
    _id: new ObjectId('59d27108750d192d0857609c'),
    category: 'ns',
    kind: 'Ingress',
    ns: 'console-server',
    url: 'https://console-server.ypcloud.io',
    status: 1
  },
  {
    _id: new ObjectId('59cecf14750d195a7c987702'),
    category: 'infra',
    kind: 'Mongo',
    name: 'Atlas ypcloud-io-dev',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9a'),
    category: 'infra',
    kind: 'Mongo',
    name: 'Atlas ypcloud-io-qa',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9b'),
    category: 'infra',
    kind: 'Mongo',
    name: 'Atlas ypcloud-io',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9c'),
    category: 'infra',
    kind: 'ElasticSearch',
    name: 'es-ypcloud-io',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f98'),
    category: 'ns',
    kind: 'Ingress',
    ns: 'cloudypc-configmixer-svc-develop',
    url: 'https://dev-ypapi.ypcloud.io/cloud/v1/config/health',
    status: 1
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9d'),
    category: 'ns',
    kind: 'Ingress',
    ns: 'odsods-req-svc-develop',
    url: 'https://odsods-req-svc-develop.ypcloud.io/ods-req-svc/health',
    status: 1
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9f'),
    kind: 'Ingress',
    ns: 'rdheadings-develop',
    url: 'https://rdheadings-develop.ypcloud.io/rdheadings/health',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575f9e'),
    category: 'ns',
    kind: 'Ingress',
    ns: 'ss-emailva-develop',
    url: 'https://ss-emailva-develop.ypcloud.io/health',
    status: 0
  },
  {
    _id: new ObjectId('59d270e8750d192d08575fa0'),
    category: 'ns',
    kind: 'Ingress',
    ns: 'odsods-req-svc',
    url: 'https://odsods-req-svc.ypcloud.io/ods-req-svc/health',
    status: 1
  }
];
