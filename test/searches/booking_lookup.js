const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Search - booking_lookup', () => {
  zapier.tools.env.inject();
  
  it('should get an array of one item', async () => {
    const bundle = { 
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      inputData: {
        id: 1
      } 
    };

    nock(process.env.API_ROOT)
      .get("/v2/bookings/1")
      .reply(200, App.searches["booking_lookup"].operation.sample);

    const results = await appTester(
      App.searches.booking_lookup.operation.perform,
      bundle
    );
    
    results.should.be.an.Array();
    results.length.should.equal(1);
  });
});
