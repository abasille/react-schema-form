import { Meteor } from 'meteor/meteor';
import React from 'react';

const propTypes = {
  label: React.PropTypes.string.isRequired,
};

const contextTypes = {
  validationContext: React.PropTypes.instanceOf(Object).isRequired,
};

export class ButtonSubmit extends React.Component {
  render() {
    return (
        <button type="submit"
                disabled={!this.context.validationContext.isValid()}
                className="btn btn-primary"
        >
          {this.props.label}
        </button>
    );
  }
}

ButtonSubmit.propTypes = propTypes;
ButtonSubmit.contextTypes = contextTypes;
