import React, { Component } from 'react';

class Customers extends Component {
  constructor() {
    super();
    this.state = {
      customers: []
    };
  }

  componentDidMount() {
    fetch('/customers').then(people => people.json())
    .then(people => this.setState({customers: people}))
   // .then(people => console.log(people));
  }

  render() {
    return (
      <div>
        <h2>Customers</h2>
            <h3>
                ID: {this.state.customers.id}
            </h3>
            <h3>
                Name: {this.state.customers.name}
            </h3>
      </div>
    );
  }
}

export default Customers;