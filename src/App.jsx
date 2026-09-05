import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Ban, Camera, CameraOff, ChevronRight, Code2, Columns2, Download, Flag, GraduationCap, Headphones, LockKeyhole, Mail, Maximize2, MessageCircle, Mic, MicOff, Minus, Move, PanelsTopLeft, Phone, PictureInPicture2, Share, ShieldCheck, SquarePlus, UserRound, Users, Video, X } from 'lucide-react'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const WS_BASE = (import.meta.env.VITE_WS_URL || '').replace(/\/$/, '')

const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}/${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

function Logo({ compact = false }) {
  return <div className="flex items-center gap-2.5"><img src="/kutana-mark.svg" alt="" className="h-10 w-10 shrink-0 rounded-xl shadow-[0_8px_25px_rgba(183,243,74,.15)] transition-transform duration-500 ease-spring"/><div className={compact ? 'room-logo-text' : ''}><span className="display block text-xl font-bold leading-none tracking-tight">kutana</span><span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[.16em] text-zinc-500 md:block">Bored ..?, Let chat</span></div></div>
}

function PageLink({ page, onNavigate, children, className = '' }) {
  return <a href={`/?page=${page}`} onClick={e => { e.preventDefault(); onNavigate(page) }} className={className}>{children}</a>
}

function Landing({ onStart, user, onAuth, onLogout, onNavigate }) {
  return <main className="relative min-h-screen overflow-hidden bg-ink grid-bg">
    <div className="glow pointer-events-none absolute left-1/2 top-10 h-[680px] w-[900px] -translate-x-1/2" />
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <Logo />
      <div className="flex items-center gap-3">{user ? <><span className="hidden text-sm text-zinc-400 sm:block">Hi, {user.username}</span><button onClick={onLogout} className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">Log out</button></> : <button onClick={onAuth} className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">Sign in</button>}</div>
    </nav>
    <section className="page-enter relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-12 text-center sm:px-6 sm:pt-20 md:pt-28">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-4 py-2 text-sm font-semibold text-lime"><span className="h-2 w-2 rounded-full bg-lime animate-pulse"/>Real people. Real conversations.</div>
      <h1 className="display max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-.055em] min-[390px]:text-5xl sm:text-7xl md:text-8xl">Every Stranger Has a Story. <span className="text-lime">Build your confidence.</span></h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">Meet someone new, somewhere in the world. No feeds, no followers—just one genuine conversation at a time.</p>
      <button onClick={onStart} className="spring-button group mt-10 flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-base font-bold text-ink shadow-[0_0_45px_rgba(183,243,74,.2)] hover:bg-[#c5fb60]">Start a conversation <ArrowRight size={19} className="transition-transform duration-500 ease-spring group-hover:translate-x-1"/></button>
      <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><ShieldCheck size={14}/> 18+ only · Be kind · Stay safe</p>
      <div className="mt-24 grid w-full gap-4 text-left md:grid-cols-3">
        {[['01','Instant connection','One click puts you face-to-face with someone new.'],['02','Private by design','Calls are peer-to-peer. We never record your conversations.'],['03','You’re in control','Skip, mute, block, or report whenever you need.']].map(([n,t,d]) => <div key={n} className="feature-card glass rounded-3xl p-7"><span className="text-xs font-bold text-lime">{n}</span><h3 className="display mt-8 text-xl font-semibold">{t}</h3><p className="mt-3 leading-6 text-zinc-400">{d}</p></div>)}
      </div>
    </section>
    <footer className="relative border-t border-white/5 px-5 py-7 text-xs text-zinc-500"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"><span>© 2026 Kutana</span><nav aria-label="Legal and company" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"><PageLink page="guidelines" onNavigate={onNavigate} className="footer-link">Community Guidelines</PageLink><PageLink page="privacy" onNavigate={onNavigate} className="footer-link">Privacy</PageLink><PageLink page="terms" onNavigate={onNavigate} className="footer-link">Terms</PageLink><PageLink page="developer" onNavigate={onNavigate} className="footer-link text-lime/80">Developed by Shaibu Hamis Mzogo</PageLink></nav></div></footer>
  </main>
}

function InfoSection({ title, children }) {
  return <section className="info-section"><h2 className="display text-xl font-semibold text-white sm:text-2xl">{title}</h2><div className="mt-3 space-y-3 leading-7 text-zinc-400">{children}</div></section>
}

function PageShell({ eyebrow, title, intro, onNavigate, children }) {
  return <main className="page-enter min-h-screen bg-ink grid-bg"><nav className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 px-5 py-4 backdrop-blur-xl sm:px-8"><div className="mx-auto flex max-w-5xl items-center justify-between"><button onClick={() => onNavigate('home')} className="spring-button text-left" aria-label="Go to Kutana home"><Logo/></button><button onClick={() => onNavigate('home')} className="spring-button flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"><ArrowLeft size={16}/> Home</button></div></nav><div className="mx-auto max-w-4xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20"><p className="text-xs font-bold uppercase tracking-[.22em] text-lime">{eyebrow}</p><h1 className="display mt-4 text-4xl font-semibold tracking-[-.045em] text-white sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">{intro}</p><div className="mt-12 space-y-5">{children}</div></div></main>
}

function GuidelinesPage({ onNavigate }) {
  return <PageShell eyebrow="Safety first" title="Community Guidelines" intro="Kutana is built for spontaneous, respectful conversations. These rules apply to every video call, message, profile, and account." onNavigate={onNavigate}>
    <InfoSection title="Adults only"><p>You must be at least 18 years old to use Kutana. Do not display, request, discuss, or distribute sexual content involving anyone under 18. Suspected child exploitation is prohibited and may be reported to the appropriate authorities.</p></InfoSection>
    <InfoSection title="Respect consent and boundaries"><p>Do not expose yourself, display unwanted sexual content, pressure another person, or continue behavior after they ask you to stop. A stranger can leave at any time and does not owe you a conversation.</p></InfoSection>
    <InfoSection title="Treat people with dignity"><p>Harassment, threats, stalking, bullying, hateful conduct, slurs, and targeted abuse are not allowed. Do not discriminate based on identity, nationality, disability, religion, gender, or sexual orientation.</p></InfoSection>
    <InfoSection title="Protect privacy"><p>Do not record, screenshot, publish, identify, or share another person without their clear permission. Never request passwords, financial credentials, home addresses, or other highly sensitive information.</p></InfoSection>
    <InfoSection title="No illegal or deceptive activity"><p>Do not use Kutana for scams, spam, impersonation, trafficking, exploitation, malware, illegal sales, graphic violence, or promotion of dangerous criminal behavior.</p></InfoSection>
    <InfoSection title="Reporting and enforcement"><p>Use the report and block controls when someone violates these rules. Reports may be reviewed by moderators. Kutana may restrict or terminate access, preserve relevant evidence, or contact authorities when reasonably necessary to protect people or comply with law.</p></InfoSection>
  </PageShell>
}

function PrivacyPage({ onNavigate }) {
  return <PageShell eyebrow="Effective September 5, 2026" title="Privacy Notice" intro="This notice explains what Kutana processes, why it is needed, and the choices available to you." onNavigate={onNavigate}>
    <InfoSection title="Information you provide"><p>If you create an account, we process your username, optional email address, and securely hashed password. When you submit a report, we store the selected reason, optional details, relevant session identifier, account references when available, status, and submission time.</p></InfoSection>
    <InfoSection title="Calls and messages"><p>Video and audio are transmitted through WebRTC directly between participants when possible. When direct connection is unavailable, encrypted media packets may pass through our TURN relay. Kutana does not record your calls. Text messages are relayed during the active conversation and are not intentionally stored as chat history.</p></InfoSection>
    <InfoSection title="Technical information"><p>Our infrastructure may process IP addresses, timestamps, browser and device details, connection metadata, security logs, cookies, and diagnostic events. Session cookies support sign-in, while connection records help operate and protect the service.</p></InfoSection>
    <InfoSection title="How information is used"><p>We use information to provide matching and communications, maintain accounts and block lists, investigate reports, prevent abuse, secure the platform, troubleshoot failures, and comply with legal obligations.</p></InfoSection>
    <InfoSection title="Service providers and disclosure"><p>Hosting, network, database, and content-delivery providers process limited information on our behalf. Information may also be disclosed when required by law, to investigate abuse, protect users, or complete a legitimate business transfer with appropriate safeguards.</p></InfoSection>
    <InfoSection title="Retention and your choices"><p>Ephemeral chat content is not retained as conversation history. Account, report, moderation, security, and backup records are kept only as long as reasonably needed for their purpose and applicable obligations. You can stop camera or microphone access in your browser, leave a conversation, or contact us about your account and personal information.</p></InfoSection>
    <InfoSection title="Contact"><p>Privacy questions and requests can be sent to <a className="text-lime hover:underline" href="mailto:bravomzogo@gmail.com">bravomzogo@gmail.com</a>. We may need to verify your identity before completing a request.</p></InfoSection>
  </PageShell>
}

function TermsPage({ onNavigate }) {
  return <PageShell eyebrow="Effective September 5, 2026" title="Terms of Use" intro="By accessing Kutana, you agree to these terms and the Community Guidelines. If you do not agree, do not use the service." onNavigate={onNavigate}>
    <InfoSection title="Eligibility"><p>You must be at least 18 years old and legally capable of accepting these terms. You are responsible for complying with the laws that apply where you live.</p></InfoSection>
    <InfoSection title="Your account"><p>You are responsible for your credentials and activity. Provide accurate information, keep your password confidential, and tell us if you suspect unauthorized access. We may suspend accounts that threaten users or the service.</p></InfoSection>
    <InfoSection title="Acceptable use"><p>You must follow the Community Guidelines. You may not exploit, interfere with, reverse engineer, overload, scrape, automate access to, or bypass safety and access controls protecting Kutana.</p></InfoSection>
    <InfoSection title="Your content"><p>You remain responsible for content you transmit. You confirm that you have the necessary rights to share it and grant Kutana the limited permission needed to transmit and moderate it solely for operating and protecting the service.</p></InfoSection>
    <InfoSection title="Service availability"><p>Random matching depends on available participants, networks, browsers, and third-party infrastructure. Kutana may change, interrupt, or discontinue features. The service is provided on an “as available” basis to the extent permitted by law.</p></InfoSection>
    <InfoSection title="Safety and interactions"><p>Online interactions carry risk. Do not share sensitive information or send money to strangers. Kutana cannot guarantee another participant’s identity, statements, intentions, or conduct. Use Skip, Block, and Report whenever a conversation feels unsafe.</p></InfoSection>
    <InfoSection title="Enforcement and changes"><p>We may investigate violations and restrict access when reasonably necessary. These terms may be updated as the service evolves. Material changes will be identified by a revised effective date.</p></InfoSection>
    <InfoSection title="Contact"><p>Questions about these terms can be sent to <a className="text-lime hover:underline" href="mailto:bravomzogo@gmail.com">bravomzogo@gmail.com</a>.</p></InfoSection>
  </PageShell>
}

function DeveloperPage({ onNavigate }) {
  return <PageShell eyebrow="Meet the developer" title="Built with care in Tanzania." intro="Kutana was designed and engineered to make spontaneous online conversations feel simpler, safer, and more human." onNavigate={onNavigate}>
    <section className="developer-card glass overflow-hidden rounded-[2rem] p-3 sm:p-5"><div className="grid items-center gap-7 md:grid-cols-[.85fr_1.15fr]"><img src="/shaibu-hamis-mzogo.jpeg" alt="Shaibu Hamis Mzogo" className="aspect-square h-full w-full rounded-[1.4rem] object-cover object-center grayscale-[.15]"/><div className="p-3 sm:p-5"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/10 text-lime"><Code2 size={23}/></div><h2 className="display mt-6 text-3xl font-semibold tracking-tight text-white">Shaibu Hamis Mzogo</h2><p className="mt-3 flex items-center gap-2 text-zinc-400"><GraduationCap size={18} className="text-lime"/> Software Engineering Graduate</p><div className="mt-8 grid gap-3"><a href="tel:+255782728021" className="contact-link"><Phone size={18}/> <span><small>Call or WhatsApp</small>+255 782 728 021</span><ArrowRight size={17} className="ml-auto"/></a><a href="mailto:bravomzogo@gmail.com" className="contact-link"><Mail size={18}/> <span><small>Email</small>bravomzogo@gmail.com</span><ArrowRight size={17} className="ml-auto"/></a></div></div></div></section>
  </PageShell>
}

function Permission({ onAllow, onBack, error }) {
  return <div className="app-height flex items-center justify-center overflow-y-auto bg-ink px-4 py-6 grid-bg sm:px-6"><div className="dialog-enter glass w-full max-w-md rounded-[1.75rem] p-6 text-center shadow-2xl sm:rounded-[2rem] sm:p-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/10 text-lime"><Video size={28}/></div><h2 className="display mt-6 text-3xl font-semibold tracking-tight">Ready to say hello?</h2><p className="mt-3 leading-7 text-zinc-400">We need camera and microphone access so the other person can see and hear you.</p><div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-left text-xs leading-5 text-zinc-400"><Headphones size={18} className="mt-0.5 shrink-0 text-lime"/><span>Use headphones when two devices are nearby to prevent speaker-to-microphone feedback.</span></div>{error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button onClick={onAllow} className="spring-button mt-7 w-full rounded-xl bg-lime py-3.5 font-bold text-ink hover:bg-[#c5fb60]">Allow camera & microphone</button><button onClick={onBack} className="spring-button mt-3 text-sm text-zinc-500 hover:text-white">Go back</button><div className="mt-7 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-xs text-zinc-500"><LockKeyhole size={14}/> Your call is not recorded</div></div></div>
}

function Control({ onClick, active = true, danger = false, children, label }) {
  return <button title={label} aria-label={label} onClick={onClick} className={`call-control spring-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:h-12 sm:w-12 ${danger ? 'border-red-400/20 bg-red-500 text-white hover:bg-red-400' : active ? 'border-white/10 bg-zinc-800 text-white hover:bg-zinc-700' : 'border-white/10 bg-white text-ink'}`}>{children}</button>
}

function Room({ stream, onExit, user }) {
  const localVideo = useRef(null), remoteVideo = useRef(null), videoStage = useRef(null), ws = useRef(null), peer = useRef(null), dragState = useRef(null)
  const [status, setStatus] = useState('connecting'), [muted, setMuted] = useState(false), [cameraOn, setCameraOn] = useState(true)
  const [waitingCount, setWaitingCount] = useState(0)
  const [messages, setMessages] = useState([]), [draft, setDraft] = useState(''), [chatOpen, setChatOpen] = useState(() => window.innerWidth >= 1024)
  const [session, setSession] = useState(null), [partnerUserId, setPartnerUserId] = useState(null), [reporting, setReporting] = useState(false)
  const [layout, setLayout] = useState('pip'), [selfVisible, setSelfVisible] = useState(true), [selfPosition, setSelfPosition] = useState(null)
  const iceServers = useRef([{ urls: 'stun:stun.l.google.com:19302' }])

  useEffect(() => { if (localVideo.current) localVideo.current.srcObject = stream }, [stream, layout, selfVisible])
  useEffect(() => {
    const compactLandscape = window.matchMedia('(orientation: landscape) and (max-height: 620px)')
    const adaptLayout = () => {
      if (compactLandscape.matches) {
        setLayout('side')
        setSelfVisible(true)
        setSelfPosition(null)
      } else {
        setLayout(current => current === 'side' && window.innerWidth < 1024 ? 'pip' : current)
      }
    }
    adaptLayout()
    compactLandscape.addEventListener?.('change', adaptLayout)
    return () => compactLandscape.removeEventListener?.('change', adaptLayout)
  }, [])
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
      if (msg.type === 'queue-count') setWaitingCount(Number(msg.count) || 0)
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
    <header className="room-header flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:h-16 sm:px-5"><Logo compact/><div className="room-presence flex min-w-0 items-center gap-2"><div className="room-status flex min-w-0 items-center gap-2 text-xs text-zinc-400"><span className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-500 ${status === 'live' ? 'bg-lime' : 'bg-amber-400 animate-pulse'}`}/><span className="status-label truncate">{status === 'live' ? 'Connected' : status === 'waiting' ? 'Finding someone…' : status === 'left' ? 'Stranger left' : 'Connecting…'}</span></div><div className="queue-count flex shrink-0 items-center gap-1.5 rounded-full border border-lime/15 bg-lime/10 px-2.5 py-1.5 text-[11px] font-bold text-lime sm:px-3 sm:text-xs"><Users size={14}/><span className="queue-short sm:hidden">{waitingCount} waiting</span><span className="queue-long hidden sm:inline">{waitingCount} finding a match</span></div></div><button onClick={end} className="spring-button text-sm text-zinc-400 hover:text-white">Leave</button></header>
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="video-shell relative flex min-h-0 flex-1 bg-zinc-950 p-1.5 sm:p-5">
        <div ref={videoStage} className={`video-stage relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:rounded-3xl ${layout === 'side' && selfVisible ? 'flex' : 'block'}`}>
          <div className={`video-pane relative overflow-hidden bg-zinc-900 ${layout === 'side' && selfVisible ? 'h-full w-1/2 border-r border-white/10' : layout === 'stacked' && selfVisible ? 'h-1/2 w-full border-b border-white/10' : 'h-full w-full'}`}>
            <video ref={remoteVideo} autoPlay playsInline className="h-full w-full object-cover"/>
            <span className="remote-label absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:text-xs">Stranger</span>
            {status !== 'live' && <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 px-4 text-center"><div className="relative"><div className="h-16 w-16 animate-ping rounded-full border border-lime/30 sm:h-20 sm:w-20"/><div className="absolute inset-0 flex items-center justify-center"><UserRound className="text-lime" size={28}/></div></div><h3 className="display mt-4 text-lg font-semibold sm:mt-6 sm:text-xl">{status === 'left' ? 'Your partner disconnected' : 'Looking for someone great'}</h3><p className="mt-2 text-xs text-zinc-500 sm:text-sm">{status === 'left' ? 'Tap Skip when you’re ready.' : 'This usually takes just a moment.'}</p></div>}
            {session && <div className="safety-actions absolute left-2 top-11 flex gap-1.5 sm:left-3 sm:top-14 sm:gap-2"><button onClick={() => setReporting(true)} className="spring-button rounded-full bg-black/45 p-2 text-zinc-300 backdrop-blur hover:text-red-300 sm:p-2.5" title="Report"><Flag size={16}/></button><button onClick={block} className="spring-button rounded-full bg-black/45 p-2 text-zinc-300 backdrop-blur hover:text-red-300 sm:p-2.5" title="Block"><Ban size={16}/></button></div>}
          </div>
          {selfVisible && (layout === 'stacked' || layout === 'side') && <div className={`self-panel panel-enter relative overflow-hidden bg-zinc-800 ${layout === 'side' ? 'h-full w-1/2' : 'h-1/2 w-full'}`}><video ref={localVideo} autoPlay muted playsInline className="video-mirror h-full w-full object-cover"/>{!cameraOn && <div className="absolute inset-0 flex items-center justify-center bg-zinc-800"><CameraOff className="text-zinc-500"/></div>}<span className="absolute left-2 top-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3 sm:text-xs">You</span><button onClick={() => setSelfVisible(false)} className="spring-button absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70 sm:right-3 sm:top-3" title="Minimize my video"><Minus size={17}/></button></div>}
          {selfVisible && layout === 'pip' && <div onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} style={selfPosition ? { left: selfPosition.x, top: selfPosition.y, right: 'auto', touchAction: 'none' } : { touchAction: 'none' }} className={`self-tile panel-enter absolute z-20 h-24 w-32 cursor-grab overflow-hidden rounded-xl border-2 border-white/20 bg-zinc-800 shadow-2xl active:cursor-grabbing min-[390px]:h-28 min-[390px]:w-40 sm:h-36 sm:w-52 sm:rounded-2xl ${selfPosition ? '' : 'right-2 top-2 sm:right-4 sm:top-4'}`}><video ref={localVideo} autoPlay muted playsInline className="video-mirror pointer-events-none h-full w-full object-cover"/>{!cameraOn && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-800"><CameraOff className="text-zinc-500"/></div>}<div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-1.5 sm:p-2"><span className="flex items-center gap-1 text-[10px] font-semibold sm:text-[11px]"><Move size={12}/> Drag</span><button onPointerDown={e => e.stopPropagation()} onClick={() => setSelfVisible(false)} className="spring-button rounded-full bg-black/45 p-1.5 hover:bg-black/70" title="Minimize my video"><Minus size={13}/></button></div><span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold sm:bottom-2 sm:left-2 sm:text-[11px]">You</span></div>}
          {!selfVisible && <button onClick={() => setSelfVisible(true)} className="spring-button panel-enter absolute right-2 top-2 z-20 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[11px] font-semibold backdrop-blur hover:bg-black/75 sm:right-4 sm:top-4 sm:text-xs"><Maximize2 size={14}/> Show my video</button>}
          <div className="layout-picker absolute left-1/2 top-2 z-30 flex -translate-x-1/2 gap-1 rounded-full bg-black/50 p-1 backdrop-blur-md sm:top-4 sm:p-1.5"><button onClick={() => changeLayout('pip')} className={`spring-button rounded-full p-2 ${layout === 'pip' ? 'bg-white text-ink shadow-lg' : 'text-zinc-300 hover:bg-white/10'}`} title="Picture-in-picture view"><PictureInPicture2 size={15}/></button><button onClick={() => changeLayout('stacked')} className={`spring-button rounded-full p-2 ${layout === 'stacked' ? 'bg-white text-ink shadow-lg' : 'text-zinc-300 hover:bg-white/10'}`} title="Stacked view"><PanelsTopLeft size={15}/></button><button onClick={() => changeLayout('side')} className={`side-layout-button spring-button hidden rounded-full p-2 lg:block ${layout === 'side' ? 'bg-white text-ink shadow-lg' : 'text-zinc-300 hover:bg-white/10'}`} title="Side-by-side view"><Columns2 size={15}/></button></div>
          <div className="call-dock absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 p-1.5 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:p-2">
            <Control onClick={toggleAudio} active={!muted} label={muted ? 'Unmute' : 'Mute'}>{muted ? <MicOff size={19}/> : <Mic size={19}/>}</Control>
            <Control onClick={toggleVideo} active={cameraOn} label={cameraOn ? 'Turn camera off' : 'Turn camera on'}>{cameraOn ? <Camera size={19}/> : <CameraOff size={19}/>}</Control>
            <button onClick={next} className="next-control spring-button flex h-11 shrink-0 items-center gap-1 rounded-full bg-lime px-3 font-bold text-ink hover:bg-[#c5fb60] min-[390px]:gap-2 min-[390px]:px-5 sm:h-12 sm:px-6"><span className="next-label">Skip</span><ChevronRight size={18}/></button>
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

function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null), [visible, setVisible] = useState(false), [ios, setIos] = useState(false)

  useEffect(() => {
    const installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (installed || sessionStorage.getItem('kutana-install-dismissed')) return
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIos(isIos)
    const capturePrompt = event => { event.preventDefault(); setInstallEvent(event); setVisible(true) }
    window.addEventListener('beforeinstallprompt', capturePrompt)
    const timer = isIos ? window.setTimeout(() => setVisible(true), 1200) : null
    return () => { window.removeEventListener('beforeinstallprompt', capturePrompt); if (timer) clearTimeout(timer) }
  }, [])

  const dismiss = () => { sessionStorage.setItem('kutana-install-dismissed', '1'); setVisible(false) }
  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    setInstallEvent(null)
    if (choice.outcome === 'accepted') setVisible(false)
  }

  if (!visible) return null
  return <div className="install-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center sm:p-5"><section role="dialog" aria-modal="true" aria-labelledby="install-title" className="install-card sheet-enter relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 p-6 shadow-[0_30px_100px_rgba(0,0,0,.6)] sm:dialog-enter sm:rounded-[2rem] sm:p-7"><button onClick={dismiss} className="spring-button absolute right-4 top-4 rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Not now"><X size={18}/></button><div className="flex items-center gap-4"><img src="/kutana-mark.svg" alt="" className="h-16 w-16 rounded-2xl shadow-[0_10px_35px_rgba(183,243,74,.2)]"/><div><p className="text-xs font-bold uppercase tracking-[.18em] text-lime">Take Kutana with you</p><h2 id="install-title" className="display mt-1 text-2xl font-semibold">Install the app</h2></div></div>{ios ? <><p className="mt-5 leading-7 text-zinc-400">Install Kutana from Safari for quick, full-screen access.</p><ol className="mt-5 space-y-3"><li className="install-step"><Share size={19}/><span>Tap the <strong>Share</strong> button in Safari.</span></li><li className="install-step"><SquarePlus size={19}/><span>Select <strong>Add to Home Screen</strong>.</span></li></ol><button onClick={dismiss} className="spring-button mt-6 w-full rounded-xl bg-lime py-3.5 font-bold text-ink">Got it</button></> : <><p className="mt-5 leading-7 text-zinc-400">Add Kutana to your home screen for faster access and an app-like, full-screen experience.</p><div className="mt-6 grid grid-cols-[auto_1fr] gap-3"><button onClick={dismiss} className="spring-button rounded-xl border border-white/10 px-5 py-3.5 font-semibold text-zinc-300 hover:bg-white/5">Not now</button><button onClick={install} className="spring-button flex items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3.5 font-bold text-ink"><Download size={18}/> Install Kutana</button></div></>}</section></div>
}

async function getOptimizedCallMedia() {
  const supported = navigator.mediaDevices.getSupportedConstraints?.() || {}
  const audio = {}
  if (supported.echoCancellation) audio.echoCancellation = { ideal: true }
  if (supported.noiseSuppression) audio.noiseSuppression = { ideal: true }
  if (supported.autoGainControl) audio.autoGainControl = { ideal: true }
  if (supported.voiceIsolation) audio.voiceIsolation = { ideal: true }
  if (supported.channelCount) audio.channelCount = { ideal: 1 }
  if (supported.sampleRate) audio.sampleRate = { ideal: 48000 }
  if (supported.sampleSize) audio.sampleSize = { ideal: 16 }
  if (supported.latency) audio.latency = { ideal: 0.02 }

  const media = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 }, facingMode: { ideal: 'user' } },
    audio
  })
  const microphone = media.getAudioTracks()[0]
  if (microphone) microphone.contentHint = 'speech'
  return media
}

export default function App() {
  const validPages = ['home', 'guidelines', 'privacy', 'terms', 'developer']
  const requestedPage = new URLSearchParams(window.location.search).get('page') || 'home'
  const [page, setPage] = useState(validPages.includes(requestedPage) ? requestedPage : 'home')
  const [screen, setScreen] = useState('home'), [stream, setStream] = useState(null), [error, setError] = useState(''), [user, setUser] = useState(null), [authOpen, setAuthOpen] = useState(false)
  useEffect(() => { api('auth/me/').then(x => setUser(x.user)).catch(() => {}) }, [])
  useEffect(() => {
    const syncPage = () => { const next = new URLSearchParams(window.location.search).get('page') || 'home'; setPage(validPages.includes(next) ? next : 'home') }
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])
  useEffect(() => { const names = { home: 'Meet someone new', guidelines: 'Community Guidelines', privacy: 'Privacy Notice', terms: 'Terms of Use', developer: 'Developer' }; document.title = `${names[page]} — Kutana` }, [page])
  const allow = async () => { try { const media = await getOptimizedCallMedia(); setStream(media); setScreen('room') } catch { setError('Camera or microphone access was denied. Check your browser permissions and try again.') } }
  const home = () => { stream?.getTracks().forEach(t => t.stop()); setStream(null); setScreen('home') }
  const navigatePage = next => { window.history.pushState({}, '', next === 'home' ? '/' : `/?page=${next}`); setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  if (page === 'guidelines') return <GuidelinesPage onNavigate={navigatePage}/>
  if (page === 'privacy') return <PrivacyPage onNavigate={navigatePage}/>
  if (page === 'terms') return <TermsPage onNavigate={navigatePage}/>
  if (page === 'developer') return <DeveloperPage onNavigate={navigatePage}/>
  return <>{screen === 'home' && <Landing onStart={() => setScreen('permission')} user={user} onAuth={() => setAuthOpen(true)} onLogout={() => api('auth/logout/', {method:'POST'}).then(() => setUser(null))} onNavigate={navigatePage}/>} {screen === 'permission' && <Permission onAllow={allow} onBack={() => setScreen('home')} error={error}/>} {screen === 'room' && stream && <Room stream={stream} onExit={home} user={user}/>} {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={u => { setUser(u); setAuthOpen(false) }}/>} {screen === 'home' && <InstallPrompt/>}</>
}
