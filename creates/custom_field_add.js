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
        return orez.PostItem(z, bundle, {
          resource: "v2/fields",
          body: {
            entity_type: bundle.inputData.entity_type,
            entity_id: bundle.inputData.entity_id,
            value: bundle.inputData.value,
            field_definition_id: bundle.inputData.field_definition_id,
          }
        });
      }
      else {
        return orez.PatchItem(z, bundle, {
          resource: "v2/fields/" + matchingItem.id,
          body: {
            value: bundle.inputData.value,
          }
        });
      }
    });
};

module.exports = {
  key: 'custom_field_add',
  noun: 'Custom Field',
  display: {
    label: 'Set Custom Field',
    description: 'Sets the value of a custom field on a record.',
    hidden: false,
    important: true,
  },
  operation: {
    inputFields: [
      {
        key: 'field_definition_id',
        label: "Field Definition ID",
        type: 'integer',
        helpText: 'The field to set.',
        required: true,
        dynamic: "field_definition_lookup.id.full_code,name",
        altersDynamicFields: true,
      },
      helpers.GetFieldDefinitionEntityInputs,
      {
        key: 'value',
        label: 'Value',
        type: 'string',
        helpText: 'The value to set to this field.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      entity_id: 789,
      entity_type: 'booking',
      field_definition_id: 123,
      id: 456,
      value: 'THIS IS A FIELD VALUE',
    },
    outputFields: [
      { key: 'entity_id', type: 'integer' },
      { key: 'entity_type' },
      { key: 'field_definition_id', type: 'integer' },
      { key: 'id', type: 'integer' },
      { key: 'value' },
    ],
    perform: perform,
  },
};
