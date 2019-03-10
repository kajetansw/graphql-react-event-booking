const eventResolvers = require('./events');
const bookingResolvers = require('./booking');
const authResolvers = require('./auth');

module.exports = {
  ...eventResolvers,
  ...bookingResolvers,
  ...authResolvers
};