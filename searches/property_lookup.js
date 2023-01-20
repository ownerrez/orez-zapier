var orez = require("../orez");
var helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/properties/${orez.CleanId(bundle.inputData.id)}`);
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      (z, bundle) => {
        return helpers.GetEntityIdInputByType(z, bundle, "property", "id", "The ID of the property to lookup (E.g ORP1234 or 1234).");
      }
    ],
    sample: orez.Types.Property.Sample
  },
  key: 'property_lookup',
  noun: 'Property',
  display: {
    label: 'Property Lookup',
    description: 'Finds a property by ID.'
  }
};
