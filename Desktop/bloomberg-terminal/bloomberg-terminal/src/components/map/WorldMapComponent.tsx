'use client'
import { useState, useEffect } from 'react'
import type { GlobalEvent } from '@/types'

interface Props {
  events: GlobalEvent[]
  onEventClick: (event: GlobalEvent) => void
  selectedEvent: GlobalEvent | null
}

const IMPACT_MARKER = {
  high: { fill: '#ff3b5c', glow: '#ff3b5c' },
  medium: { fill: '#ffd700', glow: '#ffd700' },
  low: { fill: '#00d084', glow: '#00d084' },
}

function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

export default function WorldMapComponent({ events, onEventClick, selectedEvent }: Props) {
  const [RSMLoaded, setRSMLoaded] = useState(false)
  const [RSMComponents, setRSMComponents] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    import('react-simple-maps')
      .then((mod) => {
        setRSMComponents(mod as Record<string, unknown>)
        setRSMLoaded(true)
      })
      .catch(() => {
        setRSMLoaded(true) // will render fallback
      })
  }, [])

  if (!RSMLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-terminal-bg" style={{ minHeight: 400 }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[#ff6b00]/30 border-t-[#ff6b00] rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Loading world map…</span>
        </div>
      </div>
    )
  }

  if (!RSMComponents) {
    return <FallbackMap events={events} onEventClick={onEventClick} selectedEvent={selectedEvent} />
  }

  const { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } = RSMComponents as {
    ComposableMap: React.ComponentType<Record<string, unknown>>
    Geographies: React.ComponentType<{ geography: string; children: (props: { geographies: Array<{ rsmKey: string }> }) => React.ReactNode }>
    Geography: React.ComponentType<Record<string, unknown>>
    Marker: React.ComponentType<{ coordinates: [number, number]; onClick: () => void; children: React.ReactNode }>
    ZoomableGroup: React.ComponentType<Record<string, unknown>>
  }

  return (
    <div className="relative w-full h-full bg-[#0a0a0f]" style={{ minHeight: 400 }}>
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0f0f1a"
                  stroke="#1a1a2e"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#16162a', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {events.map((event) => {
            const ms = IMPACT_MARKER[event.impact]
            const isSel = selectedEvent?.id === event.id
            return (
              <Marker
                key={event.id}
                coordinates={[event.lng, event.lat]}
                onClick={() => onEventClick(event)}
              >
                <circle r={8} fill={ms.glow} opacity={0.2} />
                <circle
                  r={isSel ? 6 : 4}
                  fill={ms.fill}
                  stroke={isSel ? 'white' : 'transparent'}
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer', filter: `drop-shadow(0 0 4px ${ms.fill})` }}
                />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
      <Legend />
    </div>
  )
}

function FallbackMap({ events, onEventClick, selectedEvent }: Props) {
  const W = 800, H = 400
  return (
    <div className="relative w-full h-full bg-[#0a0a0f] overflow-hidden" style={{ minHeight: 400 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#1a1a2e" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" opacity={0.5} />
        <line x1={0} y1={H/2} x2={W} y2={H/2} stroke="#1a1a2e" strokeWidth={1} />
        <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="#1a1a2e" strokeWidth={1} />
        <g fill="#0f0f1a" stroke="#2a2a4e" strokeWidth={0.8}>
          <ellipse cx={160} cy={160} rx={80} ry={70} />
          <ellipse cx={215} cy={270} rx={45} ry={60} />
          <ellipse cx={400} cy={130} rx={40} ry={35} />
          <ellipse cx={410} cy={240} rx={50} ry={70} />
          <ellipse cx={565} cy={155} rx={100} ry={70} />
          <ellipse cx={630} cy={295} rx={45} ry={30} />
        </g>
        {events.map((event) => {
          const { x, y } = latLngToXY(event.lat, event.lng, W, H)
          const ms = IMPACT_MARKER[event.impact]
          const isSel = selectedEvent?.id === event.id
          return (
            <g key={event.id} onClick={() => onEventClick(event)} style={{ cursor: 'pointer' }} transform={`translate(${x},${y})`}>
              <circle r={10} fill={ms.glow} opacity={0.15} />
              {isSel && <circle r={12} fill="none" stroke={ms.fill} strokeWidth={1.5} opacity={0.5} />}
              <circle r={isSel ? 6 : 4} fill={ms.fill} stroke={isSel ? 'white' : 'rgba(255,255,255,0.2)'} strokeWidth={1} style={{ filter: `drop-shadow(0 0 4px ${ms.fill})` }} />
            </g>
          )
        })}
      </svg>
      <Legend />
    </div>
  )
}

function Legend() {
  return (
    <div className="absolute bottom-3 left-3 flex gap-3 bg-[#12121f]/90 border border-[#1a1a2e] rounded-sm px-3 py-2">
      {[['High Impact','#ff3b5c'],['Medium','#ffd700'],['Low','#00d084']].map(([label, color]) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          <span style={{ fontSize: 10, color: '#8888aa' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
