require("./core/global.js");

const authentication = require('./authentication');
const bookingCreatedTrigger = require('./triggers/booking_created.js');
const bookingUpdatedTrigger = require('./triggers/booking_updated.js');
const contactCreatedTrigger = require('./triggers/contact_created.js');
const contactUpdatedTrigger = require('./triggers/contact_updated.js');
const tagAddCreate = require('./creates/tag_add.js');
const tagRemoveCreate = require('./creates/tag_remove.js');
const customFieldAddCreate = require('./creates/custom_field_add.js');
const customFieldRemoveCreate = require('./creates/custom_field_remove.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  triggers: {
    [bookingCreatedTrigger.key]: bookingCreatedTrigger,
    [bookingUpdatedTrigger.key]: bookingUpdatedTrigger,
    [contactCreatedTrigger.key]: contactCreatedTrigger,
    [contactUpdatedTrigger.key]: contactUpdatedTrigger,
  },
  creates: {
    [tagAddCreate.key]: tagAddCreate,
    [tagRemoveCreate.key]: tagRemoveCreate,
    [customFieldAddCreate.key]: customFieldAddCreate,
    [customFieldRemoveCreate.key]: customFieldRemoveCreate,
  },
  searches: {},
};
