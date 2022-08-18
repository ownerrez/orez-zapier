const perform = async (z, bundle) => {
  orez.CleanIds([ bundle.inputData.entity_id ]);

  const getOptions = {
    resource: "v2/tags", 
    params: { 
      entity_type: bundle.inputData.entity_type, 
      entity_id: bundle.inputData.entity_id 
    }, 
    isMatch: (item) => item.name == bundle.inputData.name
  };

  return orez.GetItem(z, bundle, getOptions).then((matchingItem) => {
      if (matchingItem === null) {
        return { status: 'No content', status_code: 204 };
      } 
      else {
        return orez.DeleteItem(z, bundle, {
          resource: "v2/tags/" + matchingItem.id
        });
      }
    });
};

module.exports = {
  key: 'tag_remove',
  noun: 'Tag',
  display: {
    label: 'Remove Tag',
    description: 'Remove a tag from a record.',
    hidden: false,
    important: true,
  },
  operation: {
    inputFields: [
      {
        key: 'entity_type',
        label: 'Record Type',
        type: 'string',
        helpText: 'The type of record to update.',
        choices: [
          { label: 'Booking', sample: 'Booking', value: 'booking' },
          { label: 'Contact', sample: 'Contact', value: 'guest' },
          { label: 'Property', sample: 'Property', value: 'property' },
          { label: 'Quote', sample: 'Quote', value: 'quote' },
          { label: 'Inquiry', sample: 'Inquiry', value: 'inquiry' },
          { label: 'Owner', sample: 'Owner', value: 'owner' },
        ],
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'entity_id',
        label: 'Record ID',
        type: 'integer',
        helpText: 'The ID of the record to update.',
        default: 'Enter number...',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'name',
        label: 'Tag',
        type: 'string',
        helpText: 'The tag to remove from the record.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    outputFields: [{ key: 'status' }, { key: 'status_code' }],
    sample: { status: 'no content', status_code: '204' },
    perform: perform,
  },
};
