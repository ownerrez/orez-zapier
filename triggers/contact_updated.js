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
    sample: {
      addresses: [
        {
          city: 'Happytown',
          country: 'UNITED STATES',
          id: 123,
          is_default: false,
          postal_code: '22222',
          state: 'Virginia',
          street1: '123 Sesame Ct',
        },
      ],
      email_addresses: [
        { address: 'guest@orez.io', id: 123, is_default: false },
      ],
      entity_type: 'guest',
      first_name: 'First',
      id: 123,
      last_name: 'Last',
      phones: [{ id: 123, is_default: false, number: '+1 (234) 567-8900' }],
    },
    outputFields: [
      { key: 'addresses[]city' },
      { key: 'addresses[]country' },
      { key: 'addresses[]id', type: 'integer' },
      { key: 'addresses[]is_default', type: 'boolean' },
      { key: 'addresses[]postal_code' },
      { key: 'addresses[]state' },
      { key: 'addresses[]street1' },
      { key: 'email_addresses[]address' },
      { key: 'email_addresses[]id', type: 'integer' },
      { key: 'email_addresses[]is_default', type: 'boolean' },
      { key: 'entity_type' },
      { key: 'first_name' },
      { key: 'id', type: 'integer' },
      { key: 'last_name' },
      { key: 'phones[]id', type: 'integer' },
      { key: 'phones[]is_default', type: 'boolean' },
      { key: 'phones[]number' },
    ],
  },
  key: 'contact_updated',
  noun: 'Contact',
  display: {
    label: 'Contact Updated',
    description: "Triggers when a contact's information changes.",
    hidden: false,
    important: false,
  },
};
