import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { check } from 'meteor/check';
import { ObjectPath } from '/imports/api/utilities/object-path';
import './form.scss';

const propTypes = {
  doc: React.PropTypes.instanceOf(Object).isRequired,
  schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
  onSubmit: React.PropTypes.instanceOf(Function).isRequired,
  onChange: React.PropTypes.instanceOf(Function),
  contextName: React.PropTypes.string,
  debug: React.PropTypes.bool,
};

const defaultProps = {
  contextName: 'default',
};

const childContextTypes = {
  doc: React.PropTypes.instanceOf(Object).isRequired,
  schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
  validationContext: React.PropTypes.instanceOf(Object).isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
  onChange: React.PropTypes.instanceOf(Function).isRequired,
};

export class Form extends React.Component {
  constructor(props) {
    super(props);

    this.validationContext = this.props.schema.namedContext(this.props.contextName);
    this.elementNames = [];
    this.state = {
      doc: this.props.doc,
    };

    this.log('doc: ', this.props.doc);
    this.log('validationContext: ', this.validationContext);

    this.registerElementName = this.registerElementName.bind(this);
    this.unregisterElementName = this.unregisterElementName.bind(this);
    this.refreshValidationContext = this.refreshValidationContext.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  /**
   * Each form component must call this method when mounted. Used to filter the doc properties to validate and to
   * send to this.props.onChange().
   *
   * @param name {String}
   */
  registerElementName(name) {
    if (!_.contains(this.elementNames, name)) {
      this.elementNames.push(name);
      this.refreshValidationContext();
    }
  }

  /**
   * Each form component must call this method when unmounted. Used to filter the doc properties to validate and to
   * send to this.props.onChange().
   *
   * @param name {String}
   */
  unregisterElementName(name) {
    if (_.contains(this.elementNames, name)) {
      this.elementNames = _.without(this.elementNames, name);
      this.refreshValidationContext();
    }
  }

  /**
   * Refresh the validation context from the schema and the registered components.
   */
  refreshValidationContext() {
    this.validationContext = this.props.schema.pick(this.getRegisteredSchemaName())
        .namedContext(this.props.contextName);
    this.validate();
  }

  /**
   * Return the array of element name converted to simple-schema notation.
   * (e.g. 'emails.0.address' => 'emails.$.address')
   *
   * @returns {Array}
   */
  getRegisteredSchemaName() {
    return this.elementNames.map(eltName => eltName.replace(/\.([0-9]+)\./, '.$.'));
  }

  /**
   * @param name {String}
   * @param value {*}
   */
  handleChange(name, value) {
    const doc = ObjectPath.setPath(this.state.doc, name, value, { nullEmptyString: true });
    const docToValidate = ObjectPath.pickPath(doc, this.getRegisteredSchemaName());

    this.validate();

    if (this.props.onChange) {
      // onChange() callback defined => Notify the update to the Form creator
      this.props.onChange(docToValidate);
    }

    this.setState({
      doc: doc,
    });

    this.log('handleChange() - docToValidate: ', docToValidate);
    this.log('handleChange() - validationContext: ', this.validationContext);
  }

  handleSubmit(event) {
    const docToValidate = ObjectPath.pickPath(this.state.doc, this.getRegisteredSchemaName());
    const modifier = {};

    event.preventDefault();

    this.elementNames.forEach(eltName => {
      const value = ObjectPath.getPath(this.state.doc, eltName);

      if (value === null) {
        modifier.$unset = modifier.$unset || {};
        modifier.$unset[eltName] = true;
      } else {
        modifier.$set = modifier.$set || {};
        modifier.$set[eltName] = value;
      }
    });

    this.props.onSubmit(docToValidate, modifier, this.validationContext);
  }

  /**
   * Validate the doc with simple-schema
   */
  validate() {
    const docToValidate = ObjectPath.pickPath(this.state.doc, this.getRegisteredSchemaName());
    this.log('validate() - docToValidate: ', docToValidate);

    this.setState({
      // Perform the validation of doc
      isValid: this.validationContext.validate(docToValidate),
    });
  }

  log() {
    if (this.props.debug) {
      console.log.apply(null, arguments);
    }
  }

  /**
   * Call by the children component (this.context).
   *
   * @returns {*}
   */
  getChildContext() {
    return {
      doc: this.state.doc,
      schema: this.props.schema,
      validationContext: this.validationContext,
      registerElementName: this.registerElementName,
      unregisterElementName: this.unregisterElementName,
      onChange: this.handleChange,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.log('Form.componentWillReceiveProps(', nextProps, 'this.validationContext: ',
        this.validationContext);

    if (nextProps.schema !== this.props.schema) {
      this.refreshValidationContext();
    }

    if (nextProps.doc !== this.props.doc) {
      this.setState({
        doc: nextProps.doc,
      });
    }
  }

  render() {
    this.log('Form.render()');

    return (
        <form onSubmit={this.handleSubmit}>
          {this.props.children}
        </form>
    );
  }
}

Form.propTypes = propTypes;
Form.childContextTypes = childContextTypes;
