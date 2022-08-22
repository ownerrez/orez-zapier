const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Create - tag_add', () => {
  zapier.tools.env.inject();

  it('should create an object', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      inputData: {
        entity_type: "booking",
        entity_id: "orp1",
        name: "test tag",
      },
    };

    nock(process.env.API_ROOT)
      .get('/v2/tags')
      .query({
        entity_type: "booking",
        entity_id: 1
      })
      .reply(200, orez.MockList([]));
    
    nock(process.env.API_ROOT)
      .post('/v2/tags')
      .reply(200, App.creates['tag_add'].operation.sample);

    const result = await appTester(
      App.creates['tag_add'].operation.perform,
      bundle
    );
    result.should.not.be.an.Array();
  });
});
