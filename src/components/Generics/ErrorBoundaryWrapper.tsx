import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const errorBoundaryRef = useRef<ErrorBoundary | null>(null);

  useEffect(() => {
    errorBoundaryRef.current?.resetErrorBoundary();
  }, [location.pathname]);

  return <ErrorBoundary ref={(ref) => (errorBoundaryRef.current = ref)}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;
