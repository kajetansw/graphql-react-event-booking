const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!
                email: String!
                password: String
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { 
                                ...event._doc, 
                                _id: event.id 
                            };
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
                        createdEvent = { ...result._doc, _id: result._doc._id.toString() };
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
            },
            createUser: args => {
                return User.findOne({ email: args.userInput.email })
                    .then(user => {
                        if (user) {
                            throw new Error('User already exists!');
                        }
                        return bcrypt.hash(args.userInput.password, 12)
                    })
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        });
                        return user.save();
                    })
                    .then(result => {
                        return {
                            ...result._doc,
                            _id: result.id,
                            password: null
                        };
                    })
                    .catch(err => { throw err; });
            }
        },
        graphiql: true
    })
);

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-a2ga4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));