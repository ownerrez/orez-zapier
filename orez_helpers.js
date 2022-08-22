const orez = require("./orez");

const getEntityIdInputByType = async (z, bundle, type) => {
  var resource = "v2/";
  var itemMap;

  switch (type)
  {
    case "booking":
      resource += "bookings?since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = async (booking) => {
          return { 
            value: booking.id, 
            label: `${booking.guest && booking.guest.last_name ? booking.guest.first_name + " " + booking.guest.last_name : "ORG" + booking.guest_id} (${new Date(booking.arrival)} to ${new Date(booking.departure)})`
          }; 
      };
      break;

    case "guest":
      resource += "guests?created_since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (guest) => { 
        return { value: guest.id, label: `${guest.first_name} ${guest.last_name}` }; 
      };
      break;

    case "owner":
      resource += "owners";
      itemMap = (owner) => { 
        return { value: owner.id, label: owner.name }; 
      };
      break;

    case "property":
      resource = "properties";
      itemMap = (property) => { 
        return { value: property.id, label: property.name }; 
      };
      break;

    case "quote":
      resource = "quotes?created_since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (quote) => { 
        return { value: quote.id, label: quote.name }; 
      };
      break;

    case "inquiry":
      resource = "inquiries?created_since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (inquiry) => { 
        return { value: inquiry.id, label: inquiry.name }; 
      };
      break;
  }

  return orez.GetItems(z, bundle, resource)
    .then((items) => {
      return {
        key: 'entity_id',
        label: type.charAt(0).toUpperCase() + type.substring(1) + " ID",
        type: 'integer',
        required: true,
        choices: items.map(itemMap),
        list: false,
        altersDynamicFields: false,
      };
    });
};

const getEntityIdInput = async (z, bundle) => {
  return getEntityIdInputByType(z, bundle, bundle.inputData.entity_type);
};

const getFieldDefinitionEntityInputs = async (z, bundle) => {
  return orez.GetItems(z, bundle, "v2/fielddefinitions/" + bundle.inputData.field_definition_id)
    .then((fieldDefinitions) => {
      if (fieldDefinitions.length > 0) {
        const fieldDefinition = fieldDefinitions[0];

        if (fieldDefinition.type == "account") {
          return [
            { key: "entity_type", computed: true, default: "user" },
            { key: "entity_id", computed: true, default: 1 }
          ];
        }

        var fields = [];

        if (fieldDefinition.type == "contact")
          fields.push({ key: "entity_type", computed: true, default: "guest" });
        else
          fields.push({ key: "entity_type", computed: true, default: fieldDefinition.type });

        return getEntityIdInputByType(z, bundle, fieldDefinition.type)
          .then((idField) => {
            idField.helpText = `The ${fieldDefinition.type} for which to clear the "${fieldDefinition.name}" custom field.`;
            fields[fields.length] = idField;

            return fields;
          });
      }
      else {
        return [];
      }
    });
};

const buildPerformSubscribe = (body) => {
  return async (z, bundle) => {
    const fullBody = {
      ...body,
      webhook_url: bundle.targetUrl
    }; 

    return orez.PostItem(z, bundle, {
      resource: `v2/webhooksubscriptions`,
      body: fullBody
    });
  };
};

const performUnsubscribe = async (z, bundle) => {
  return orez.DeleteItem(z, bundle, `v2/webhooksubscriptions/${bundle.subscribeData.id}`);
};

module.exports = {
  GetFieldDefinitionEntityInputs: getFieldDefinitionEntityInputs,
  GetEntityIdInput: getEntityIdInput,
  BuildPerformSubscribe: buildPerformSubscribe,
  PerformUnsubscribe: performUnsubscribe,
};