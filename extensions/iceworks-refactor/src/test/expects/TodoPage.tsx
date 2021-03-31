import React, { Component } from 'react';

export default class TodoComponent extends Component {
  text1: number;

  name2: string;

  name3: string;

  name4 = 'a';

  constructor(props) {
    super(props);
    this.text1 = 1;
    this.name2 = 'name2';
    this.name3 = '3';
  }

  handleClick = () => {
    console.log('hello world');
  };

  render() {
    return <div id={this.name2}>123</div>;
  }
}
