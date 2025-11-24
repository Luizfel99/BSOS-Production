'use client';

import React from 'react';

export default function SentryDebugPage() {
  const throwClientError = () => {
    throw new Error('Sentry test error (Client)');
  };

  const triggerUnhandledPromise = () => {
    // Unhandled rejection simulation
    // eslint-disable-next-line no-new
    new Promise((_resolve, _reject) => {
      throw new Error('Sentry unhandled rejection (Client)');
    });
  };

  const callApiError = async () => {
    await fetch('/api/sentry-test');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Sentry Debug</h1>
      <p>Use the buttons below to generate test events in Sentry.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <button
          onClick={throwClientError}
          style={{ padding: '10px 16px', background: '#ef4444', color: '#fff', borderRadius: 6 }}
        >
          Throw Client Error
        </button>
        <button
          onClick={triggerUnhandledPromise}
          style={{ padding: '10px 16px', background: '#f59e0b', color: '#111', borderRadius: 6 }}
        >
          Unhandled Rejection
        </button>
        <button
          onClick={callApiError}
          style={{ padding: '10px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6 }}
        >
          Call API Error
        </button>
      </div>
      <p style={{ marginTop: 16, color: '#6b7280' }}>
        Check your Sentry dashboard after triggering to confirm event capture.
      </p>
    </div>
  );
}
