// src/components/common/StatBadge.jsx
import React from 'react';

const StatBadge = ({ icon, label, value, color }) => (
  <div style={{
    display:       'flex',
    alignItems:    'center',
    gap:           10,
    background:    '#f8fafc',
    border:        '1.5px solid #e2e8f0',
    borderRadius:  16,
    padding:       '10px 16px',
    minWidth:      120,
    flex:          '1 1 120px',   /* flex-grow so it fills available space on mobile */
    direction:     'rtl',
    transition:    'box-shadow 0.2s',
  }}
  onMouseEnter={(e) => e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.08)'}
  onMouseLeave={(e) => e.currentTarget.style.boxShadow='none'}
  >
    <span style={{ fontSize:22 }}>{icon}</span>
    <div style={{ display:'flex', flexDirection:'column' }}>
      <span style={{ fontSize:10, color:'#94a3b8', fontWeight:700 }}>{label}</span>
      <span style={{ fontSize:18, fontWeight:900, color }}>{value?.toLocaleString()}</span>
    </div>
  </div>
);

export default StatBadge;
