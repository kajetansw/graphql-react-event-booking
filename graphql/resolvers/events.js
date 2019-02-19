const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return transformEvent(event);
                });
            })
            .catch(err => {
                throw err;
            });
    },

    createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5c5c7d5aba39792e40264972'
        });
        let createdEvent;
        return event.save()
            .then(result => {
                createdEvent = transformEvent(result);
                return User.findById('5c5c7d5aba39792e40264972');
            })
            .then(user => {
                if (!user) {
                    throw new Error('User doesn\'t exist!');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => { throw err; });
    }
};
