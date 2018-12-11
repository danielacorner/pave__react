import React from 'react';

const SVG3dEffect = () => (
  <defs>
    <linearGradient
      id="button_surface"
      gradientUnits="objectBoundingBox"
      x1="1"
      x2="1"
      y1="0"
      y2="1"
    >
      <stop stopColor="#990000" offset="0" />
      <stop stopColor="#770000" offset="0.67" />
    </linearGradient>

    <filter
      id="virtual_light"
      filterUnits="objectBoundingBox"
      x="-0.2"
      y="-0.2"
      width="2.5"
      height="2.5"
    >
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="alpha_blur" />

      {/* <!-- virtual shadow effect --> */}
      <feOffset in="alpha_blur" dx="4" dy="4" result="offset_alpha_blur" />

      {/* <!-- vitual lighting effect --> */}
      <feSpecularLighting
        in="alpha_blur"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="20"
        lightingColor="#FFFFFF"
        result="spec_light"
      >
        <fePointLight x="-5000" y="-10000" z="4000" />
      </feSpecularLighting>
      <feComposite
        in="spec_light"
        in2="SourceAlpha"
        operator="in"
        result="spec_light"
      />
      <feComposite
        in="SourceGraphic"
        in2="spec_light"
        operator="out"
        result="spec_light_fill"
      />

      {/* <!-- combine effects --> */}
      <feMerge>
        <feMergeNode in="offset_alpha_blur" />
        <feMergeNode in="spec_light_fill" />
      </feMerge>
    </filter>
  </defs>
);

export default SVG3dEffect;
