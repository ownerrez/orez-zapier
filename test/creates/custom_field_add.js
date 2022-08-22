const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Create - custom_field_add', () => {
  zapier.tools.env.inject();

  it('should create an object', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      inputData: {
        entity_type: "booking",
        entity_id: 1
      },
    };

    nock(process.env.API_ROOT)
      .get('/v2/fields')
      .query(bundle.inputData)
      .reply(200, orez.MockList([]));
    
    nock(process.env.API_ROOT)
      .post('/v2/fields')
      .reply(200, App.creates['custom_field_add'].operation.sample);

    const result = await appTester(
      App.creates['custom_field_add'].operation.perform,
      bundle
    );
    result.should.not.be.an.Array();
  });
});
