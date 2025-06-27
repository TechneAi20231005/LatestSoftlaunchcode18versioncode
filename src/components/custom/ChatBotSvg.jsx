import * as React from 'react';
const SVGComponentChatBot = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    viewBox="0 0 64 64"
    style={{ marginTop: '6px' }}
  >
    <rect x={16} y={20} width={32} height={24} rx={8} fill="#e0e0e0" />
    <rect x={20} y={24} width={24} height={16} rx={6} fill="#0d2c59" />
    <circle cx={26} cy={32} r={3} fill="#00e0ff" />
    <circle cx={38} cy={32} r={3} fill="#00e0ff" />
    <path
      d="M30 36c1.5 1.5 4.5 1.5 6 0"
      stroke="#00e0ff"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M16 20a16 16 0 0 1 32 0"
      stroke="#b0bec5"
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <rect x={8} y={24} width={8} height={16} rx={3} fill="#2979ff" />
    <rect x={48} y={24} width={8} height={16} rx={3} fill="#2979ff" />
    <path
      d="M48 40c2 0 4 2 4 4s-2 4-4 4h-6"
      stroke="#0d2c59"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={42} cy={48} r={3} fill="#0d2c59" />
  </svg>
);
export default SVGComponentChatBot;
