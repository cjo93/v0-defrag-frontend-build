/* eslint-disable react/no-unescaped-entities */
'use client';

export default function JsonSignalBlock() {
  return (
    <div className="blur-reveal delay-450" style={{
      border: '1px solid var(--line-mid)',
      backgroundColor: 'var(--panel-black)',
      padding: '24px 28px',
    }}>
      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{`{\n`}</span>
        {`  `}
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>"orientation"</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>: </span>
        <span style={{ color: 'rgba(255,255,255,0.9)' }}>"Defined"</span>
        {`,\n  `}
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>"protection_bias"</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>: </span>
        <span style={{ color: 'rgba(255,255,255,0.9)' }}>"Control-Seeking"</span>
        {`,\n  `}
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>"loop_index"</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>: </span>
        <span style={{ color: 'var(--accent-risk)' }}>0.62</span>
        {`\n`}
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{`}`}</span>
      </pre>
    </div>
  );
}
