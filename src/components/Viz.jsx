import React, { Component } from 'react';
import FORCE from './FORCE';
import Node from './Node';
import NOCData from '../assets/NOC-data';
import styled from 'styled-components';

const GraphContainer = styled.div`
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 100vh;
  svg {
    background-color: steelblue;
    width: 100%;
    height: 100%;
  }
`;

export default class Viz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addLinkArray: [],
      name: '',
      nodes: NOCData.map(d => {
        d.name = d.job;
        return d;
      })
    };
    this.handleAddNode = this.handleAddNode.bind(this);
    this.addNode = this.addNode.bind(this);
  }

  componentDidMount() {
    const data = this.state;
    FORCE.initForce(data.nodes /* , data.links */);
    FORCE.tick(this);
    FORCE.drag();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nodes !== this.state.nodes) {
      const data = this.state;
      FORCE.initForce(data.nodes /* , data.links */);
      FORCE.tick(this);
      FORCE.drag();
    }
  }

  handleAddNode(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addNode(e) {
    e.preventDefault();
    this.setState(prevState => ({
      nodes: [
        ...prevState.nodes,
        { name: this.state.name, id: prevState.nodes.length + 1 }
      ],
      name: ''
    }));
  }

  render() {
    const nodes = this.state.nodes.map(node => {
      return <Node data={node} name={node.name} key={node.id} />;
    });
    return (
      <GraphContainer>
        {/* <form className="form-addSystem" onSubmit={this.addNode.bind(this)}>
          <h4 className="form-addSystem__header">New Node</h4>
          <div className="form-addSystem__group">
            <input
              value={this.state.name}
              onChange={this.handleAddNode.bind(this)}
              name="name"
              className="form-addSystem__input"
              id="name"
              placeholder="Name"
            />
            <label className="form-addSystem__label" htmlFor="title">
              Name
            </label>
          </div>
          <div className="form-addSystem__group">
            <input className="btnn" type="submit" value="add node" />
          </div>
        </form> */}
        <svg>
          <g>{nodes}</g>
        </svg>
      </GraphContainer>
    );
  }
}
