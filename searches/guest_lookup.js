var orez = require("../orez");
var helpers = require("../orez_helpers");

const lookupGuest = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/guests/${orez.CleanId(bundle.inputData.id)}`);
};

module.exports = {
  operation: {
    perform: lookupGuest,
    inputFields: [
      { label: "Guest ID", key: 'id', required: true, helpText: 'The ID of the Guest to lookup.' }
    ],
    sample: {
      id: 1,
      first_name: 'Example',
      last_name: 'Guest'
    },
  },
  key: 'guest_lookup',
  noun: 'Guest',
  display: {
    label: 'Guest Lookup',
    description: 'Finds a guest by ID.'
  }
};
