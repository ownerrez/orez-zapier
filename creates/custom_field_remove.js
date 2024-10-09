var orez = require("../orez");
var helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  orez.CleanIds([ bundle.inputData.entity_id ]);

  const getOptions = {
    resource: "v2/fields",
    params: {
      entity_type: bundle.inputData.entity_type,
      entity_id: bundle.inputData.entity_id,
    }
  };

  return orez.GetItems(z, bundle, getOptions)
    .then((items) => orez.FirstOrDefault(items, (item) => item.field_definition_id == bundle.inputData.field_definition_id))
    .then((matchingItem) => {
      if (matchingItem === null) {
        return { status: 'No content', status_code: 204 };
      } 
      else {
        return orez.DeleteItem(z, bundle, {
          resource: "v2/fields/" + matchingItem.id
        });
      }
    });
};

module.exports = {
  key: 'custom_field_remove',
  noun: 'Custom Field',
  display: {
    label: 'Clear Custom Field',
    description: 'Remove any value set on a custom field.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'field_definition_id',
        label: "Field Definition ID",
        type: 'integer',
        helpText: 'The field to clear.',
        required: true,
        dynamic: "field_definition_lookup.id.name",
        altersDynamicFields: true,
      },
      helpers.GetFieldDefinitionEntityInputs
    ],
    sample: { status: 'No content', status_code: '204' },
    outputFields: [{ key: 'status' }, { key: 'status_code' }],
    perform: perform,
  },
};
