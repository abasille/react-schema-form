import React from 'react';
import { Form } from './Form';
import { InputText } from './InputText';
import { CurrencyAmountSchema } from '/imports/api/utilities/schemas';
import { ObjectPath } from '/imports/api/utilities/object-path';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  className: React.PropTypes.string,
  attributes: React.PropTypes.object,
};

export class InputCurrencyAmount extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value) {
    if (name === 'amount') {
      this.context.onChange(this.props.name, {
        amount: value ? value * 100 : undefined,
        currency: 'EUR',
      });
    }
  }

  /**
   * Called by the children component (this.context).
   *
   * @returns {*}
   */
  getChildContext() {
    const currencyAmount = ObjectPath.getPath(this.context.doc, this.props.name);

    return {
      ...this.context,
      doc: {
        amount: currencyAmount ? currencyAmount.amount / 100 : undefined,
        currency: currencyAmount ? currencyAmount.currency : 'EUR',
      },
      schema: CurrencyAmountSchema,
      onChange: this.handleChange,
      registerElementName: () => true,
      unregisterElementName: () => true,
    };
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
    this.context.registerElementName(this.props.name + '.amount');
    this.context.registerElementName(this.props.name + '.currency');
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
    this.context.unregisterElementName(this.props.name + '.amount');
    this.context.unregisterElementName(this.props.name + '.currency');
  }

  render() {
    const { name, ...passThroughProps } = this.props;

    return (
        <div className="af-currency-amount">
          <InputText name="amount"
                     type="number"
                     onChange={this.handleChange}
                     {...passThroughProps}/>
          <span className="af-currency form-control">EUR</span>
        </div>
    );
  }
}

InputCurrencyAmount.propTypes = propTypes;
InputCurrencyAmount.contextTypes = Form.childContextTypes;
InputCurrencyAmount.childContextTypes = Form.childContextTypes;
