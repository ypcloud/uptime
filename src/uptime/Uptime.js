const assert = require('assert');
const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');

// '/uptimes', this.getUptimes
// '/downtimes', this.getDowntimes
// '/sla', this.getSLA
// '/infras', this.getInfras

class Uptime {

  constructor({
    connections,
  }) {
    assert(connections && connections.mongo, 'expected mongo');

    this.connections = connections;

    // create index on uptime
    Promise.resolve(this.connections.mongo)
      .then(db => db.collection('uptime').createIndex({ category: 1, kind: 1, namespace: 1 }))
      .then(index => assert.equal('category_1_kind_1_namespace_1', index));

    // create index on uptime_history
    Promise.resolve(this.connections.mongo)
      .then(db => db.collection('uptime_history').createIndex({ _id_uptime: 1, down_start_date: 1, down_end_date: 1 }))
      .then(index => assert.equal('_id_uptime_1_down_start_date_1_down_end_date_1', index));

    // create index on daily_uptime
    Promise.resolve(this.connections.mongo)
      .then(db => db.collection('daily_uptime').createIndex({ _id_uptime: 1, date: 1 }))
      .then(index => assert.equal('_id_uptime_1_date_1', index));

    // create index on weekly_uptime
    Promise.resolve(this.connections.mongo)
      .then(db => db.collection('weekly_uptime').createIndex({ _id_uptime: 1, date: 1 }))
      .then(index => assert.equal('_id_uptime_1_date_1', index));

    // create index on monthly_uptime
    Promise.resolve(this.connections.mongo)
      .then(db => db.collection('monthly_uptime').createIndex({ _id_uptime: 1, date: 1 }))
      .then(index => assert.equal('_id_uptime_1_date_1', index));
  }

  getServiceIdOrThrow({ category, kind, namespace, url, uptimeId }) {
    if (uptimeId) {
      return Promise.resolve(new ObjectId(uptimeId));
    }

    const query = {};

    if (category) {
      query.category = category;
    }

    if (kind) {
      query.kind = kind;
    }

    if (namespace) {
      query.ns = namespace;
    }

    if (url) {
      query.description = url;
    }

    return Promise.resolve(this.connections.mongo)
      .then(db => db.collection('uptime').findOne(query))
      .then((service) => {
        if (service) {
          return service._id;
        }

        throw new Error('Service not found');
      });
  }

  getInfras({ kind }) {
    const query = {
      category: 'infra'
    };

    if (kind) {
      query.kind = kind;
    }

    return Promise.resolve(this.connections.mongo)
      .then(db => db.collection('uptime').find(query, {
        category: true,
        kind: true,
        description: true,
        status: true,
        status_public: true
      }))
      .then(plain => plain.toArray());
  }

  getUptimes({ uptimeId, category, kind, namespace, url, interval, since, to }) {
    if (!uptimeId && !kind && !namespace) {
      return Promise.reject(new Error('At least "uptimeId", "kind" or "namespace" is required'));
    }

    if (!since || !to) {
      return Promise.reject(new Error('"since" and "to" are required, as Unix'));
    }

    if (interval !== 'daily' && interval !== 'weekly' && interval !== 'monthly') {
      return Promise.reject(new Error('"interval" is required as daily|weekly|monthly'));
    }

    const TABLE = `${interval}_uptime`;

    return this.getServiceIdOrThrow({ uptimeId, category, kind, namespace, url })
      .then(_uptimeId => Promise.resolve(this.connections.mongo)
        .then(db => db.collection(TABLE))
        .then(collection => collection.find({
          $and: [
            { _id_uptime: _uptimeId },
            { date: { $gte: since } },
            { date: { $lte: to } }
          ]
        }, { _id_uptime: true, date: true, sla: true })))
      .then(plain => plain.toArray())
      .then((uptimes) => {
        // add labels to make it à la NewRelic
        let labelPrefix;
        let labelFormat;

        if (interval === 'weekly') {
          labelPrefix = 'Week of ';
          labelFormat = 'MMMM Do, YYYY';
        } else if (interval === 'monthly') {
          labelPrefix = '';
          labelFormat = 'MMMM YYYY';
        } else {
          labelPrefix = '';
          labelFormat = 'MMMM Do, YYYY';
        }

        uptimes.forEach((uptime) => {
          uptime.label = `${labelPrefix}${moment.utc(uptime.date * 1000).format(labelFormat)}`; // eslint-disable-line no-param-reassign
        });

        return uptimes;
      })
      .catch(() => []);
  }

  // get all history where: id_uptime of svc and
  // ( ( down_start_date >= start_date or down_end_date = 0 )
  // and down_start_date <= start_date + 7j)
  getDowntimes({ uptimeId, category, kind, namespace, url, since, to }) {
    if (!uptimeId && !kind && !namespace) {
      return Promise.reject(new Error('At least "uptimeId", "kind" or "namespace" is required'));
    }

    return this.getServiceIdOrThrow({ uptimeId, category, kind, namespace, url })
      .then(_uptimeId => Promise.resolve(this.connections.mongo)
        .then(db => db.collection('uptime_history'))
        .then(collection => collection.find({
          $and: [
            { _id_uptime: _uptimeId },
            { $and: [
              { down_start_date: { $lt: to } },
              { $or: [
                { down_end_date: { $gt: since } },
                { down_end_date: 0 }
              ] }
            ] }
          ]
        }, { _id_uptime: true, down_start_date: true, down_end_date: true, extra: true })))
      .then(plain => plain.toArray())
      .catch(() => []);
  }

  getSLA({ uptimeId, category, kind, namespace, url, since, to }) {
    if (!since || !to) {
      return Promise.reject(new Error('"since" and "to" are required, as Unix'));
    }

    if (!uptimeId && !kind && !namespace) {
      return Promise.reject(new Error('At least "uptimeId", "kind" or "namespace" is required'));
    }

    let down = 0;
    const duration = (to - since);

    return this.getDowntimes({ uptimeId, category, kind, namespace, url, since, to })
      .then((downtimes) => {
        for (let i = 0; i < downtimes.length; ++i) {
          const downtime = downtimes[i];

          let start = downtime.down_start_date;
          let end = downtime.down_end_date;

          // fit to the start_date of the period
          if (start < since) {
            start = since;
          }

          // fit to the end of the period
          if (end === 0 || end > to) {
            end = to;
          }

          down += (end - start);
        }

        // if a downtime in progress started before the start_date,
        // the down calculate will be longer than the duration
        /* istanbul ignore next */
        if (down > duration) {
          console.log('DOWN > DURATION, WHICH SHOULD NEVER HAPPEN');
          down = duration;
        }

        return 100 - ((down * 100) / duration);
      });
  }
}

module.exports = {
  Uptime,
};
