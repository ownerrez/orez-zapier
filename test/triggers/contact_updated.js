const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Trigger - contact_updated', () => {
  zapier.tools.env.inject();

  it('should get an array', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      cleanedRequest: {
        entity_id: 1
      },
    };

    nock(process.env.API_ROOT)
      .get("/v2/guests/1")
      .reply(200, App.triggers['contact_updated'].operation.sample);

    const results = await appTester(
      App.triggers['contact_updated'].operation.perform,
      bundle
    );
    results.should.be.an.Array();
  });
});
