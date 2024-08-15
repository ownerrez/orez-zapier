const orez = require("../orez");
const helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/bookings/${bundle.cleanedRequest.entity_id}`);
};

const performList = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/bookings?include_tags=true&include_fields=true&since_utc=${orez.AddDays(new Date(), -180).toJSON()}`);
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: false,
    type: 'hook',
    performList: performList,
    performSubscribe: helpers.BuildPerformSubscribe({
      type: 'Booking',
      action: 'EntityCreate',
    }),
    performUnsubscribe: helpers.PerformUnsubscribe,
    sample: orez.Types.Booking.Sample,
    outputFields: orez.Types.Booking.Fields,
  },
  key: 'booking_created',
  noun: 'Booking',
  display: {
    label: 'Booking Created',
    description:
      'Triggers when a new booking is created or blocked-off is added.',
    hidden: false,
  },
};
