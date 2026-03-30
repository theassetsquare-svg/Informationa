'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: '2rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
            페이지를 불러오는 중 문제가 발생했습니다
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{
              background: '#4F46E5', color: '#FFF', border: 'none', padding: '0.75rem 2rem',
              borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', minHeight: '44px',
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
