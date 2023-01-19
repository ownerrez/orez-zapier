var orez = require("../orez");
var helpers = require("../orez_helpers");

const lookupGuest = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/bookings/${orez.CleanId(bundle.inputData.id)}`);
};

module.exports = {
  operation: {
    perform: lookupGuest,
    inputFields: [
      { label: "Booking ID", key: 'id', required: true, helpText: 'The ID of the booking to lookup (E.g ORB1234 or 1234).' }
    ],
    sample: orez.Types.Booking.Sample
  },
  key: 'booking_lookup',
  noun: 'Booking',
  display: {
    label: 'Booking Lookup',
    description: 'Finds a booking by ID.'
  }
};
