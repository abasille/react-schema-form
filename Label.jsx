import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React from 'react';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  children: React.PropTypes.node,
};

const contextTypes = {
  schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
};

export class Label extends React.Component {
  render() {
    // Manage array notation
    const schemaName = this.props.name.replace(/\.([0-9]+)\./, '.$.');
    let label = (this.context.schema._schema
        && this.context.schema._schema[schemaName]
        && this.context.schema._schema[schemaName].label
    ) ? this.context.schema._schema[schemaName].label
        : schemaName;

    if (_.isFunction(label)) {
      label = label();
    }

    return (
        <label className="control-label">
          {this.props.children}
          {label}
        </label>
    );
  }
}

Label.propTypes = propTypes;
Label.contextTypes = contextTypes;
