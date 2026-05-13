import { Component, ReactNode, ErrorInfo } from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../organisms/ErrorPage';
import CustomError from '../../utils/CustomError';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorCode: string;
  actionText?: string;
  customAction?: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorCode: '', actionText: undefined, customAction: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = '500';
    let actionText;
    let customAction;

    if (error instanceof CustomError) {
      errorMessage = error.message;
      errorCode = error.code;
      actionText = error.actionText;
      customAction = error.customAction;
    } else {
      errorMessage = error.message;
    }

    return { hasError: true, errorMessage, errorCode, actionText, customAction };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState(ErrorBoundary.getDerivedStateFromError(error));
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, errorMessage: '', errorCode: '', actionText: undefined, customAction: undefined });
  };

  handleCustomAction = () => {
    if (this.state.customAction) {
      this.state.customAction();
    }
    this.resetErrorBoundary();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          errorMsg={this.state.errorMessage}
          errorCode={this.state.errorCode}
          actionText={this.state.actionText}
          handleCustomAction={this.handleCustomAction}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;