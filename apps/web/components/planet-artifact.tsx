import { useId } from 'react';
import type { PlanetId } from '@/lib/avastar';

/** Illustrated fallback uses the same planet layer, never a separate floating card. */
export function PlanetArtifact({ id, view = 0 }: { id: PlanetId; view?: number }) {
  const uid = useId().replaceAll(':', '');
  return (
    <svg
      className={`planet-artifact artifact-${id}`}
      viewBox="0 0 1000 1000"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${uid}-metal`}
          x1="0"
          x2=".85"
          y1="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#f3eade" />
          <stop offset=".27" stopColor="#bdcbd0" />
          <stop offset=".56" stopColor="#6e879a" />
          <stop offset="1" stopColor="#26394b" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#e0b47c" />
          <stop offset="1" stopColor="#6c492e" />
        </linearGradient>
        <radialGradient id={`${uid}-glass`} cx=".3" cy=".25" r=".9">
          <stop stopColor="#90d5ec" />
          <stop offset=".25" stopColor="#286482" />
          <stop offset=".7" stopColor="#102c43" />
          <stop offset="1" stopColor="#060c17" />
        </radialGradient>
        <linearGradient id={`${uid}-paper`} x1="0" x2="1">
          <stop stopColor="#c2c5ba" />
          <stop offset=".75" stopColor="#f0e6ca" />
          <stop offset="1" stopColor="#8d928c" />
        </linearGradient>
      </defs>
      {id === 'shop' && (
        <g transform="translate(350 238) scale(1.46)">
          <ellipse cx="170" cy="343" rx="123" ry="17" fill="#030710" opacity=".4" />
          <g stroke={`url(#${uid}-metal)`} strokeWidth="8" strokeLinecap="round">
            <path d="M166 203L68 336M166 203L267 327M166 203L182 352" />
          </g>
          <g stroke="#152231" strokeWidth="12" strokeLinecap="round">
            <path d="M68 332L65 338M266 324L269 330M182 348L183 354" />
          </g>
          <path d="M161 169H175V235H161z" fill="#73899c" />
          <rect x="145" y="160" width="45" height="16" rx="4" fill="#24384b" />
          <path d="M146 166V127M189 164V114" stroke={`url(#${uid}-gold)`} strokeWidth="10" />
          <g transform="rotate(-35 170 126)">
            <path d="M61 97H267V151H61Z" fill={`url(#${uid}-metal)`} />
            <path d="M67 99H264" stroke="#eef3ed" strokeWidth="2" opacity=".6" />
            <rect x="88" y="93" width="13" height="61" rx="3" fill="#1e3144" />
            <rect x="203" y="93" width="13" height="61" rx="3" fill="#1e3144" />
            <path d="M242 89H277V159H242Z" fill="#23394b" />
            <ellipse
              cx="276"
              cy="124"
              rx="12"
              ry="35"
              fill="#112133"
              stroke="#91a5b0"
              strokeWidth="2"
            />
            <ellipse cx="278" cy="124" rx="9" ry="29" fill={`url(#${uid}-glass)`} />
            <path d="M274 103Q281 116 276 135" stroke="#b5effb" strokeWidth="1.2" opacity=".55" />
            <path d="M61 112H36V136H61" fill="#183044" />
            <path d="M39 112V95H20V122H39" fill="#7990a0" />
            <rect x="132" y="77" width="57" height="12" rx="5" fill="#29485d" />
            <path d="M149 87V100M175 86V98" stroke="#b99b76" strokeWidth="5" />
            <circle cx="159" cy="145" r="9" fill={`url(#${uid}-gold)`} />
          </g>
        </g>
      )}
      {id === 'learn' && (
        <g stroke="#c5d9e6" strokeWidth="1" opacity=".48" transform="rotate(-18 500 500)">
          {view === 0 && (
            <>
              <ellipse cx="500" cy="500" rx="205" ry="418" />
              <ellipse cx="500" cy="500" rx="80" ry="418" />
              <ellipse cx="500" cy="500" rx="418" ry="135" />
              <ellipse cx="500" cy="500" rx="362" ry="75" transform="translate(0 -200)" />
            </>
          )}
          {view === 1 && (
            <>
              <ellipse
                cx="500"
                cy="500"
                rx="435"
                ry="190"
                transform="rotate(-28 500 500)"
                stroke="#dbc7a7"
                strokeWidth="2"
              />
              <path d="M90 500H910" />
            </>
          )}
          {view === 2 && (
            <>
              <path d="M235 420L370 285L510 415L700 355L785 490" />
              {[
                [235, 420],
                [370, 285],
                [510, 415],
                [700, 355],
                [785, 490],
              ].map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="4" fill="#e2edf4" />
              ))}
            </>
          )}
        </g>
      )}
      {id === 'explore' && (
        <g>
          <path d="M0 785Q120 745 240 770T490 760T720 790T1000 745V1000H0Z" fill="#18252e" />
          <path d="M0 840Q190 805 410 840T770 825T1000 850V1000H0Z" fill="#09121b" />
          <path d="M0 903Q190 856 430 890T1000 882V1000H0Z" fill="#040a12" />
          <circle cx={260 + view * 240} cy="803" r="3" fill="#d6b992" />
        </g>
      )}
      {id === 'club' && (
        <g stroke="#bfd2e0" fill="none">
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx="500"
              cy="500"
              rx={438 + i * 18}
              ry={178 + i * 15}
              transform={`rotate(${-27 + i * 15} 500 500)`}
              opacity={i === view ? 0.55 : 0.14}
            />
          ))}
          <circle cx="170" cy={360 + view * 60} r="4" fill="#cddce5" />
        </g>
      )}
    </svg>
  );
}
