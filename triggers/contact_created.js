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
        action: 'EntityCreate',
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
