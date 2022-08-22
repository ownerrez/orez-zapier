const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Create - custom_field_remove', () => {
  zapier.tools.env.inject();

  it('should create an object', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },

      inputData: {
        entity_type: "booking",
        entity_id: 1,
        field_definition_id: 2
      },
    };

    nock(process.env.API_ROOT)
      .get('/v2/fields')
      .query({
        entity_id: bundle.inputData.entity_id,
        entity_type: bundle.inputData.entity_type,
      })
      .reply(200, orez.MockList([
        { field_definition_id: 3, id: 4 },
        { field_definition_id: bundle.inputData.field_definition_id, id: 5 },
        { field_definition_id: 6, id: 7 }
      ]));
    
    nock(process.env.API_ROOT)
      .delete('/v2/fields/5')
      .reply(200, App.creates['custom_field_remove'].operation.sample);

    const result = await appTester(
      App.creates['custom_field_remove'].operation.perform,
      bundle
    );

    result.should.not.be.an.Array();
    
    nock.cleanAll();
    nock.enableNetConnect();
  });
  
  if (process.env.AUTH_USERNAME)
  {
    // For integration testing, use username and personal token instead of oauth
    it("should load secondary fields array", async () => {
      const bundle = {
        authData: {},
        inputData: {
          field_definition_id: 294928057,
        },
      };

      const result = await appTester(
        App.creates['custom_field_remove'].operation.inputFields[1],
        bundle
      );

      result.should.be.an.Array();
      result[0].key.should.equal("entity_type");
      result[1].key.should.equal("entity_id");
    });
  }
});