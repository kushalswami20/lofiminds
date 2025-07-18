"use client"

export function ThoughtIllustration() {
  return (
    <div className="flex items-center justify-center space-x-8 max-w-4xl mx-auto">
      {/* Tangled Thoughts - Left Side */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Custom tangled thoughts SVG */}
          <svg className="w-full h-full text-white/80" fill="none" stroke="currentColor" viewBox="0 0 200 200">
            {/* Head outline */}
            <circle cx="100" cy="140" r="45" strokeWidth="2" fill="none" />
            {/* Neck */}
            <line x1="100" y1="185" x2="100" y2="200" strokeWidth="2" />
            {/* Shoulders */}
            <path d="M70 200 Q100 190 130 200" strokeWidth="2" fill="none" />

            {/* Tangled, chaotic thought lines */}
            <g opacity="0.9">
              {/* Main tangled mess */}
              <path
                d="M60 40 Q80 20 120 35 Q140 50 110 70 Q90 85 130 90 Q150 95 125 110 Q100 125 140 115 Q160 105 135 130 Q110 145 150 140 Q170 135 145 155 Q120 170 160 165"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M80 25 Q100 10 140 25 Q160 40 130 55 Q110 70 150 75 Q170 80 145 95 Q120 110 160 105 Q180 100 155 120 Q130 135 170 130 Q190 125 165 145"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M70 35 Q90 15 130 30 Q150 45 120 60 Q100 75 140 80 Q160 85 135 100 Q110 115 150 110 Q170 105 145 125 Q120 140 160 135"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Additional chaotic scribbles */}
              <circle cx="85" cy="45" r="8" strokeWidth="1" fill="none" opacity="0.7" />
              <circle cx="125" cy="60" r="6" strokeWidth="1" fill="none" opacity="0.7" />
              <circle cx="110" cy="80" r="7" strokeWidth="1" fill="none" opacity="0.7" />
              <circle cx="140" cy="95" r="5" strokeWidth="1" fill="none" opacity="0.7" />

              {/* Crossing lines to show confusion */}
              <line x1="75" y1="50" x2="135" y2="85" strokeWidth="1" opacity="0.6" />
              <line x1="95" y1="35" x2="155" y2="110" strokeWidth="1" opacity="0.6" />
              <line x1="115" y1="25" x2="125" y2="125" strokeWidth="1" opacity="0.6" />
            </g>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg drop-shadow-md">Confused & Overwhelmed</h3>
          <p className="text-white/80 text-sm drop-shadow-sm">Tangled thoughts and emotions</p>
        </div>
      </div>

      {/* Arrow Connection */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-0.5 bg-gradient-to-r from-white/60 to-white/30"></div>
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="w-16 h-0.5 bg-gradient-to-r from-white/30 to-white/60"></div>
      </div>

      {/* Clear Thoughts - Right Side */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Clean, organized thought illustration */}
          <svg className="w-full h-full text-white/80" fill="none" stroke="currentColor" viewBox="0 0 200 200">
            {/* Head outline */}
            <circle cx="100" cy="140" r="45" strokeWidth="2" fill="none" />
            {/* Neck */}
            <line x1="100" y1="185" x2="100" y2="200" strokeWidth="2" />
            {/* Shoulders */}
            <path d="M70 200 Q100 190 130 200" strokeWidth="2" fill="none" />

            {/* Organized thought bubbles */}
            <circle cx="80" cy="60" r="12" strokeWidth="1.5" fill="none" opacity="0.8" />
            <circle cx="120" cy="45" r="10" strokeWidth="1.5" fill="none" opacity="0.8" />
            <circle cx="100" cy="30" r="8" strokeWidth="1.5" fill="none" opacity="0.8" />
            <circle cx="60" cy="80" r="6" strokeWidth="1.5" fill="none" opacity="0.8" />
            <circle cx="140" cy="70" r="7" strokeWidth="1.5" fill="none" opacity="0.8" />

            {/* Connecting lines showing organization */}
            <line x1="80" y1="72" x2="100" y2="95" strokeWidth="1" opacity="0.6" />
            <line x1="120" y1="55" x2="100" y2="95" strokeWidth="1" opacity="0.6" />
            <line x1="100" y1="38" x2="100" y2="95" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg drop-shadow-md">Clear & Organized</h3>
          <p className="text-white/80 text-sm drop-shadow-sm">Structured thoughts and peace</p>
        </div>
      </div>
    </div>
  )
}
