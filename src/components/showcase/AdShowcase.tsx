import { useEffect, useRef, useState } from 'react'
import { showcaseAds } from '../../data/ads'

// One big cinematic player. Pick an industry; its 3 clips play back to back as a ~30s spot.
export function AdShowcase() {
  const [active, setActive] = useState(0)
  const [clip, setClip] = useState(0)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ad = showcaseAds[active]

  useEffect(() => { setClip(0) }, [active])
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => undefined)
  }, [active, clip])

  return <div className="x-show">
    <div className="x-show-stage x-glass">
      <video ref={videoRef} src={ad.clips[clip]} muted={muted} playsInline autoPlay preload="auto"
        onEnded={() => setClip((c) => (c + 1) % ad.clips.length)} />
      <div className="x-show-shade" />
      <div className="x-show-copy">
        <span className="x-tag">{ad.industry} · spec ad</span>
        <h3>{ad.title}</h3>
        <p>{ad.line}</p>
      </div>
      <div className="x-show-progress">{ad.clips.map((_, i) => <i key={i} className={i < clip ? 'x-done' : i === clip ? 'x-now' : ''} />)}</div>
      <button type="button" className="x-show-sound" onClick={() => setMuted((m) => !m)}>{muted ? '🔇 Tap for sound' : '🔊 Sound on'}</button>
    </div>
    <div className="x-show-tabs" role="tablist">
      {showcaseAds.map((a, i) => <button key={a.industry} role="tab" aria-selected={i === active} className={i === active ? 'x-on' : ''} onClick={() => setActive(i)}>{a.industry}</button>)}
    </div>
  </div>
}
