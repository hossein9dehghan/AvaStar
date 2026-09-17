import { useId } from 'react';
import type { PlanetId } from '@/lib/avastar';

/** Illustrated fallback uses the same planet layer, never a separate floating card. */
export function PlanetArtifact({ id }: { id: PlanetId }) {
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
        <g transform="translate(540 535) scale(1.15)">
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
        <>
          <path
            d="M147 466C70 237 467 113 768 329"
            stroke="#b1cadd"
            strokeWidth="1.8"
            strokeDasharray="4 9"
            opacity=".75"
          />
          {[
            [147, 466],
            [236, 252],
            [498, 211],
            [768, 329],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="13" stroke="#aabfd1" />
              <circle cx={x} cy={y} r="4" fill="#f0c98e" />
            </g>
          ))}
          <g transform="translate(96 615) rotate(-13 200 120)">
            <path
              d="M27 57L168 21L221 48L356 34L367 218L228 241L173 225L39 255Z"
              fill="#142d46"
              stroke="#648daa"
              strokeWidth="2"
            />
            <path
              d="M34 46L170 13L222 45L350 24L357 211L224 233L175 216L42 243Z"
              fill={`url(#${uid}-paper)`}
            />
            <path d="M170 13L175 216L224 233L222 45Z" fill="#9ca598" />
            <path
              d="M48 230L175 203L224 222L348 202M49 235L174 209L225 227L351 207"
              stroke="#606f74"
              opacity=".6"
            />
            <g stroke="#5a7484" strokeWidth="2" opacity=".72">
              <path d="M67 78L143 61M69 96L145 79M71 114L147 97M75 174L152 157M77 192L154 175" />
              <path d="M249 74L324 62M249 90L324 78M250 175L326 163M251 192L327 180" />
            </g>
            <path d="M265 130L284 109L309 141L327 106" stroke="#5c7a87" strokeWidth="1.5" />
            {[
              [265, 130],
              [284, 109],
              [309, 141],
              [327, 106],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#688294" />
            ))}
            <path d="M219 48L221 233" stroke="#39546b" strokeWidth="3" />
            <path d="M179 214L173 264L187 253L199 261L197 223" fill="#c69561" />
          </g>
        </>
      )}
      {id === 'explore' && (
        <>
          <path
            d="M146 677C68 338 581 46 921 330"
            stroke="#b7c9d6"
            opacity=".4"
            strokeWidth="1.5"
            strokeDasharray="3 10"
          />
          <g transform="translate(725 145) rotate(-16 110 100)">
            <path d="M19 102L208 89" stroke="#cbb084" strokeWidth="5" />
            <path
              d="M0 56L67 49L71 133L4 142Z M155 39L222 32L226 116L159 125Z"
              fill="#21455f"
              stroke="#7697ab"
              strokeWidth="2"
            />
            <g stroke="#658293" opacity=".7">
              <path d="M22 54L26 140M46 51L50 136M178 36L182 122M201 35L205 119M2 85L69 76M2 115L70 104M157 68L223 58M158 96L225 87" />
            </g>
            <path d="M80 64L127 58L140 75L143 125L93 133L80 117Z" fill={`url(#${uid}-gold)`} />
            <path d="M80 64L94 81L140 75M94 81L93 133" stroke="#edcea3" opacity=".5" />
            <path d="M110 65L113 27" stroke="#d4dbe0" strokeWidth="4" />
            <ellipse cx="111" cy="35" rx="27" ry="13" fill={`url(#${uid}-metal)`} />
            <path d="M91 31L112 8L130 29" stroke="#bdcbd2" />
            <circle cx="112" cy="8" r="3" fill="#dabb8d" />
          </g>
        </>
      )}
      {id === 'club' && (
        <g>
          <path
            d="M151 402L315 198L583 173L824 340L750 663L490 760L151 402 M315 198L750 663M151 402L824 340"
            stroke="#c8c3e3"
            strokeWidth="1.6"
            opacity=".65"
          />
          {[
            [151, 402],
            [315, 198],
            [583, 173],
            [824, 340],
            [750, 663],
            [490, 760],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i % 2 ? 14 : 23} stroke="#9bb7d4" strokeWidth="1.4" />
              <circle cx={x} cy={y} r={i % 2 ? 4 : 7} fill={i % 2 ? '#e5ecf5' : '#e5bf88'} />
              {!(i % 2) && (
                <circle cx={x} cy={y} r="32" stroke="#9bb7d4" strokeWidth=".7" opacity=".45" />
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
