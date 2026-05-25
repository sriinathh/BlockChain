import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== RENDER ERROR CAUGHT ===');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Stack Trace:', error.stack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.error) {
      const { error, errorInfo } = this.state;
      return (
        <div className="p-6 max-w-4xl mx-auto bg-red-900/20 border border-red-600/50 rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Render Error</h2>
          <div className="mb-4">
            <p className="text-sm font-mono text-red-300 mb-2">Message:</p>
            <pre className="text-xs bg-black/60 p-3 rounded overflow-auto max-h-32 text-slate-200">{String(error.message)}</pre>
          </div>
          {errorInfo && (
            <div>
              <p className="text-sm font-mono text-red-300 mb-2">Component Stack:</p>
              <pre className="text-xs bg-black/60 p-3 rounded overflow-auto max-h-48 text-slate-200">{errorInfo.componentStack}</pre>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-4">Check browser console for full stack trace</p>
        </div>
      );
    }
    return this.props.children;
  }
}
