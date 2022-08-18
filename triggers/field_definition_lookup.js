var orez = require("../orez");

const getFieldDefinitions = async (z, bundle) => {  
  return orez.GetItems(z, bundle, "v2/fielddefinitions");
};

module.exports = {
  operation: {
    perform: getFieldDefinitions,
    type: 'polling',
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
      { key: 'type', type: 'string' },
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
