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
      
      meta: {
        isFillingDynamicDropdown: true,
        page: 0
      }
    };

    nock(process.env.API_ROOT)
      .get('/v2/fielddefinitions')
      .reply(200, orez.MockList([
        { name: 'name 1', description: 'directions 1', id: 1 },
        { name: 'name 2', description: 'directions 2', id: 2 },
      ], "/v2/fielddefinitions?limit=20&offset=20"));

    const result1 = await appTester(
      App.triggers['field_definition_lookup'].operation.perform,
      bundle
    );

    result1.should.be.an.Array();
    result1[0].id.should.equal(1);
    result1[1].id.should.equal(2);

    bundle.meta.page = 1;

    nock(process.env.API_ROOT)
      .get('/v2/fielddefinitions')
      .query({ limit: 20, offset: 20 })
      .reply(200, orez.MockList([
        { name: 'name 3', description: 'directions 3', id: 3 },
        { name: 'name 4', description: 'directions 4', id: 4 },
      ]));

    const result2 = await appTester(
      App.triggers["field_definition_lookup"].operation.perform,
      bundle
    );

    result2.should.be.an.Array();
    result2[0].id.should.equal(3);
    result2[1].id.should.equal(4);
  });
});
