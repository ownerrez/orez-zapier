const orez = require("../orez");

const perform = async (z, bundle) => {
  return orez.GetItems(z, bundle, { resource: 'v2/bookings/' + bundle.cleanedRequest.entity_id })
    .then((item) => [item]);
};

const performList = async (z, bundle) => {
  //orez.GetItems
  const options = {
    url:
      'https://api.ownerreservations.com/v2/bookings?include_tags=true&include_fields=true&since_utc=' +
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
    body: {},
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
    canPaginate: false,
    type: 'hook',
    performList: performList,
    performSubscribe: {
      body: {
        webhook_url: '{{bundle.targetUrl}}',
        type: 'Booking',
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
      adults: 1,
      arrival: '2022-04-28',
      charges: [
        {
          amount: 950,
          commission_amount: 190,
          description:
            '5 nights (4/28, 5/1 - 5/4) during Spring at £190.00 per night',
          is_channel_managed: false,
          is_commission_all: false,
          is_expense_all: false,
          is_taxable: false,
          owner_amount: 760,
          owner_commission_percent: 20,
          position: 0,
          rate: 950,
          rate_is_percent: false,
          type: 'rent',
        },
      ],
      children: 0,
      departure: '2022-05-04',
      guest_id: 34013,
      has_problem: false,
      id: 273491,
      infants: 0,
      is_block: false,
      pets: 0,
      property_id: 182918563,
      status: 'active',
      type: 'booking',
    },
    outputFields: [
      { key: 'adults', type: 'integer' },
      { key: 'arrival', type: 'datetime' },
      { key: 'charges[]amount', type: 'number' },
      { key: 'charges[]commission_amount', type: 'number' },
      { key: 'charges[]description' },
      { key: 'charges[]is_channel_managed', type: 'boolean' },
      { key: 'charges[]is_commission_all', type: 'boolean' },
      { key: 'charges[]is_expense_all', type: 'boolean' },
      { key: 'charges[]is_taxable', type: 'boolean' },
      { key: 'charges[]owner_amount', type: 'number' },
      { key: 'charges[]owner_commission_percent', type: 'number' },
      { key: 'charges[]position', type: 'integer' },
      { key: 'charges[]rate', type: 'number' },
      { key: 'charges[]rate_is_percent', type: 'boolean' },
      { key: 'charges[]type' },
      { key: 'children', type: 'integer' },
      { key: 'departure', type: 'datetime' },
      { key: 'guest_id', type: 'integer' },
      { key: 'has_problem', type: 'boolean' },
      { key: 'id', type: 'integer' },
      { key: 'infants', type: 'integer' },
      { key: 'is_block', type: 'boolean' },
      { key: 'pets', type: 'integer' },
      { key: 'property_id', type: 'integer' },
      { key: 'status' },
      { key: 'type' },
    ],
  },
  key: 'booking_created',
  noun: 'Booking',
  display: {
    label: 'Booking Created',
    description:
      'Triggers when a new booking is created or blocked-off is added.',
    hidden: false,
    important: true,
  },
};
