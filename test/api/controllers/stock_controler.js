var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('stocks', function() {

    describe('GET /stocks', function() {

      it('should return a non empty lists of stocks', function(done) {

        // todo: disable jwtCheck to run this test ! (to improve)
        request(server)
          .get('/api/v1/stocks')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body[0].ticker.should.eql("AAPL");
            done();
          });
      });

    });

  });

});
