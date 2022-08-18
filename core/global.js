const API_ROOT = "https://api.ownerreservations.com";

const orez = (function () {
  // initialize orez stuff

  const buildRequest = function (resource, method, bundle, params) {
    if (resource && resource[0] != "/") 
      resource = "/" + resource;

    const options = {
      url: `${API_ROOT}${resource}`,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${bundle.authData.access_token}`,
      },
    };

    if (params) 
      options.params = params;

    return options;
  };
  
  // return helper object
  return {
    BuildRequest: buildRequest,
    CleanIds: function (ids) {
      for (var x in ids) {
        ids[x] = ids[x].replace(/[^0-9]/g, "");
      }
    },
    GetItem: function (z, bundle, options) {
      const options = buildRequest(options.resource, "GET", bundle, options.params);
  
      return z.request(options).then((response) => {
        response.throwForStatus();
        const results = response.json;
  
        var matchingItem = null;
  
        if (results.items) {
          for (var x in results.items) {
            if (!options.isMatch || options.isMatch(results.items[x])) {
              matchingItem = results.items[x];
              break;
            }
          }
        }
  
        return matchingItem;
      });
    },
    PostItem: function (z, bundle, options) {
      const options = buildRequest(options.resource, "POST", bundle, options.params);
      options.body = options.body;
  
      return z.request(options).then((response) => {
        response.throwForStatus();
        return response.json;
      });
    },
    PatchItem: function (z, bundle, options) {
      const options = buildRequest(options.resource, "PATCH", bundle, options.params);
      options.body = options.body;
  
      return z.request(options).then((response) => {
        response.throwForStatus();
        return response.json;
      });
    },
    DeleteItem: function (z, bundle, options) {
      const options = buildRequest(options.resource, "DELETE", bundle, options.params);  
      
      return z.request(options).then((response) => {
        response.throwForStatus();
        return { status: 'No content', status_code: 204 };
      });
    }
  };
})();