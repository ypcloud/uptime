/* global expect fixtures daysToSeconds hoursToSeconds */
const proxyquire = require('proxyquire');
const uptimeFixture = require('../../test/fixtures/uptimes.fixture.js');
const uptimeHistoryFixture = require('../../test/fixtures/uptimes_history.fixture.js');
const dailyUptimeFixture = require('../../test/fixtures/daily_uptimes.fixture.js');
const weeklyUptimeFixture = require('../../test/fixtures/weekly_uptimes.fixture.js');
const monthlyUptimeFixture = require('../../test/fixtures/monthly_uptimes.fixture.js');
const { Uptime } = require('./Uptime');

describe('Test suite for Uptime', () => {
  let uptime;

  beforeEach(() => {
    // initialize
    return Promise.resolve()
      // remove/populate db with fixture uptimes
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('uptime').deleteMany({}))
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('uptime').insertMany(uptimeFixture))
      // remove/populate db with fixture uptimes_history
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('uptime_history').deleteMany({}))
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('uptime_history').insertMany(uptimeHistoryFixture))
      // remove/populate db with fixture daily_uptimes
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('daily_uptime').deleteMany({}))
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('daily_uptime').insertMany(dailyUptimeFixture))
      // remove/populate db with fixture weekly_uptimes
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('weekly_uptime').deleteMany({}))
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('weekly_uptime').insertMany(weeklyUptimeFixture))
      // remove/populate db with fixture monthly_uptimes
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('monthly_uptime').deleteMany({}))
      .then(() => Promise.resolve(this.connections.mongo))
      .then(db => db.collection('monthly_uptime').insertMany(monthlyUptimeFixture))
      .then(() => {
        uptime = new Uptime({
          config: this.config,
          connections: this.connections,
        });

        return uptime;
      });
  });

  describe('getUptimes', () => {
    it('should not getInfras if kind unknown', (done) => {
      // run
      uptime.getInfras({
        kind: 'unknown'
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should getInfras of kind ElasticSearch only', (done) => {
      // run
      uptime.getInfras({
        kind: 'ElasticSearch'
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(1);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should getInfras of kind Mongo only', (done) => {
      // run
      uptime.getInfras({
        kind: 'Mongo'
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(3);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should getInfras of all kinds (ElasticSearch/Mongo)', (done) => {
      // run
      uptime.getInfras({})
        .then((result) => {
          // result
          expect(result.length).to.be.equal(4);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('getUptimes', () => {
    it('should throw error if `uptimeId`, `kind` or `namespace` not specified', (done) => {
      // run
      uptime.getUptimes({})
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('At least "uptimeId", "kind" or "namespace" is required');
          done();
        });
    });

    it('should throw error if `since` not specified', (done) => {
      // run
      uptime.getUptimes({ namespace: 'console-server', interval: 'daily' })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"since" and "to" are required, as Unix');
          done();
        });
    });

    it('should throw error if `to` not specified', (done) => {
      // run
      uptime.getUptimes({ namespace: 'console-server', interval: 'daily', since: 1506816000 })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"since" and "to" are required, as Unix');
          done();
        });
    });

    it('should throw error if `interval` not specified', (done) => {
      // run
      uptime.getUptimes({ namespace: 'console-server', since: 1506816000, to: 1507593600 })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"interval" is required as daily|weekly|monthly');
          done();
        });
    });

    it('should throw error if `interval` not valid', (done) => {
      // run
      uptime.getUptimes({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1507593600,
        interval: 'yearly'
      })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"interval" is required as daily|weekly|monthly');
          done();
        });
    });

    describe('with uptimeId', () => {
      it('should getUptimes with uptimeId of ElasticSearch', (done) => {
        // run
        uptime.getUptimes({
          uptimeId: '59d270e8750d192d08575f9c', // ElasticSearch
          interval: 'daily',
          since: 1506816000,
          to: 1506823200
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes with uptimeId of Mongo', (done) => {
        // run
        uptime.getUptimes({
          uptimeId: '59cecf14750d195a7c987702', // Mongo
          interval: 'daily',
          since: 1506816000,
          to: 1506823200
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    describe('interval `daily`', () => {
      it('should not getUptimes if namespace unknown, from Oct. 5th to 10th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'unknown',
          interval: 'daily',
          since: 1507161600,
          to: 1507593600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should not getUptimes from Oct. 11th to 20th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'daily',
          since: 1507680000,
          to: 1508457600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes from Oct. 1th to 10th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'daily',
          since: 1506816000,
          to: 1507593600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(10);
            expect(result[0].label).to.be.equal('October 1st, 2017');
            expect(result[9].label).to.be.equal('October 10th, 2017');

            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes from Oct. 1st to 5th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'daily',
          since: 1506816000,
          to: 1507161600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(5);
            expect(result[0].label).to.be.equal('October 1st, 2017');
            expect(result[4].label).to.be.equal('October 5th, 2017');

            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes from Oct. 5th to 10th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'daily',
          since: 1507161600,
          to: 1507593600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(6);
            expect(result[0].label).to.be.equal('October 5th, 2017');
            expect(result[5].label).to.be.equal('October 10th, 2017');

            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes with Infra/Mongo, from Oct. 1th to 10th', (done) => {
        // run
        uptime.getUptimes({ category: 'infra', kind: 'Mongo', interval: 'daily', since: 1506816000, to: 1507593600 })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            expect(result[0].label).to.be.equal('October 1st, 2017');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    describe('interval `weekly`', () => {
      it('should not getUptimes if namespace unknown, from Oct. 2nd to 30th (Mondays)', (done) => {
        // run
        uptime.getUptimes({ namespace: 'unknown', interval: 'weekly', since: 1506902400, to: 1509321600 })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes with Infra/Mongo, from Oct. 2nd to 30th (Mondays)', (done) => {
        // run
        uptime.getUptimes({
          category: 'infra',
          kind: 'Mongo',
          interval: 'weekly',
          since: 1506902400,
          to: 1509321600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            expect(result[0].label).to.be.equal('Week of October 2nd, 2017');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes from Oct. 2nd to 30th', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'weekly',
          since: 1506902400,
          to: 1509321600
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(5);
            expect(result[0].label).to.be.equal('Week of October 2nd, 2017');
            expect(result[4].label).to.be.equal('Week of October 30th, 2017');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    describe('interval `monthly`', () => {
      it('should not getUptimes if namespace unknown, from Oct. to Dec.', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'unknown',
          interval: 'monthly',
          since: 1506816000,
          to: 1512086400
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes with Infra/Mongo, from Oct. to Dec.', (done) => {
        // run
        uptime.getUptimes({
          category: 'infra',
          kind: 'Mongo',
          interval: 'monthly',
          since: 1506816000,
          to: 1512086400
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            expect(result[0].label).to.be.equal('October 2017');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getUptimes, from Oct. to Dec.', (done) => {
        // run
        uptime.getUptimes({
          category: 'ns',
          namespace: 'console-server',
          interval: 'monthly',
          since: 1506816000,
          to: 1512086400
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(3);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });
  });

  describe('getDowntimes', () => {
    it('should throw error if no namespace nor kind', (done) => {
      // run
      uptime.getDowntimes({ downStartDate: 1506816000, duration: daysToSeconds(1) })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('At least "uptimeId", "kind" or "namespace" is required');
          done();
        });
    });

    it('should not getDowntimes if null parameters', (done) => {
      // run
      uptime.getDowntimes({ kind: null, namespace: null, downStartDate: null, duration: null })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('At least "uptimeId", "kind" or "namespace" is required');
          done();
        });
    });

    it('should not getDowntimes if namespace not found', (done) => {
      // run
      uptime.getDowntimes({
        category: 'ns',
        namespace: 'unknown',
        since: 1506816000,
        to: 1506816000 + daysToSeconds(7)
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should not getDowntimes if namespace found, but time range not found', (done) => {
      // run
      uptime.getDowntimes({
        category: 'ns',
        namespace: 'console-server',
        since: 2506816000,
        to: 2506816000 + daysToSeconds(7)
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    describe('with uptimeId', () => {
      it('should getDowntimes with uptimeId of ElasticSearch', (done) => {
        // run
        uptime.getDowntimes({
          uptimeId: '59d270e8750d192d08575f9c', // ElasticSearch
          since: 1506816000,
          to: 1506816000 + daysToSeconds(7),
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(1);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should getDowntimes with uptimeId of Mongo', (done) => {
        // run
        uptime.getDowntimes({
          uptimeId: '59cecf14750d195a7c987702', // Mongo
          since: 1506972863,
          to: 1506972863 + daysToSeconds(14),
        })
          .then((result) => {
            // result
            expect(result.length).to.be.equal(2);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    it('should getDowntimes if category/kind found', (done) => {
      // run
      uptime.getDowntimes({
        category: 'infra',
        kind: 'Mongo',
        since: 1506972863,
        to: 1506972863 + daysToSeconds(7)
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(1);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 1 downtime', (done) => {
      // run
      uptime.getDowntimes({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + daysToSeconds(1)
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(1);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 2 downtimes', (done) => {
      // run
      uptime.getDowntimes({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + daysToSeconds(2)
      })
        .then((result) => {
          // result
          expect(result.length).to.be.equal(2);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('getSLA', () => {
    it('should throw error if no namespace nor kind', (done) => {
      // run
      uptime.getSLA({ since: 1506816000, to: 1506816000 + daysToSeconds(1) })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('At least "uptimeId", "kind" or "namespace" is required');
          done();
        });
    });

    it('should throw error if `since` not specified', (done) => {
      // run
      uptime.getSLA({ namespace: 'console-server', interval: 'daily' })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"since" and "to" are required, as Unix');
          done();
        });
    });

    it('should throw error if `to` not specified', (done) => {
      // run
      uptime.getSLA({ namespace: 'console-server', interval: 'daily', since: 1506816000 })
        .then(() => {
          done('should throw');
        })
        .catch((error) => {
          expect(error.message).to.be.equal('"since" and "to" are required, as Unix');
          done();
        });
    });

    describe('with uptimeId', () => {
      it('should get 50 sla with 1 found downtime, ElasticSearch, down 2h over 4', (done) => {
        // run
        uptime.getSLA({
          uptimeId: '59d270e8750d192d08575f9c', // ElasticSearch
          since: 1506816000,
          to: 1506816000 + hoursToSeconds(4)
        })
          .then((result) => {
            // result
            expect(result).to.be.equal(50);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('should get ~33 sla with 1 found downtime, Mongo, down 2w over 3', (done) => {
        // run
        uptime.getSLA({
          uptimeId: '59cecf14750d195a7c987702', // Mongo
          since: 1506972863,
          to: 1506972863 + daysToSeconds(21),
        })
          .then((result) => {
            // result
            expect(result).to.be.equal(33.333278218694886);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    it('should get 100% sla if namespace not found', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'unknown',
        since: 1506816000,
        to: 1506816000 + daysToSeconds(7)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(100);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 100% sla if namespace found, but time range not found', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 2506816000,
        to: 2506816000 + daysToSeconds(7)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(100);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 0% sla with 2 found downtime, Infra/Mongo', (done) => {
      // run
      uptime.getSLA({
        category: 'infra',
        kind: 'Mongo',
        since: 1506972863,
        to: 1506972863 + daysToSeconds(14)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 0 sla with 1 found downtime, down 2h over 2', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(2)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 50 sla with 1 found downtime, down 2h over 4', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(4)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(50);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 75 sla with 1 found downtime, down 2h over 8', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(8)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(75);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~70 sla with 2 found downtime, down 14h over 48', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + daysToSeconds(2)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(70.83333333333333);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 50 sla with 1 found downtime, down 2h over 4', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(4)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(50);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~87 sla with 1 found downtime, down 2h over 16', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(16)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(87.5);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~73 sla with 1 found downtime, down 8h over 30', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(30)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(73.33333333333333);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~91 sla with 1 found downtime, down 2h over 24', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(24)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(91.66666666666667);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 50 sla with 1 found downtime, down 12h over 24', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506902400,
        to: 1506902400 + hoursToSeconds(24)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(50);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~61 sla with 1 found downtime, down 14h over 36', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(36)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(61.111111111111114);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 88 sla with 2 found downtime, down 3h over 25', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000,
        to: 1506816000 + hoursToSeconds(25)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(88);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get ~95 sla with 1 found downtime, down 1h over 23', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'console-server',
        since: 1506816000 + hoursToSeconds(1),
        to: 1506816000 + hoursToSeconds(1) + hoursToSeconds(23)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(95.65217391304348);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should get 0% if it was down_end_date = 0', (done) => {
      // run
      uptime.getSLA({
        category: 'ns',
        namespace: 'cloudypc-configmixer-svc-develop',
        since: 1506963688,
        to: 1506963688 + daysToSeconds(14)
      })
        .then((result) => {
          // result
          expect(result).to.be.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });
});
