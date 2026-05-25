import React from 'react';

export default function SafeIcon({ Icon, size=18, className='' }){
  if (!Icon) return <span style={{display:'inline-block', width:size, height:size}} className={className} />;
  return <Icon size={size} className={className} />;
}
