var orez = require("../orez");

const perform = async (z, bundle) => {
  let cursor;
  if (bundle.meta && bundle.meta.isFillingDynamicDropdown && bundle.meta.page)
    cursor = await z.cursor.get();
  
  return z.request(orez.BuildRequest(cursor || "v2/fielddefinitions", "GET", bundle)).then(async (response) => {
    response.throwForStatus();

    if (response.json && response.json.next_page_url)
      await z.cursor.set(response.json.next_page_url);

    return orez.ParseItems(response);
  });
};

module.exports = {
  operation: {
    type: 'polling',
    canPaginate: true,
    perform: perform,
    sample: {
      "code": "CODE1",
      "description": "sample string 2",
      "full_code": "BXCODE1",
      "id": 1,
      "name": "Custom Field",
      "type": "booking"
    },
    outputFields: [
      { key: 'id', type: 'integer' },
      { key: 'name', type: 'string' },
      { key: 'code', type: 'string' },
      { key: 'full_code', type: 'string' },
      { key: 'description', type: 'string' },
      { key: 'type', type: 'string' }
    ],
  },
  key: 'field_definition_lookup',
  noun: 'Field Definition',
  display: {
    label: 'Field Definition Lookup',
    hidden: true,
    important: false,
  },
};
