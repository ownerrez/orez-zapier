const authentication = require('./authentication');

// Triggers
const bookingCreatedTrigger = require('./triggers/booking_created.js');
const bookingUpdatedTrigger = require('./triggers/booking_updated.js');
const contactCreatedTrigger = require('./triggers/contact_created.js');
const contactUpdatedTrigger = require('./triggers/contact_updated.js');
const fieldDefintionLookupTrigger = require('./triggers/field_definition_lookup.js');

// Actions
const bookingModify = require('./creates/booking_modify.js');
const customFieldAddCreate = require('./creates/custom_field_add.js');
const customFieldRemoveCreate = require('./creates/custom_field_remove.js');
const tagAddCreate = require('./creates/tag_add.js');
const tagRemoveCreate = require('./creates/tag_remove.js');

// Searches
const bookingLookup = require("./searches/booking_lookup.js");
const guestLookup = require("./searches/guest_lookup.js");

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  triggers: {
    // Zapier sorts them alphabetically by key
    [bookingCreatedTrigger.key]: bookingCreatedTrigger,
    [bookingUpdatedTrigger.key]: bookingUpdatedTrigger,
    [contactCreatedTrigger.key]: contactCreatedTrigger,
    [contactUpdatedTrigger.key]: contactUpdatedTrigger,
    [fieldDefintionLookupTrigger.key]: fieldDefintionLookupTrigger,
  },
  creates: {
    // Zapier sorts them alphabetically by key
    [customFieldAddCreate.key]: customFieldAddCreate,
    [customFieldRemoveCreate.key]: customFieldRemoveCreate,
    [tagAddCreate.key]: tagAddCreate,
    [tagRemoveCreate.key]: tagRemoveCreate,
    [bookingModify.key]: bookingModify,
  },
  searches: {
    // Zapier sorts them alphabetically by key
    [bookingLookup.key]: bookingLookup,
    [guestLookup.key]: guestLookup,
  },
};
