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
    sample: {
      adults: 1,
      arrival: '2022-04-28',
      charges: [
        {
          amount: 950,
          commission_amount: 190,
          description:
            '5 nights (4/28, 5/1 - 5/4) during Spring at £190.00 per night',
          is_channel_managed: false,
          is_commission_all: false,
          is_expense_all: false,
          is_taxable: false,
          owner_amount: 760,
          owner_commission_percent: 20,
          position: 0,
          rate: 950,
          rate_is_percent: false,
          type: 'rent',
        },
      ],
      children: 0,
      departure: '2022-05-04',
      guest_id: 34013,
      id: 273491,
      infants: 0,
      is_block: false,
      pets: 0,
      property_id: 182918563,
      status: 'active',
      type: 'booking',
    },
  },
  key: 'booking_lookup',
  noun: 'Booking',
  display: {
    label: 'Booking Lookup',
    description: 'Finds a booking by ID.'
  }
};
