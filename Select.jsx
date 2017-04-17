import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React from 'react';
import { diff } from 'deep-object-diff';
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

  /**
   * As select can contain a lot of options, limit the frequency of refresh.
   *
   * @param nextProps
   * @param nextState
   * @param nextContext
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const hasNameChanged = this.props.name !== nextProps.name;
    const hasValueChanged = ObjectPath.getPath(this.context.doc,
            this.props.name) !== ObjectPath.getPath(nextContext.doc, nextProps.name);
    const hasPlaceholderChanged = this.props.placeholder !== nextProps.placeholder;
    const hasOptionsChanged = !_.isEmpty(diff(this.options,
        this.getOptions(nextProps, nextContext)));

    return hasNameChanged || hasValueChanged || hasPlaceholderChanged || hasOptionsChanged;
  }

  getOptions(nextProps, nextContext) {
    const _schema = nextContext ? nextContext.schema._schema : this.context.schema._schema;
    const name = nextProps ? nextProps.name : this.props.name;
    const schemaOptions = (_schema
        && _schema[name]
        && _schema[name].autoform
        && _schema[name].autoform.options
    ) ? _schema[name].autoform.options
        : undefined;
    const options = _.isFunction(schemaOptions) ? schemaOptions() : schemaOptions;

    return options;
  }

  render() {
    this.options = this.getOptions();

    return (
        <select name={this.props.name}
                value={ObjectPath.getPath(this.context.doc, this.props.name)}
                onChange={this.handleChange.bind(this)}
                className="form-control"
        >
          <option value={null}>{this.props.placeholder}</option>
          {this.options ?
              _.map(this.options, (v, k) =>
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
