var orez = require("../orez");

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

const getInputFields = async (z, bundle) => {
  // Configure a request to an endpoint of your api that
  // returns custom field meta data for the authenticated
  // user.  Don't forget to congigure authentication!

  const options = {
    url:
      'https://api.ownerreservations.com/v2/fielddefinitions?type=' +
      (bundle.inputData.entity_type == 'guest'
        ? 'contact'
        : bundle.inputData.entity_type),
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

    // modify your api response to return an array of Field objects
    // see https://zapier.github.io/zapier-platform-schema/build/schema.html#fieldschema
    // for schema definition.

    var field = {
      key: 'field_definition_id',
      type: 'integer',
      helpText: 'The field to set.',
      required: true,
      choices: [],
    };

    if (results.items) {
      for (var x in results.items) {
        field.choices[field.choices.length] = {
          label: results.items[x].name,
          value: results.items[x].id,
          sample: results.items[x].full_code,
        };
      }
    }

    return [field];
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
        key: 'entity_type',
        label: 'Record Type',
        type: 'string',
        helpText: 'The type of record you are modifying.',
        choices: [
          { label: 'Booking', sample: 'Booking', value: 'booking' },
          { label: 'Contact', sample: 'Contact', value: 'guest' },
          { label: 'Property', sample: 'Property', value: 'property' },
          { label: 'Owner', sample: 'Owner', value: 'owner' },
        ],
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'entity_id',
        label: 'Record ID',
        type: 'integer',
        helpText: 'The ID of the record to modify.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      getInputFields,
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
