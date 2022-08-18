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

      inputData: {},
    };

    const result = await appTester(
      App.creates['custom_field_remove'].operation.perform,
      bundle
    );
    result.should.not.be.an.Array();
  });
});
