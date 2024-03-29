var orez = require("../orez");
var helpers = require("../orez_helpers");

const perform = async (z, bundle) => {
  return orez.GetItems(z, bundle, `v2/bookings/${orez.CleanId(bundle.inputData.id)}`)
    .then((items) => {
      if (!items.length) {
        return { status: 'No content', status_code: 204 };
      }
      else {
        if (bundle.inputDataRaw.cleaning_date != null && bundle.inputDataRaw.cleaning_date.toLowerCase() === "none") {
          bundle.inputData.cleaning_date = null;
        }

        var bookingId = bundle.inputData.id;
        var patchData = bundle.inputData;
        delete patchData.id;

        return orez.PatchItem(z, bundle, {
          resource: `v2/bookings/${orez.CleanId(bookingId)}`,
          body: patchData
        });
      }
    });
};

module.exports = {
  key: 'booking_modify',
  noun: 'Booking',
  display: {
    label: 'Modify Booking',
    description: 'Modify a booking.',
    hidden: false,
  },
  operation: {
    inputFields: [
      (z, bundle) => {
        return helpers.GetEntityIdInputByType(z, bundle, "booking", "id", "The ID of the booking to modify (E.g ORB1234 or 1234).");
      },
      {
        key: 'cleaning_date',
        label: 'Cleaning Date',
        type: 'datetime',
        helpText: 'The scheduled cleaning date (enter "none" to clear).',
        required: false
      },
    ],
    sample: orez.Types.Booking.Sample,
    outputFields: orez.Types.Booking.Fields,
    perform: perform,
  },
};
