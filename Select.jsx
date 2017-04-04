import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React from 'react';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
};

const defaultProps = {
  placeholder: 'Select one...',
};

const contextTypes = {
  doc: React.PropTypes.object.isRequired,
  schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
  onChange: React.PropTypes.instanceOf(Function).isRequired,
};

export class Select extends React.Component {
  handleChange(event) {
    this.context.onChange(this.props.name, event.target.value);
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  render() {
    const _schema = this.context.schema._schema;
    const schemaOptions = (_schema
        && _schema[this.props.name]
        && _schema[this.props.name].autoform
        && _schema[this.props.name].autoform.options
    ) ? _schema[this.props.name].autoform.options
        : undefined;
    const options = _.isFunction(schemaOptions) ? schemaOptions() : schemaOptions;

    return (
        <select name={this.props.name}
                value={ObjectPath.getPath(this.context.doc, this.props.name)}
                onChange={this.handleChange.bind(this)}
                className="form-control"
        >
          <option value={null}>{this.props.placeholder}</option>
          {options ?
              _.map(options, (v, k) =>
                  <option key={_.isObject(v) && v.value ? v.value : k}
                          value={_.isObject(v) && v.value ? v.value : k}
                  >
                    {_.isObject(v) && v.label ? v.label : v}
                  </option>
              )
              : null
          }
        </select>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;
Select.contextTypes = contextTypes;
