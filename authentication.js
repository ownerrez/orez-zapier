const orez = require("./orez");

module.exports = {
  type: 'oauth2',
  test: {
    headers: { Authorization: 'Bearer {{bundle.authData.access_token}}' },
    url: `${process.env.API_ROOT}/v2/users/me`,
  },
  oauth2Config: {
    authorizeUrl: {
      url: 'https://api.ownerrez.com/oauth/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken: {
      source:
        "const options = {\n  url: 'https://api.ownerrez.com/oauth/access_token',\n  method: 'POST',\n  headers: {\n    'content-type': 'application/x-www-form-urlencoded',\n    'accept': 'application/json',\n    'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString(\"base64\")}`\n  },\n  params: {\n\n  },\n  body: {\n    'code': bundle.inputData.code,\n    'grant_type': 'authorization_code',\n    'redirect_uri': bundle.inputData.redirect_uri\n  }\n}\n\nreturn z.request(options)\n  .then((response) => {\n    response.throwForStatus();\n    const results = response.json;\n\n    // You can do any parsing you need for results here before returning them\n\n    return results;\n  });",
    },
    refreshAccessToken: {
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        grant_type: 'refresh_token',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
    },
  },
  connectionLabel: '{{bundle.authData.user_display_name}}',
};
