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
    type: 'hook',
    performList: performList,
    performSubscribe: helpers.BuildPerformSubscribe({
      type: 'Booking',
      action: 'EntityUpdate',
    }),
    performUnsubscribe: helpers.PerformUnsubscribe,
    sample: orez.Types.Booking.Sample,
    outputFields: orez.Types.Booking.Fields,
  },
  key: 'booking_updated',
  noun: 'Booking',
  display: {
    label: 'Booking Updated',
    description: 'Triggers when a booking is changed.',
    hidden: false,
    important: true,
  },
};
