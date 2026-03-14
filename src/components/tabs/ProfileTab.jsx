// src/components/tabs/ProfileTab.jsx
import React from 'react';
import { AVATAR_COLORS } from '../../utils/helpers';
import JellyButton        from '../common/JellyButton';
import AudioManager       from '../../services/AudioManager';

const ProfileTab = ({ avatarTheme, onSetColor, onSetAccessory }) => (
  <div>
    <div style={{
      background:'#fff', borderRadius:24, padding:'20px 28px',
      marginBottom:20, boxShadow:'0 4px 16px rgba(0,0,0,0.07)',
      textAlign:'center', direction:'rtl',
    }}>
      <h2 style={{ fontSize:26, fontWeight:900, color:'#1e293b', marginBottom:6 }}>🎨 غرفة التجهيزات</h2>
      <p style={{ color:'#64748b', fontSize:14, fontWeight:600 }}>خصّص مظهرك وشخصيتك!</p>
    </div>

    {/* Color picker */}
    <div style={{ background:'#fff', borderRadius:22, padding:24, marginBottom:16, boxShadow:'0 4px 16px rgba(0,0,0,0.07)', direction:'rtl' }}>
      <h3 style={{ fontSize:18, fontWeight:900, color:'#1e293b', marginBottom:16 }}>🤖 لون الأفاتار</h3>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {AVATAR_COLORS.map((color) => (
          <div
            key={color}
            onClick={() => { AudioManager.getInstance().play('toggle'); onSetColor(color); }}
            style={{
              width:44, height:44, borderRadius:'50%',
              background:`#${color}`, cursor:'pointer',
              border:      avatarTheme.bg === color ? '3px solid #3ba2f8' : '3px solid transparent',
              transform:   avatarTheme.bg === color ? 'scale(1.18)' : 'scale(1)',
              boxShadow:   avatarTheme.bg === color ? '0 0 0 3px rgba(59,162,248,0.3)' : 'none',
              transition:  'all 0.18s',
            }}
          />
        ))}
      </div>
    </div>

    {/* Accessory picker */}
    <div style={{ background:'#fff', borderRadius:22, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.07)', direction:'rtl' }}>
      <h3 style={{ fontSize:18, fontWeight:900, color:'#1e293b', marginBottom:16 }}>👑 الملحقات</h3>
      <div style={{ display:'flex', gap:10 }}>
        {[
          { id:'crown', label:'👑 تاج'   },
          { id:'star',  label:'⭐ نجمة'  },
          { id:'none',  label:'❌ بدون'  },
        ].map((acc) => (
          <JellyButton
            key={acc.id}
            variant={avatarTheme.accessory === acc.id ? 'primary' : 'dark'}
            size="sm"
            sound="toggle"
            onClick={() => onSetAccessory(acc.id)}
            style={{
              opacity: avatarTheme.accessory === acc.id ? 1 : 0.55,
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            {acc.label}
          </JellyButton>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileTab;
