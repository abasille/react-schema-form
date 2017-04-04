import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
};

const contextTypes = {
  doc: React.PropTypes.object.isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
};

export class InputHidden extends React.Component {
  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  render() {
    return (
        <input name={this.props.name}
               type="hidden"
               value={ObjectPath.getPath(this.context.doc, this.props.name) || ''}
        />
    );
  }
}

InputHidden.propTypes = propTypes;
InputHidden.contextTypes = contextTypes;
