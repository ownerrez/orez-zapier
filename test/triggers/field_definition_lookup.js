var orez = require("../../orez");
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('Trigger - field_definition_lookup', () => {
  zapier.tools.env.inject();

  it('should get an array', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      inputData: {},
    };

    nock(process.env.API_ROOT)
      .get('/v2/fielddefinitions')
      .query(bundle.inputData)
      .reply(200, orez.MockList([
        { name: 'name 1', description: 'directions 1', id: 1 },
        { name: 'name 2', description: 'directions 2', id: 2 },
      ]));

    const results = await appTester(
      App.triggers['field_definition_lookup'].operation.perform,
      bundle
    );
    results.should.be.an.Array();
  });
});
