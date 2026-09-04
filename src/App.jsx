import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Ban, Camera, CameraOff, ChevronRight, Flag, LockKeyhole, Maximize2, MessageCircle, Mic, MicOff, Minus, Move, PanelsTopLeft, PictureInPicture2, ShieldCheck, Sparkles, UserRound, Video, X } from 'lucide-react'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const WS_BASE = (import.meta.env.VITE_WS_URL || '').replace(/\/$/, '')

const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}/${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

function Logo({ compact = false }) {
  return <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime text-ink transition-transform duration-500 ease-spring"><Sparkles size={18} strokeWidth={2.5}/></div><span className={`display text-xl font-bold tracking-tight ${compact ? 'room-logo-text' : ''}`}>kutana</span></div>
}

function Landing({ onStart, user, onAuth, onLogout }) {
  return <main className="relative min-h-screen overflow-hidden bg-ink grid-bg">
    <div className="glow pointer-events-none absolute left-1/2 top-10 h-[680px] w-[900px] -translate-x-1/2" />
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <Logo />
      <div className="flex items-center gap-3">{user ? <><span className="hidden text-sm text-zinc-400 sm:block">Hi, {user.username}</span><button onClick={onLogout} className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">Log out</button></> : <button onClick={onAuth} className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">Sign in</button>}</div>
    </nav>
    <section className="page-enter relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-12 text-center sm:px-6 sm:pt-20 md:pt-28">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-4 py-2 text-sm font-semibold text-lime"><span className="h-2 w-2 rounded-full bg-lime animate-pulse"/>Real people. Real conversations.</div>
      <h1 className="display max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-.055em] min-[390px]:text-5xl sm:text-7xl md:text-8xl">The internet feels better <span className="text-lime">face to face.</span></h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">Meet someone new, somewhere in the world. No feeds, no followers—just one genuine conversation at a time.</p>
      <button onClick={onStart} className="spring-button group mt-10 flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-base font-bold text-ink shadow-[0_0_45px_rgba(183,243,74,.2)] hover:bg-[#c5fb60]">Start a conversation <ArrowRight size={19} className="transition-transform duration-500 ease-spring group-hover:translate-x-1"/></button>
      <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><ShieldCheck size={14}/> 18+ only · Be kind · Stay safe</p>
      <div className="mt-24 grid w-full gap-4 text-left md:grid-cols-3">
        {[['01','Instant connection','One click puts you face-to-face with someone new.'],['02','Private by design','Calls are peer-to-peer. We never record your conversations.'],['03','You’re in control','Skip, mute, block, or report whenever you need.']].map(([n,t,d]) => <div key={n} className="feature-card glass rounded-3xl p-7"><span className="text-xs font-bold text-lime">{n}</span><h3 className="display mt-8 text-xl font-semibold">{t}</h3><p className="mt-3 leading-6 text-zinc-400">{d}</p></div>)}
      </div>
    </section>
    <footer className="relative border-t border-white/5 px-6 py-6 text-center text-xs text-zinc-600">© 2026 Kutana · Community guidelines · Privacy · Terms</footer>
  </main>
}

function Permission({ onAllow, onBack, error }) {
  return <div className="app-height flex items-center justify-center overflow-y-auto bg-ink px-4 py-6 grid-bg sm:px-6"><div className="dialog-enter glass w-full max-w-md rounded-[1.75rem] p-6 text-center shadow-2xl sm:rounded-[2rem] sm:p-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/10 text-lime"><Video size={28}/></div><h2 className="display mt-6 text-3xl font-semibold tracking-tight">Ready to say hello?</h2><p className="mt-3 leading-7 text-zinc-400">We need camera and microphone access so the other person can see and hear you.</p>{error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button onClick={onAllow} className="spring-button mt-7 w-full rounded-xl bg-lime py-3.5 font-bold text-ink hover:bg-[#c5fb60]">Allow camera & microphone</button><button onClick={onBack} className="spring-button mt-3 text-sm text-zinc-500 hover:text-white">Go back</button><div className="mt-7 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-xs text-zinc-500"><LockKeyhole size={14}/> Your call is not recorded</div></div></div>
}

function Control({ onClick, active = true, danger = false, children, label }) {
  return <button title={label} aria-label={label} onClick={onClick} className={`call-control spring-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:h-12 sm:w-12 ${danger ? 'border-red-400/20 bg-red-500 text-white hover:bg-red-400' : active ? 'border-white/10 bg-zinc-800 text-white hover:bg-zinc-700' : 'border-white/10 bg-white text-ink'}`}>{children}</button>
}

function Room({ stream, onExit, user }) {
  const localVideo = useRef(null), remoteVideo = useRef(null), videoStage = useRef(null), ws = useRef(null), peer = useRef(null), dragState = useRef(null)
  const [status, setStatus] = useState('connecting'), [muted, setMuted] = useState(false), [cameraOn, setCameraOn] = useState(true)
  const [messages, setMessages] = useState([]), [draft, setDraft] = useState(''), [chatOpen, setChatOpen] = useState(() => window.innerWidth >= 1024)
  const [session, setSession] = useState(null), [partnerUserId, setPartnerUserId] = useState(null), [reporting, setReporting] = useState(false)
  const [layout, setLayout] = useState('pip'), [selfVisible, setSelfVisible] = useState(true), [selfPosition, setSelfPosition] = useState(null)
  const iceServers = useRef([{ urls: 'stun:stun.l.google.com:19302' }])

  useEffect(() => { if (localVideo.current) localVideo.current.srcObject = stream }, [stream, layout, selfVisible])
  useEffect(() => {
    const resetTilePosition = () => setSelfPosition(null)
    window.addEventListener('resize', resetTilePosition)
    return () => window.removeEventListener('resize', resetTilePosition)
  }, [])
  useEffect(() => {
    let cancelled = false
    api('rtc-config/').then(x => { iceServers.current = x.iceServers }).catch(() => {})
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const socketUrl = WS_BASE ? `${WS_BASE}/ws/chat/` : `${protocol}://${location.host}/ws/chat/`
    const socket = new WebSocket(socketUrl)
    ws.current = socket
    socket.onopen = () => socket.send(JSON.stringify({ type: 'join' }))
    socket.onmessage = async ({ data }) => {
      if (cancelled) return
      const msg = JSON.parse(data)
      if (msg.type === 'waiting') setStatus('waiting')
      if (msg.type === 'matched') { setSession(msg.sessionId); setPartnerUserId(msg.partnerUserId); setStatus('matched'); setMessages([]); await createPeer(msg.initiator) }
      if (msg.type === 'offer') { await ensurePeer(); await peer.current.setRemoteDescription(msg.sdp); const answer = await peer.current.createAnswer(); await peer.current.setLocalDescription(answer); send({ type: 'answer', sdp: answer }) }
      if (msg.type === 'answer' && peer.current) await peer.current.setRemoteDescription(msg.sdp)
      if (msg.type === 'ice' && peer.current && msg.candidate) try { await peer.current.addIceCandidate(msg.candidate) } catch {}
      if (msg.type === 'chat') setMessages(old => [...old, { mine: false, text: msg.message }])
      if (msg.type === 'notice') setMessages(old => [...old, { mine: false, text: msg.message }])
      if (msg.type === 'partner-left') { closePeer(); setStatus('left'); setSession(null); setPartnerUserId(null) }
    }
    socket.onclose = () => !cancelled && setStatus('offline')
    return () => { cancelled = true; socket.close(); closePeer() }
  }, [])

  const send = payload => ws.current?.readyState === WebSocket.OPEN && ws.current.send(JSON.stringify(payload))
  const ensurePeer = async () => peer.current || createPeer(false)
  const createPeer = async initiator => {
    closePeer()
    const pc = new RTCPeerConnection({ iceServers: iceServers.current })
    peer.current = pc
    stream.getTracks().forEach(track => pc.addTrack(track, stream))
    pc.ontrack = event => { if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0] }
    pc.onicecandidate = event => event.candidate && send({ type: 'ice', candidate: event.candidate })
    pc.onconnectionstatechange = () => { if (pc.connectionState === 'connected') setStatus('live'); if (['failed','disconnected'].includes(pc.connectionState)) setStatus('left') }
    if (initiator) { const offer = await pc.createOffer(); await pc.setLocalDescription(offer); send({ type: 'offer', sdp: offer }) }
    return pc
  }
  const closePeer = () => { if (peer.current) { peer.current.ontrack = null; peer.current.close(); peer.current = null } if (remoteVideo.current) remoteVideo.current.srcObject = null }
  const next = () => { closePeer(); setMessages([]); setStatus('waiting'); send({ type: 'next' }) }
  const end = () => { send({ type: 'leave' }); stream.getTracks().forEach(t => t.stop()); onExit() }
  const toggleAudio = () => { const enabled = muted; stream.getAudioTracks().forEach(t => t.enabled = enabled); setMuted(!muted); send({ type: 'media-state', audio: enabled, video: cameraOn }) }
  const toggleVideo = () => { const enabled = !cameraOn; stream.getVideoTracks().forEach(t => t.enabled = enabled); setCameraOn(enabled); send({ type: 'media-state', audio: !muted, video: enabled }) }
  const postMessage = e => { e.preventDefault(); const text = draft.trim().slice(0, 500); if (!text || status === 'waiting') return; send({ type: 'chat', message: text }); setMessages(old => [...old, { mine: true, text }]); setDraft('') }
  const block = async () => { if (!partnerUserId) return alert(user ? 'This guest cannot be permanently blocked.' : 'Sign in to block people permanently.'); try { await api('blocks/', { method: 'POST', body: JSON.stringify({ userId: partnerUserId }) }); next() } catch (e) { alert(e.message) } }
  const changeLayout = nextLayout => { setLayout(nextLayout); setSelfPosition(null); setSelfVisible(true) }
  const startDrag = e => {
    if (layout !== 'pip' || !videoStage.current) return
    const stage = videoStage.current.getBoundingClientRect(), tile = e.currentTarget.getBoundingClientRect()
    dragState.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, x: tile.left - stage.left, y: tile.top - stage.top, width: tile.width, height: tile.height }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const moveDrag = e => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId || !videoStage.current) return
    const stage = videoStage.current.getBoundingClientRect()
    setSelfPosition({ x: Math.max(8, Math.min(stage.width - drag.width - 8, drag.x + e.clientX - drag.startX)), y: Math.max(8, Math.min(stage.height - drag.height - 8, drag.y + e.clientY - drag.startY)) })
  }
  const stopDrag = e => { if (dragState.current?.pointerId === e.pointerId) dragState.current = null }

  return <div className="app-height page-enter flex flex-col overflow-hidden bg-ink">
    <header className="room-header flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:h-16 sm:px-5"><Logo compact/><div className="room-status flex min-w-0 items-center gap-2 text-xs text-zinc-400"><span className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-500 ${status === 'live' ? 'bg-lime' : 'bg-amber-400 animate-pulse'}`}/><span className="status-label truncate">{status === 'live' ? 'Connected' : status === 'waiting' ? 'Finding someone…' : status === 'left' ? 'Stranger left' : 'Connecting…'}</span></div><button onClick={end} className="spring-button text-sm text-zinc-400 hover:text-white">Leave</button></header>
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="video-shell relative flex min-h-0 flex-1 bg-zinc-950 p-1.5 sm:p-5">
        <div ref={videoStage} className="video-stage relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:rounded-3xl">
          <div className={`video-pane relative w-full overflow-hidden bg-zinc-900 ${layout === 'stacked' && selfVisible ? 'h-1/2 border-b border-white/10' : 'h-full'}`}>
            <video ref={remoteVideo} autoPlay playsInline className="h-full w-full object-cover"/>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold backdrop-blur">Stranger</span>
            {status !== 'live' && <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90"><div className="relative"><div className="h-20 w-20 animate-ping rounded-full border border-lime/30"/><div className="absolute inset-0 flex items-center justify-center"><UserRound className="text-lime" size={28}/></div></div><h3 className="display mt-6 text-xl font-semibold">{status === 'left' ? 'Your partner disconnected' : 'Looking for someone great'}</h3><p className="mt-2 text-sm text-zinc-500">{status === 'left' ? 'Tap Next when you’re ready.' : 'This usually takes just a moment.'}</p></div>}
            {session && <div className="absolute left-4 top-4 flex gap-2"><button onClick={() => setReporting(true)} className="rounded-full bg-black/40 p-2.5 text-zinc-300 backdrop-blur hover:text-red-300" title="Report"><Flag size={17}/></button><button onClick={block} className="rounded-full bg-black/40 p-2.5 text-zinc-300 backdrop-blur hover:text-red-300" title="Block"><Ban size={17}/></button></div>}
          </div>
          {selfVisible && layout === 'stacked' && <div className="self-panel panel-enter relative h-1/2 w-full overflow-hidden bg-zinc-800"><video ref={localVideo} autoPlay muted playsInline className="video-mirror h-full w-full object-cover"/>{!cameraOn && <div className="absolute inset-0 flex items-center justify-center bg-zinc-800"><CameraOff className="text-zinc-500"/></div>}<span className="absolute left-2 top-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3 sm:text-xs">You</span><button onClick={() => setSelfVisible(false)} className="spring-button absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70 sm:right-3 sm:top-3" title="Minimize my video"><Minus size={17}/></button></div>}
          {selfVisible && layout === 'pip' && <div onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} style={selfPosition ? { left: selfPosition.x, top: selfPosition.y, right: 'auto', touchAction: 'none' } : { touchAction: 'none' }} className={`self-tile panel-enter absolute z-20 h-24 w-32 cursor-grab overflow-hidden rounded-xl border-2 border-white/20 bg-zinc-800 shadow-2xl active:cursor-grabbing min-[390px]:h-28 min-[390px]:w-40 sm:h-36 sm:w-52 sm:rounded-2xl ${selfPosition ? '' : 'right-2 top-2 sm:right-4 sm:top-4'}`}><video ref={localVideo} autoPlay muted playsInline className="video-mirror pointer-events-none h-full w-full object-cover"/>{!cameraOn && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-800"><CameraOff className="text-zinc-500"/></div>}<div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-1.5 sm:p-2"><span className="flex items-center gap-1 text-[10px] font-semibold sm:text-[11px]"><Move size={12}/> Drag</span><button onPointerDown={e => e.stopPropagation()} onClick={() => setSelfVisible(false)} className="spring-button rounded-full bg-black/45 p-1.5 hover:bg-black/70" title="Minimize my video"><Minus size={13}/></button></div><span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold sm:bottom-2 sm:left-2 sm:text-[11px]">You</span></div>}
          {!selfVisible && <button onClick={() => setSelfVisible(true)} className="spring-button panel-enter absolute right-2 top-2 z-20 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[11px] font-semibold backdrop-blur hover:bg-black/75 sm:right-4 sm:top-4 sm:text-xs"><Maximize2 size={14}/> Show my video</button>}
          <div className="layout-picker absolute left-1/2 top-2 z-30 flex -translate-x-1/2 gap-1 rounded-full bg-black/50 p-1 backdrop-blur-md sm:top-4 sm:p-1.5"><button onClick={() => changeLayout('pip')} className={`spring-button rounded-full p-2 ${layout === 'pip' ? 'bg-white text-ink shadow-lg' : 'text-zinc-300 hover:bg-white/10'}`} title="Picture-in-picture view"><PictureInPicture2 size={15}/></button><button onClick={() => changeLayout('stacked')} className={`spring-button rounded-full p-2 ${layout === 'stacked' ? 'bg-white text-ink shadow-lg' : 'text-zinc-300 hover:bg-white/10'}`} title="Stacked view"><PanelsTopLeft size={15}/></button></div>
          <div className="call-dock absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 p-1.5 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:p-2">
            <Control onClick={toggleAudio} active={!muted} label={muted ? 'Unmute' : 'Mute'}>{muted ? <MicOff size={19}/> : <Mic size={19}/>}</Control>
            <Control onClick={toggleVideo} active={cameraOn} label={cameraOn ? 'Turn camera off' : 'Turn camera on'}>{cameraOn ? <Camera size={19}/> : <CameraOff size={19}/>}</Control>
            <button onClick={next} className="next-control spring-button flex h-11 shrink-0 items-center gap-1 rounded-full bg-lime px-3.5 font-bold text-ink hover:bg-[#c5fb60] min-[390px]:gap-2 min-[390px]:px-5 sm:h-12 sm:px-6"><span className="next-label">Next</span><ChevronRight size={18}/></button>
            <Control onClick={end} danger label="End chat"><X size={20}/></Control>
            <Control onClick={() => setChatOpen(x => !x)} active={chatOpen} label="Toggle chat"><MessageCircle size={19}/></Control>
          </div>
        </div>
      </section>
      {chatOpen && <><button aria-label="Close chat" onClick={() => setChatOpen(false)} className="sheet-backdrop fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"/><aside className="chat-sheet sheet-enter fixed inset-x-0 bottom-0 z-50 flex h-[min(54dvh,28rem)] shrink-0 flex-col rounded-t-[1.75rem] border-t border-white/10 bg-zinc-950 shadow-2xl lg:static lg:z-auto lg:h-auto lg:w-80 lg:rounded-none lg:border-l"><div className="mx-auto mt-2 h-1 w-10 rounded-full bg-zinc-700 lg:hidden"/><div className="flex items-start justify-between border-b border-white/10 px-5 pb-4 pt-3 lg:p-5"><div><h2 className="display font-semibold">Chat</h2><p className="mt-1 text-xs text-zinc-500">Messages disappear after this chat.</p></div><button onClick={() => setChatOpen(false)} className="spring-button rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden"><X size={18}/></button></div><div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.length === 0 && <p className="mt-8 text-center text-sm text-zinc-600">Say hello 👋</p>}{messages.map((m,i) => <div key={i} className={`message-enter flex ${m.mine ? 'justify-end' : ''}`}><span className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.mine ? 'bg-lime text-ink' : 'bg-zinc-800'}`}>{m.text}</span></div>)}</div><form onSubmit={postMessage} className="chat-form flex gap-2 border-t border-white/10 p-3"><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-3 text-base outline-none transition focus:border-lime/50 sm:text-sm"/><button className="spring-button rounded-xl bg-white px-4 py-2 text-sm font-bold text-ink">Send</button></form></aside></>}
    </div>
    {reporting && <ReportModal session={session} userId={partnerUserId} onClose={() => setReporting(false)} onDone={() => { setReporting(false); next() }}/>} 
  </div>
}

