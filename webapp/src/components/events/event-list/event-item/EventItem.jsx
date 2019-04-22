import React from 'react';

import './EventItem.css';

const eventItem = props => (
  <li key={props.eventId} className="event__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>$19.99</h2>
    </div>
    <div>
      <button className="btn">View details</button>
      <p>You're the owner of this event!</p>
    </div>
  </li>
);

export default eventItem;