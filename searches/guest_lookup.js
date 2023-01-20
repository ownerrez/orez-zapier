var orez = require("../orez");
var helpers = require("../orez_helpers");

const lookupGuest = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/guests/${orez.CleanId(bundle.inputData.id)}`);
};

module.exports = {
  operation: {
    perform: lookupGuest,
    inputFields: [
      (z, bundle) => {
        return helpers.GetEntityIdInputByType(z, bundle, "guest", "id", "The ID of the guest to lookup (E.g ORG1234 or 1234).");
      }
    ],
    sample: orez.Types.Guest.Sample
  },
  key: 'guest_lookup',
  noun: 'Guest',
  display: {
    label: 'Guest Lookup',
    description: 'Finds a guest by ID.'
  }
};
