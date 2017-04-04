import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
};

const contextTypes = {
  doc: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.instanceOf(Function).isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
};

export class InputCheckbox extends React.Component {
  handleChange(event) {
    this.context.onChange(this.props.name, event.target.checked);
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  render() {
    return (
        <input name={this.props.name}
               type="checkbox"
               value={ObjectPath.getPath(this.context.doc, this.props.name)}
               onChange={this.handleChange.bind(this)}
        />
    );
  }
}

InputCheckbox.propTypes = propTypes;
InputCheckbox.contextTypes = contextTypes;
