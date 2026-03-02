'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const libraries: ("places")[] = ["places"]

export default function BuildModule() {
  const router = useRouter()
  const [mode, setMode] = useState<'me' | 'dual'>('me')
  const [loading, setLoading] = useState(false)

  // Google Maps API Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  // Primary User State
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthLocation, setBirthLocation] = useState('')
  const [birthCoordinates, setBirthCoordinates] = useState({ lat: 0, lng: 0 })
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Secondary User State
  const [relationshipType, setRelationshipType] = useState('Partner')
  const [theirBirthDate, setTheirBirthDate] = useState('')
  const [theirBirthTime, setTheirBirthTime] = useState('')
  const [theirBirthLocation, setTheirBirthLocation] = useState('')
  const [theirBirthCoordinates, setTheirBirthCoordinates] = useState({ lat: 0, lng: 0 })
  const theirAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace()
      if (place && place.formatted_address && place.geometry?.location) {
        setBirthLocation(place.formatted_address)
        setBirthCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      }
    }
  }

  const handleTheirPlaceChanged = () => {
    if (theirAutocompleteRef.current !== null) {
      const place = theirAutocompleteRef.current.getPlace()
      if (place && place.formatted_address && place.geometry?.location) {
        setTheirBirthLocation(place.formatted_address)
        setTheirBirthCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      }
    }
  }

  const handleCheckout = async () => {
    if (!birthDate || !birthLocation || birthCoordinates.lat === 0) {
      alert("Please fill out required fields and select a valid location from the dropdown.")
      return
    }

    if (mode === 'dual' && (!theirBirthDate || !theirBirthLocation || theirBirthCoordinates.lat === 0)) {
      alert("Please fill out required fields for them and select a valid location.")
      return
    }

    setLoading(true)

    try {
      // Create session in Supabase & redirect to Stripe via our API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          data: {
            birthDate,
            birthTime,
            birthLocation,
            birthCoordinates,
            relationshipType,
            theirBirthDate,
            theirBirthTime,
            theirBirthLocation,
            theirBirthCoordinates
          }
        })
      })

      const json = await res.json()

      if (json.url) {
        window.location.href = json.url
      } else {
        throw new Error(json.error || 'Failed to create checkout session')
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred during checkout setup.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: '#000',
    border: '1px solid #fff',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    outline: 'none',
    transition: 'background 0.1s, color 0.1s',
  }

  return (
    <section
      id="build-module"
      style={{
        padding: '140px 48px',
        maxWidth: 1440,
        margin: '0 auto',
        borderTop: '1px solid var(--line-mid)',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Build your manual in under 60 seconds
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
            marginTop: 0,
            marginBottom: 64,
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Your baseline structural patterns are computed using precise astronomical data from your exact time of birth. We process the math. You get the manual.
        </p>

        {/* Toggle (Hardware switch style) */}
        <div
          style={{
            display: 'flex',
            border: '1px solid #fff',
            marginBottom: 48,
          }}
        >
          <button
            onClick={() => setMode('me')}
            style={{
              flex: 1,
              padding: '20px 0',
              background: mode === 'me' ? '#fff' : '#000',
              color: mode === 'me' ? '#000' : '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.1s linear',
            }}
          >
            Just Me
          </button>
          <button
            onClick={() => setMode('dual')}
            style={{
              flex: 1,
              padding: '20px 0',
              background: mode === 'dual' ? '#fff' : '#000',
              color: mode === 'dual' ? '#000' : '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              borderLeft: '1px solid #fff',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.1s linear',
            }}
          >
            Me + Someone
          </button>
        </div>

        {/* Forms Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Birth Date <span style={{ color: '#fff' }}>— Required</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Birth Time <span style={{ color: 'var(--text-secondary)' }}>— Optional (recommended)</span>
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={e => setBirthTime(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>
                If unknown, we use a stable estimate and hide what we can’t verify.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Birth Location <span style={{ color: '#fff' }}>— City, Country</span>
              </label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete
                  }}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={birthLocation}
                    onChange={e => setBirthLocation(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Loading Places API..."
                  disabled
                  style={inputStyle}
                />
              )}
            </div>

            {mode === 'dual' && (
              <>
                <div style={{ borderTop: '1px solid var(--line-mid)', margin: '24px 0' }} />
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Their Details</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    How do you know them?
                  </label>
                  <select
                    value={relationshipType}
                    onChange={e => setRelationshipType(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                    }}
                  >
                    <option value="partner">Partner</option>
                    <option value="family">Family</option>
                    <option value="work">Work</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Their Birth Date <span style={{ color: '#fff' }}>— Required</span>
                  </label>
                  <input
                    type="date"
                    value={theirBirthDate}
                    onChange={e => setTheirBirthDate(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Their Birth Time <span style={{ color: 'var(--text-secondary)' }}>— Optional</span>
                  </label>
                  <input
                    type="time"
                    value={theirBirthTime}
                    onChange={e => setTheirBirthTime(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Their Birth Location <span style={{ color: '#fff' }}>— City, Country</span>
                  </label>
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        theirAutocompleteRef.current = autocomplete
                      }}
                      onPlaceChanged={handleTheirPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={theirBirthLocation}
                        onChange={e => setTheirBirthLocation(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                        onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      placeholder="Loading Places API..."
                      disabled
                      style={inputStyle}
                    />
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                marginTop: 24,
                width: '100%',
                padding: '24px',
                background: loading ? '#333' : '#fff',
                color: loading ? '#888' : '#000',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'PROCESSING...' : (mode === 'me' ? 'Generate My Manual — $11' : 'Generate Our Manual — $11')}
            </button>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {mode === 'me' ? 'Delivered instantly. No login required.' : 'Includes loop map + exact interruption scripts.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
