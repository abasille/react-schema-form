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
  getLabel(nextContext) {
    // Manage array notation
    const context = nextContext || this.context;
    const schemaName = this.props.name.replace(/\.([0-9]+)\./, '.$.');
    let label = (context.schema._schema
        && context.schema._schema[schemaName]
        && context.schema._schema[schemaName].label
    ) ? context.schema._schema[schemaName].label
        : schemaName;

    if (_.isFunction(label)) {
      label = label();
    }

    return label;
  }

  render() {

    return (
        <label className="control-label">
          {this.props.children}
          {this.getLabel()}
        </label>
    );
  }
}

Label.propTypes = propTypes;
Label.contextTypes = contextTypes;
