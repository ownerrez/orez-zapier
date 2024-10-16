const orez = require("../orez");
const helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/guests/${bundle.cleanedRequest.entity_id}`);
};

const performList = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/guests?include_tags=true&include_fields=true&created_since_utc=${orez.AddDays(new Date(), -180).toJSON()}`);
};

module.exports = {
  operation: {
    perform: perform,
    type: 'hook',
    performList: performList,
    performSubscribe: helpers.BuildPerformSubscribe({
      type: 'Guest',
      action: 'EntityUpdate',
    }),
    performUnsubscribe: helpers.PerformUnsubscribe,
    sample: orez.Types.Guest.Sample,
    outputFields: orez.Types.Guest.Fields,
    inputFields: [(z, bundle) => {
      return helpers.GetWebhookCategoriesInput(z, bundle, "booking");
    }]
  },
  key: 'contact_updated',
  noun: 'Contact',
  display: {
    label: 'Contact Updated',
    description: "Triggers when a contact's information changes.",
    hidden: false,
  },
};