function ReportModal({ session, userId, onClose, onDone }) {
  const [reason, setReason] = useState('harassment'), [details, setDetails] = useState(''), [error, setError] = useState('')
  const submit = async () => { try { await api('reports/', { method: 'POST', body: JSON.stringify({ reason, details, sessionId: session, userId }) }); onDone() } catch (e) { setError(e.message) } }
  return <div className="sheet-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-5"><div className="dialog-enter my-auto w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="display text-xl font-semibold">Report this person</h2><button className="spring-button" onClick={onClose}><X className="text-zinc-500"/></button></div><p className="mt-2 text-sm text-zinc-400">Your report is private and helps keep Kutana safe.</p><select value={reason} onChange={e => setReason(e.target.value)} className="mt-6 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 outline-none">{['nudity','harassment','hate','spam','underage','other'].map(x => <option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)}</option>)}</select><textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Tell us what happened (optional)" className="mt-3 h-24 w-full resize-none rounded-xl border border-white/10 bg-zinc-950 p-3 outline-none"/>{error && <p className="mt-2 text-sm text-red-400">{error}</p>}<button onClick={submit} className="spring-button mt-4 w-full rounded-xl bg-red-500 py-3 font-semibold">Submit report & leave</button></div></div>
}

function AuthModal({ onClose, onSuccess }) {
  const [register, setRegister] = useState(false), [form, setForm] = useState({ username: '', email: '', password: '' }), [error, setError] = useState('')
  const submit = async e => { e.preventDefault(); try { const data = await api(register ? 'auth/register/' : 'auth/login/', { method: 'POST', body: JSON.stringify(form) }); onSuccess(data.user) } catch (e) { setError(e.message) } }
  return <div className="sheet-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-5"><form onSubmit={submit} className="dialog-enter my-auto w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8"><div className="flex items-center justify-between"><h2 className="display text-2xl font-semibold">{register ? 'Create account' : 'Welcome back'}</h2><button className="spring-button" type="button" onClick={onClose}><X className="text-zinc-500"/></button></div><p className="mt-2 text-sm text-zinc-400">{register ? 'Keep your block list across visits.' : 'Sign in to your Kutana account.'}</p><input required minLength={3} value={form.username} onChange={e => setForm({...form,username:e.target.value})} placeholder="Username" className="mt-6 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-base outline-none transition focus:border-lime/50"/>{register && <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="Email (optional)" className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-base outline-none transition focus:border-lime/50"/>}<input required minLength={8} type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Password" className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-base outline-none transition focus:border-lime/50"/>{error && <p className="mt-3 text-sm text-red-400">{error}</p>}<button className="spring-button mt-5 w-full rounded-xl bg-lime py-3 font-bold text-ink">{register ? 'Create account' : 'Sign in'}</button><button type="button" onClick={() => { setRegister(x => !x); setError('') }} className="spring-button mt-4 w-full text-sm text-zinc-400">{register ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></form></div>
}

export default function App() {
  const [screen, setScreen] = useState('home'), [stream, setStream] = useState(null), [error, setError] = useState(''), [user, setUser] = useState(null), [authOpen, setAuthOpen] = useState(false)
  useEffect(() => { api('auth/me/').then(x => setUser(x.user)).catch(() => {}) }, [])
  const allow = async () => { try { const media = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: { echoCancellation: true, noiseSuppression: true } }); setStream(media); setScreen('room') } catch { setError('Camera or microphone access was denied. Check your browser permissions and try again.') } }
  const home = () => { stream?.getTracks().forEach(t => t.stop()); setStream(null); setScreen('home') }
  return <>{screen === 'home' && <Landing onStart={() => setScreen('permission')} user={user} onAuth={() => setAuthOpen(true)} onLogout={() => api('auth/logout/', {method:'POST'}).then(() => setUser(null))}/>} {screen === 'permission' && <Permission onAllow={allow} onBack={() => setScreen('home')} error={error}/>} {screen === 'room' && stream && <Room stream={stream} onExit={home} user={user}/>} {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={u => { setUser(u); setAuthOpen(false) }}/>}</>
}
