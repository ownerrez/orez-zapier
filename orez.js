const buildRequest = function (resource, method, bundle, params) {
  if (resource && resource[0] != "/") 
    resource = "/" + resource;

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (bundle.authData.access_token) {
    headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  else if (process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD) {
    const token = Buffer.from(`${process.env.AUTH_USERNAME}:${process.env.AUTH_PASSWORD}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  }

  const options = {
    url: `${process.env.API_ROOT}${resource}`,
    method: method,
    headers: headers,
  };

  if (params) 
    options.params = params;

  return options;
};

const cleanId = function(id) {
  if (id && typeof id == "string")
    return id.replace(/[^0-9]/g, "");
  return id;
};

module.exports = {
  BuildRequest: buildRequest,
  CleanId: cleanId,
  CleanIds: function (ids) {
    for (var x in ids) {
      if (ids[x] && typeof ids[x] == "string")
        ids[x] = cleanId(ids[x]);
    }
  },
  AddDays: function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  FirstOrDefault: async (items, filter) => {
    var matchingItem = null;

    if (items) {
      for (var x in items) {
        if (!filter || filter(items[x])) {
          matchingItem = items[x];
          break;
        }
      }
    }

    return matchingItem;
  },

  GetItems: async (z, bundle, options) => {
    var request;
    if (typeof options == "string")
      request = buildRequest(options, "GET", bundle);
    else
      request = buildRequest(options.resource, "GET", bundle, options.params);

    return z.request(request).then((response) => {
      response.throwForStatus();

      if (response.json.items)
        return response.json.items;
      else
        return [response.json];
    });
  },
  PostItem: async (z, bundle, options) => {
    const request = buildRequest(options.resource, "POST", bundle, options.params);
    request.body = options.body;

    return z.request(request).then((response) => {
      response.throwForStatus();
      return response.json;
    });
  },
  PatchItem: async (z, bundle, options) => {
    const request = buildRequest(options.resource, "PATCH", bundle, options.params);
    request.body = options.body;

    return z.request(request).then((response) => {
      response.throwForStatus();
      return response.json;
    });
  },
  DeleteItem: async (z, bundle, options) => {
    const request = buildRequest(options.resource, "DELETE", bundle, options.params);  
    
    return z.request(request).then((response) => {
      response.throwForStatus();
      return { status: 'No content', status_code: 204 };
    });
  },

  MockList: (items) => {
    return {
      count: items.length,
      items: items,
      limit: 20,
      offset: 0,
      next_page_url: "",
    }
  },

  // example objects and field arrays for OwnerRez responses
  Types: {
    Booking: {
      Sample: {
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
        id: 273491,
        infants: 0,
        is_block: false,
        pets: 0,
        property_id: 182918563,
        status: 'active',
        type: 'booking',
      },
      Fields: [
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
      ]
    },
    Guest: {
      Sample: {
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
        first_name: 'First',
        id: 123,
        last_name: 'Last',
        phones: [{ id: 123, is_default: false, number: '+1 (234) 567-8900' }],
      },
      Fields: [
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
      ]
    },
    Property: {
      Sample: {
        id: 1234,
        key: "abc123",
        name: "Example Property",
        active: true
      },
      Fields: [
        { key: "id", type: "integer" },
        { key: "key" },
        { key: "name" },
        { key: "active", type: "boolean" },
      ]
    }
  }
};