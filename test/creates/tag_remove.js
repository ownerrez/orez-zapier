const orez = require("../../orez");
const nock = require('nock');
require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Create - tag_remove', () => {
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
      .reply(200, orez.MockList([
        { name: "test tag", id: 3 }
      ]));
    
    nock(process.env.API_ROOT)
      .delete('/v2/tags/3')
      .reply(200, App.creates['tag_remove'].operation.sample);

    const result = await appTester(
      App.creates['tag_remove'].operation.perform,
      bundle
    );

    result.should.not.be.an.Array();
    
    nock.cleanAll();
    nock.enableNetConnect();
  });
  
  if (process.env.AUTH_USERNAME)
  {
    // For integration testing, use username and personal token instead of oauth
    it("should load secondary field object", async () => {
      const bundle = {
        authData: {},
        inputData: {
          entity_type: "booking",
        },
      };

      const result = await appTester(
        App.creates['tag_remove'].operation.inputFields[1],
        bundle
      );

      result.should.be.an.Object();
      result.key.should.equal("entity_id");
    });
  }
});
