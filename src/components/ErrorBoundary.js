import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>😵</div>
          <h2 style={{ marginBottom: 8 }}>Kuch gadbad ho gayi!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>App mein koi error aaya. Page refresh karo.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Refresh Karo</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
