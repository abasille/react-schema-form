import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  name: PropTypes.string.isRequired,
  wrappedComponent: PropTypes.func,
  wrappedComponentProps: PropTypes.object,
  onChangeWrapper: PropTypes.func.isRequired,
};

const defaultProps = {
  wrappedComponentProps: {},
};

const contextTypes = {
  doc: PropTypes.object.isRequired,
  registerElementName: PropTypes.instanceOf(Function).isRequired,
  unregisterElementName: PropTypes.instanceOf(Function).isRequired,
  onChange: PropTypes.instanceOf(Function).isRequired,
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
    const WrappedComponent = this.props.wrappedComponent;

    return (
        <div>
          {WrappedComponent ?
              <WrappedComponent onChange={this.onChange} {...this.props.wrappedComponentProps}/>
              : null
          }
          {this.props.children ?
              React.cloneElement(this.props.children, { onChange: this.onChange, })
              : null
          }
        </div>
    );
  }
}

InputWrapper.propTypes = propTypes;
InputWrapper.defaultProps = defaultProps;
InputWrapper.contextTypes = contextTypes;
