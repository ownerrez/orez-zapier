const API_ROOT = "https://api.ownerreservations.com";

const buildRequest = function (resource, method, bundle, params) {
  if (resource && resource[0] != "/") 
    resource = "/" + resource;

  const options = {
    url: `${API_ROOT}${resource}`,
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${bundle.authData.access_token}`,
    },
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
  API_ROOT: API_ROOT,
  
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
        return response.json;
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
  }
};