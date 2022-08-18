const perform = async (z, bundle) => {
  const options = {
    url:
      'https://api.ownerreservations.com/v2/guests/' +
      bundle.cleanedRequest.entity_id,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    params: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();

    return [response.json];
  });
};

const performList = async (z, bundle) => {
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const options = {
    url:
      'https://api.ownerreservations.com/v2/guests?include_tags=true&include_fields=true&created_since_utc=' +
      addDays(new Date(), -180).toJSON(),
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    params: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results.items;
  });
};

const performUnsubscribe = async (z, bundle) => {
  const options = {
    url: `https://api.ownerreservations.com/v2/webhooksubscriptions/${bundle.subscribeData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    params: {},
    body: {
      hookUrl: bundle.subscribeData.id,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return {};
  });
};

module.exports = {
  operation: {
    perform: perform,
    type: 'hook',
    performList: performList,
    performSubscribe: {
      body: {
        webhook_url: '{{bundle.targetUrl}}',
        type: 'Guest',
        action: 'EntityUpdate',
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      method: 'POST',
      url: 'https://api.ownerreservations.com/v2/webhooksubscriptions',
    },
    performUnsubscribe: performUnsubscribe,
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
