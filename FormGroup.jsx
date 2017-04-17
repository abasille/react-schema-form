import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { check } from 'meteor/check';
import React from 'react';
import { Label } from '/imports/ui/react-components/components/forms/simple-schema/Label';
import { ErrorMessage } from '/imports/ui/react-components/components/forms/simple-schema/ErrorMessage';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  attributes: React.PropTypes.object,
  isComposite: React.PropTypes.bool,
};

const defaultProps = {
  isComposite: false,
};

const contextTypes = {
  schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
  validationContext: React.PropTypes.instanceOf(Object).isRequired,
};

export class FormGroup extends React.Component {
  render() {
    const _schema = this.context.schema._schema;
    const isRequired = !(_schema && _schema[this.props.name] && _schema[this.props.name].optional);
    const hasError = this.props.isComposite ?
        this.context.validationContext.invalidKeys()
            .filter(invalidKey => invalidKey.name.indexOf(this.props.name) !== -1)
            .length > 0
        : this.context.validationContext.keyIsInvalid(this.props.name);
    const classes = this.props.className ? this.props.className.split(' ') : ['form-group'];
    const attributes = this.props.attributes || {};

    if (isRequired) {
      attributes['data-required'] = true;
    }

    if (hasError) {
      classes.push('has-error');
    }

    return (
        <div className={classes.join(' ')} {...attributes}>
          <Label name={this.props.name}/>
          {this.props.children}
          <ErrorMessage name={this.props.name}/>
        </div>
    );
  }
}

FormGroup.propTypes = propTypes;
FormGroup.defaultProps = defaultProps;
FormGroup.contextTypes = contextTypes;
