const orez = require("./orez");

const getEntityIdInputByType = async (z, bundle, type, fieldKey, helpText) => {
  var resource = "v2/";
  var itemMap;

  switch (type)
  {
    case "booking":
      resource += "bookings?include_guest=true&since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (booking) => {
          return { 
            value: booking.id, 
            label: `${booking.guest && booking.guest.last_name ? booking.guest.first_name + " " + booking.guest.last_name : "ORB" + booking.id} (${new Date(booking.arrival).toDateString()} to ${new Date(booking.departure).toDateString()})`
          }; 
      };
      break;

    case "contact":
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
      resource += "properties";
      itemMap = (property) => { 
        return { value: property.id, label: property.name }; 
      };
      break;

    case "quote":
      resource += "quotes?created_since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (quote) => { 
        return { value: quote.id, label: quote.name }; 
      };
      break;

    case "inquiry":
      resource += "inquiries?created_since_utc=" + orez.AddDays(new Date(), -180).toJSON();
      itemMap = (inquiry) => { 
        return { value: inquiry.id, label: inquiry.name }; 
      };
      break;
  }

  //z.console.log("getEntityIdInputByType -> Resource", resource);

  return orez.GetItems(z, bundle, resource)
    .then((items) => {
      var field = {
        key: fieldKey || 'entity_id',
        label: type.charAt(0).toUpperCase() + type.substring(1) + " ID",
        type: 'integer',
        required: true,
        choices: items.map(itemMap),
        list: false,
        altersDynamicFields: false,
        helpText: helpText
      };

      //z.console.log("getEntityIdInputByType -> field", field);

      return field;
    });
};

const getEntityIdInput = async (z, bundle) => {
  if (bundle.inputData.entity_type)
    return getEntityIdInputByType(z, bundle, bundle.inputData.entity_type);
  else
    return {
      key: 'entity_id',
      label: "Item ID",
      type: 'integer',
      required: true,
      choices: [],
      list: false,
      altersDynamicFields: false,
    };
};

const getFieldDefinitionEntityInputs = async (z, bundle) => {
  if (bundle.inputData.field_definition_id)
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
    else
      return {
        key: 'entity_id',
        label: "Item ID",
        type: 'integer',
        required: true,
        choices: [],
        list: false,
        altersDynamicFields: false,
      };
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
  GetEntityIdInputByType: getEntityIdInputByType,
  GetEntityIdInput: getEntityIdInput,
  BuildPerformSubscribe: buildPerformSubscribe,
  PerformUnsubscribe: performUnsubscribe,
};