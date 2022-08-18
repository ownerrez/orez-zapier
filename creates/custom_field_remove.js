const perform = async (z, bundle) => {
  orez.CleanIds([ bundle.inputData.entity_id ]);

  const getOptions = {
    resource: "v2/fields",
    params: {
      entity_type: bundle.inputData.entity_type,
      entity_id: bundle.inputData.entity_id,
    },
    isMatch: (item) => item.field_definition_id == bundle.inputData.field_definition_id
  };

  orez.GetItem(z, bundle, getOptions).then((matchingItem) => {
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
      helpText: 'The field to clear.',
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
  key: 'custom_field_remove',
  noun: 'Custom Field',
  display: {
    label: 'Clear Custom Field',
    description: 'Remove any value set on a custom field.',
    hidden: false,
    important: false,
  },
  operation: {
    inputFields: [
      {
        key: 'entity_type',
        label: 'Record Type',
        type: 'string',
        helpText: 'The type of record for which to clear a custom field.',
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
        helpText: 'The ID of the record on which to clear a custom field.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      getInputFields,
    ],
    sample: { status: 'No content', status_code: '204' },
    outputFields: [{ key: 'status' }, { key: 'status_code' }],
    perform: perform,
  },
};
