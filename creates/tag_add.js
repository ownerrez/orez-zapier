var orez = require("../orez");
var helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  const getOptions = {
    resource: "v2/tags",
    params: {
      entity_type: bundle.inputData.entity_type,
      entity_id: orez.CleanId(bundle.inputData.entity_id),
    }
  };

  return orez.GetItems(z, bundle, getOptions)
    .then((items) => orez.FirstOrDefault(items, (item) => item.name == bundle.inputData.name))
    .then((matchingItem) => {
      if (matchingItem !== null) {
        return matchingItem;
      } 
      else {
        return orez.PostItem(z, bundle, {
          resource: "v2/tags",
          body: {
            name: bundle.inputData.name,
            entity_type: bundle.inputData.entity_type,
            entity_id: orez.CleanId(bundle.inputData.entity_id),
          }
        });
      }
    });
};

module.exports = {
  key: 'tag_add',
  noun: 'Tag',
  display: {
    label: 'Add Tag',
    description: 'Add a tag to a record.',
    hidden: false,
    important: true,
  },
  operation: {
    inputFields: [
      {
        key: 'entity_type',
        label: 'Record Type',
        type: 'string',
        helpText: 'The type of record you wish to tag.',
        choices: [
          { label: 'Booking', sample: 'Booking', value: 'booking' },
          { label: 'Contact', sample: 'Contact', value: 'guest' },
          { label: 'Property', sample: 'Property', value: 'property' },
          { label: 'Quote', sample: 'Quote', value: 'quote' },
          { label: 'Inquiry', sample: 'Inquiry', value: 'inquiry' },
          { label: 'Owner', sample: 'Owner', value: 'owner' },
        ],
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      helpers.GetEntityIdInput,
      {
        key: 'name',
        label: 'Tag',
        type: 'string',
        helpText: 'The tag to add to the record.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      entity_id: 1,
      entity_type: 'booking',
      id: 2,
      name: 'tag name',
      tag_definition_id: 3,
    },
    outputFields: [
      { key: 'entity_id', type: 'integer' },
      { key: 'entity_type' },
      { key: 'id', type: 'integer' },
      { key: 'name' },
      { key: 'tag_definition_id', type: 'integer' },
    ],
    perform: perform,
  },
};
