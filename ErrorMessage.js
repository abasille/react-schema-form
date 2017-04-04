import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React from 'react';

const propTypes = {
  name: React.PropTypes.string.isRequired,
};

const contextTypes = {
  validationContext: React.PropTypes.instanceOf(Object).isRequired,
};

export class ErrorMessage extends React.Component {
  render() {
    const validationMsg = this.context.validationContext.keyErrorMessage(this.props.name);

    return validationMsg ?
        <span className="help-block">{validationMsg}</span>
        : null;
  }
}

ErrorMessage.propTypes = propTypes;
ErrorMessage.contextTypes = contextTypes;
