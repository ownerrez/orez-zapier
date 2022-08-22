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
      action: 'EntityCreate',
    }),
    performUnsubscribe: helpers.PerformUnsubscribe,
    sample: {
      email_addresses: [
        { address: 'guest@orez.io', id: 123, is_default: false },
      ],
      first_name: 'First',
      id: 123,
      last_name: 'Last',
    },
    outputFields: [
      { key: 'email_addresses[]address' },
      { key: 'email_addresses[]id', type: 'integer' },
      { key: 'email_addresses[]is_default', type: 'boolean' },
      { key: 'first_name' },
      { key: 'id', type: 'integer' },
      { key: 'last_name' },
    ],
  },
  key: 'contact_created',
  noun: 'Contact',
  display: {
    label: 'Contact Created',
    description: 'Triggers when a new contact is created.',
    hidden: false,
    important: true,
  },
};
