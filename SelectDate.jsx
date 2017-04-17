import { TAPi18n } from 'meteor/tap:i18n';
import React from 'react';
import { Form } from './Form';
import { InputText } from './InputText';
import { Select } from './Select';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  attributes: React.PropTypes.object,
};

export class SelectDate extends React.Component {
  constructor(props, context) {
    super(props, context);

    const dateValue = ObjectPath.getPath(this.context.doc, this.props.name);
    const isSet = dateValue instanceof Date;

    this.state = {
      day: isSet ? dateValue.getDate() : undefined,
      month: isSet ? dateValue.getMonth() + 1 : undefined,
      year: isSet ? dateValue.getFullYear() : undefined,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @param name {String} Can be {'day', 'month', 'year'}
   * @param value {Number}
   * - name === 'day': 1-31
   * - name === 'month': 1-12
   * - name === 'year': aaaa
   */
  handleChange(name, value) {
    const _state = this.state;

    _state[name] = value;
    this.setState({
      [name]: value,
    });

    // Parse ISO-8601 Date format (http://dygraphs.com/date-formats.html)
    const { day, month, year } = _state;
    const dateValue = (day && month && year && (year + '').length === 4) ?
        new Date(`${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}T00:00:00Z`)
        : undefined;

    this.context.onChange(this.props.name, dateValue);
  }

  /**
   * Called by the children component (this.context).
   *
   * @returns {*}
   */
  getChildContext() {
    return {
      ...this.context,
      doc: {
        day: this.state.day,
        month: this.state.month,
        year: this.state.year,
      },
      schema: new SimpleSchema({
        day: {
          type: Number,
        },
        month: {
          type: Number,
          autoform: {
            options: {
              1: TAPi18n.__('schema.date.month.1'),
              2: TAPi18n.__('schema.date.month.2'),
              3: TAPi18n.__('schema.date.month.3'),
              4: TAPi18n.__('schema.date.month.4'),
              5: TAPi18n.__('schema.date.month.5'),
              6: TAPi18n.__('schema.date.month.6'),
              7: TAPi18n.__('schema.date.month.7'),
              8: TAPi18n.__('schema.date.month.8'),
              9: TAPi18n.__('schema.date.month.9'),
              10: TAPi18n.__('schema.date.month.10'),
              11: TAPi18n.__('schema.date.month.11'),
              12: TAPi18n.__('schema.date.month.12'),
            },
          },
        },
        year: {
          type: Number,
        },
      }),
      onChange: this.handleChange,
      registerElementName: () => true,
      unregisterElementName: () => true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const dateValue = ObjectPath.getPath(nextContext.doc, this.props.name);
    const isSet = dateValue instanceof Date;

    if (isSet) {
      this.setState({
        day: dateValue.getDate(),
        month: dateValue.getMonth() + 1,
        year: dateValue.getFullYear(),
      });
    }
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  render() {
    const currentYear = (new Date()).getFullYear();

    return (
        <div className="select-date">
          <InputText name="day"
                     type="number"
                     placeholder={TAPi18n.__('schema.date.day.shortFormatLabel')}
                     attributes={{ min: 1, max: 31, maxLength: 2, }}
                     className="form-control day"
          />
          <Select name="month"
                  placeholder={TAPi18n.__('schema.date.month.longFormatLabel')}
                  className="month"
          />
          <InputText name="year"
                     type="number"
                     placeholder={TAPi18n.__('schema.date.year.longFormatLabel')}
                     attributes={{ maxLength: 4, }}
                     className="form-control year"
          />
        </div>
    );
  }
}

SelectDate.propTypes = propTypes;
SelectDate.childContextTypes = Form.childContextTypes;
SelectDate.contextTypes = Form.childContextTypes;
