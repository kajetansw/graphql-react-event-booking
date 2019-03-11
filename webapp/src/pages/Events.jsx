import React, { Component } from 'react';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({
      ...this.state,
      creating: true
    });
  };

  modalConfirmHandler = () => {
    this.setState({
      ...this.state,
      creating: false
    });
  };

  modalCancelHandler = () => {
    this.setState({
      ...this.state,
      creating: false
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <p>Modal Content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
