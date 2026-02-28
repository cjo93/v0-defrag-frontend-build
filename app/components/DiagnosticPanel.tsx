'use client';

import ArchitectureDiagram from './ArchitectureDiagram';

export default function DiagnosticPanel() {
  return (
    <div className="blur-reveal delay-320" style={{
      border: '1px solid var(--line-mid)',
      padding: '40px',
      backgroundColor: 'var(--panel-black)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', marginBottom: '28px', borderBottom: '1px solid var(--line-low)', paddingBottom: '16px' }}>
        STRUCTURAL FIELD REPORT
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orientation</span>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-primary)' }}>Defined</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Defense Vector</span>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-primary)' }}>Engaged</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reinforcement Index</span>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent-risk)', fontWeight: 500 }}>Elevated</span>
      </div>

      <ArchitectureDiagram />
    </div>
  );
}
