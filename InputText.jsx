import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  className: React.PropTypes.string,
  attributes: React.PropTypes.object,
};

const defaultProps = {
  type: 'text',
  className: 'form-control',
};

const contextTypes = {
  doc: React.PropTypes.object.isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
  onChange: React.PropTypes.instanceOf(Function).isRequired,
};

export class InputText extends React.Component {
  handleChange(event) {
    const value = this.props.type === 'number' ?
        parseFloat(event.target.value)
        : event.target.value;

    this.context.onChange(this.props.name, value);
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const hasValueChanged = ObjectPath.getPath(this.context.doc, this.props.name) !== ObjectPath.getPath(nextContext.doc, this.props.name);

    return hasValueChanged;
  }

  render() {
    const attributes = this.props.attributes || {};

    return (
        <input name={this.props.name}
               type={this.props.type}
               value={ObjectPath.getPath(this.context.doc, this.props.name) || ''}
               placeholder={this.props.placeholder}
               onChange={this.handleChange.bind(this)}
               className={this.props.className}
               {...attributes}
        />
    );
  }
}

InputText.propTypes = propTypes;
InputText.defaultProps = defaultProps;
InputText.contextTypes = contextTypes;
