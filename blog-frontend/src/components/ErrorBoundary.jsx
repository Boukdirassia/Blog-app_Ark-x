import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="alert alert-danger">
          <h2>Une erreur est survenue</h2>
          <p>Nous sommes désolés, quelque chose s'est mal passé.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => this.setState({ hasError: false })}
          >
            Réessayer
          </button>
          {this.props.showDetails && (
            <details className="mt-4">
              <summary>Détails de l'erreur</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p className="mt-2">Composant Stack:</p>
              <pre className="p-2" style={{ 
                backgroundColor: 'var(--secondary-color)', 
                borderRadius: 'var(--radius)',
                overflow: 'auto'
              }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
