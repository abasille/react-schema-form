import React from 'react';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  onChangeWrapper: React.PropTypes.func.isRequired,
  // placeholder: React.PropTypes.string,
  // className: React.PropTypes.string,
  // attributes: React.PropTypes.object,
};

const contextTypes = {
  doc: React.PropTypes.object.isRequired,
  registerElementName: React.PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: React.PropTypes.instanceOf(Function).isRequired,
  onChange: React.PropTypes.instanceOf(Function).isRequired,
};

export class InputWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.context.registerElementName(this.props.name);
  }

  componentWillUnmount() {
    this.context.unregisterElementName(this.props.name);
  }

  onChange() {
    const wrapperValue = this.props.onChangeWrapper(...arguments);
    this.context.onChange(this.props.name, wrapperValue);
  }

  render() {
    return React.cloneElement(this.props.children, {
          onChange: this.onChange,
        }
    );
  }
}

InputWrapper.propTypes = propTypes;
InputWrapper.contextTypes = contextTypes;
