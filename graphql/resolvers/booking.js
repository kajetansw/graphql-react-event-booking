//@ts-check

const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },

    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5c5c7d5aba39792e40264972',
            event: fetchedEvent
        });

        const result = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking
                .findById(args.bookingId)
                .populate('event');
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: args.bookingId });

            return event;
        } catch (err) {
            throw err;
        }
    }
};
