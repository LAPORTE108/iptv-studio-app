import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Search, Tv, AlertCircle, X, Star, 
  Grid, PictureInPicture, Layers, Headphones, 
  Volume2, VolumeX, Home, SplitSquareHorizontal, 
  FileUp, Download, Moon, Info, Disc, History, 
  ArrowLeft, Calendar, UserPlus, Settings, 
  Plus, RefreshCw, ExternalLink, Lock,
  Edit2, Trash2, Check, Camera
} from 'lucide-react';

// --- ESTILOS PREMIUM "CLEAN CINEMA" ---
const SafeStyles = ({ accentColor }) => (
  <style>{`
    :root { 
      --bg-deep: #030303; 
      --bg-panel: rgba(20, 20, 25, 0.6); 
      --bg-card: rgba(255, 255, 255, 0.03); 
      --accent: ${accentColor}; 
      --text-main: #ffffff; 
      --text-muted: #9ca3af; 
      --border-glass: rgba(255,255,255,0.08);
    }
    
    * { box-sizing: border-box; outline: none; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; background-color: var(--bg-deep); color: var(--text-main); font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; }

    /* Scrollbar Sutil */
    *::-webkit-scrollbar { width: 6px; height: 6px; }
    *::-webkit-scrollbar-track { background: transparent; }
    *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    *::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* Animaciones */
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(var(--accent), 0.4); } 70% { box-shadow: 0 0 0 10px rgba(var(--accent), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--accent), 0); } }

    /* Layout */
    .app-container { display: flex; height: 100vh; width: 100vw; background: radial-gradient(circle at top right, #1a1a2e 0%, var(--bg-deep) 60%); }
    
    /* Sidebar Flotante */
    .sidebar { 
        width: 80px; 
        background: rgba(10, 10, 10, 0.8); 
        backdrop-filter: blur(20px); 
        border-right: 1px solid var(--border-glass); 
        display: flex; flex-direction: column; align-items: center; 
        padding: 40px 0; z-index: 50; 
    }
    .nav-btn { 
        width: 46px; height: 46px; border-radius: 14px; border: none; background: transparent; 
        color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; 
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); margin-bottom: 16px;
    }
    .nav-btn:hover { background: rgba(255,255,255,0.08); color: white; transform: translateY(-2px); }
    .nav-btn.active { background: var(--accent); color: white; box-shadow: 0 10px 25px -5px var(--accent); }

    /* Área Principal */
    .content-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
    
    /* Barra Superior Transparente */
    .top-bar { 
        height: 90px; padding: 0 50px; display: flex; align-items: center; justify-content: space-between; 
        background: linear-gradient(to bottom, var(--bg-deep) 0%, transparent 100%);
        position: absolute; top: 0; left: 0; right: 0; z-index: 20; pointer-events: none;
    }
    .top-bar > * { pointer-events: auto; }
    
    .search-box { 
        display: flex; align-items: center; background: rgba(255,255,255,0.05); 
        padding: 14px 24px; border-radius: 40px; width: 450px; 
        border: 1px solid var(--border-glass); backdrop-filter: blur(10px);
        transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .search-box:focus-within { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); width: 500px; box-shadow: 0 15px 40px rgba(0,0,0,0.4); }
    .search-input { background: transparent; border: none; color: white; margin-left: 12px; width: 100%; font-size: 1rem; font-weight: 500; }

    /* Grid de Canales - Clean Look */
    .grid-view { 
        padding: 110px 50px 50px; overflow-y: auto; flex: 1; 
        display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px;
        align-content: flex-start; animation: slideUp 0.5s ease-out;
    }
    .channel-card { 
        background: var(--bg-card); border-radius: 18px; overflow: hidden; 
        position: relative; aspect-ratio: 16/9; cursor: pointer; 
        border: 1px solid var(--border-glass); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .channel-card:hover { 
        transform: translateY(-8px) scale(1.02); 
        border-color: rgba(255,255,255,0.3); 
        box-shadow: 0 20px 50px -10px rgba(0,0,0,0.6); 
        z-index: 10; 
    }
    .card-image { 
        height: 100%; width: 100%; padding: 25px; display: flex; align-items: center; justify-content: center; 
        background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
        transition: 0.4s;
    }
    .channel-card:hover .card-image { opacity: 0.4; }
    .card-image img { max-width: 80%; max-height: 80%; object-fit: contain; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); }
    
    /* Info Overlay en Hover */
    .card-overlay { 
        position: absolute; inset: 0; 
        background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); 
        opacity: 0; transition: 0.3s ease; 
        display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;
    }
    .channel-card:hover .card-overlay { opacity: 1; }
    .play-icon-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); opacity: 0; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: var(--accent); color: white; padding: 15px; border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .channel-card:hover .play-icon-overlay { opacity: 1; transform: translate(-50%, -50%) scale(1); }

    /* Player */
    .fullscreen-player { position: absolute; inset: 0; background: black; z-index: 100; display: flex; animation: fadeIn 0.3s; }
    .video-wrapper { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #000; }
    video { width: 100%; height: 100%; }
    
    /* Video Controls */
    .video-controls { 
        position: absolute; bottom: 20px; left: 20px; right: 20px; padding: 15px 25px; 
        background: rgba(20, 20, 25, 0.85); backdrop-filter: blur(16px); border-radius: 24px; 
        border: 1px solid var(--border-glass);
        opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateY(10px);
        display: flex; align-items: center; gap: 20px; pointer-events: none; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .video-container:hover .video-controls { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .video-controls > * { pointer-events: auto; }
    
    /* Stats Overlay */
    .stats-overlay { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); color: #00ff00; font-family: monospace; font-size: 0.8rem; z-index: 30; pointer-events: none; backdrop-filter: blur(4px); }

    /* Guía EPG - Estilo Tabla */
    .epg-view { padding-top: 90px; height: 100vh; overflow: auto; display: flex; flex-direction: column; background: var(--bg-deep); }
    .epg-header { display: flex; position: sticky; top: 0; z-index: 20; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-glass); }
    .epg-corner { min-width: 250px; border-right: 1px solid var(--border-glass); padding: 20px; font-weight: bold; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    .epg-times { display: flex; flex: 1; }
    .epg-time-cell { min-width: 200px; padding: 20px; color: var(--text-muted); font-size: 0.9rem; border-right: 1px solid var(--border-glass); text-align: center; font-variant-numeric: tabular-nums; }
    
    .epg-body { flex: 1; }
    .epg-row { display: flex; border-bottom: 1px solid var(--border-glass); height: 80px; transition: background 0.2s; }
    .epg-row:hover { background: rgba(255,255,255,0.02); }
    .epg-channel-col { 
        min-width: 250px; padding: 0 25px; display: flex; align-items: center; gap: 15px; 
        background: rgba(10,10,10,0.4); border-right: 1px solid var(--border-glass); 
        position: sticky; left: 0; z-index: 10; backdrop-filter: blur(5px);
    }
    .epg-programs { display: flex; flex: 1; }
    .epg-program-item { 
        min-width: 400px; padding: 0 20px; display: flex; align-items: center; 
        border-right: 1px solid var(--border-glass); color: #bbb; font-size: 0.9rem; 
        cursor: pointer; position: relative; overflow: hidden;
    }
    .epg-program-item:hover { background: rgba(255,255,255,0.05); color: white; }
    .epg-program-item::before { content: ''; position: absolute; left: 0; top: 15%; bottom: 15%; width: 2px; background: var(--accent); opacity: 0; transition: 0.2s; }
    .epg-program-item:hover::before { opacity: 1; }

    /* Perfiles */
    .profile-screen { 
        height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; 
        background: #030303;
    }
    .avatar-container { position: relative; transition: 0.3s; border-radius: 40px; padding: 4px; border: 2px solid transparent; }
    .profile-card:hover .avatar-container { border-color: var(--accent); transform: scale(1.05); background: linear-gradient(135deg, var(--accent), transparent); }
    .profile-img { width: 140px; height: 140px; border-radius: 36px; object-fit: cover; background: #111; }

    /* Edit Overlay */
    .edit-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); border-radius: 36px; display: flex; alignItems: center; justifyContent: center; opacity: 0; transition: 0.3s; }
    .profile-card:hover .edit-overlay { opacity: 1; }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 200; display: flex; alignItems: center; justify-content: center; animation: fadeIn 0.2s; }
    .modal-content { background: #121212; border-radius: 28px; padding: 40px; width: 500px; max-width: 90%; border: 1px solid var(--border-glass); box-shadow: 0 40px 80px rgba(0,0,0,0.6); max-height: 85vh; overflow-y: auto; }
    .modal-btn { width: 100%; background: var(--accent); border: none; padding: 14px; border-radius: 16px; color: white; font-weight: 700; margin-top: 20px; cursor: pointer; transition: 0.2s; font-size: 1rem; }
    .modal-btn:hover { filter: brightness(1.1); transform: scale(1.02); }

    /* Avatar Selection Grid */
    .avatar-grid { display: flex; gap: 15px; overflow-x: auto; padding: 15px 5px; margin-bottom: 20px; justify-content: flex-start; }
    .avatar-grid::-webkit-scrollbar { height: 6px; }
    .avatar-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    .avatar-option { width: 70px; height: 70px; min-width: 70px; border-radius: 20px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; object-fit: cover; background: #222; }
    .avatar-option:hover { transform: scale(1.1); }
    .avatar-option.selected { border-color: var(--accent); box-shadow: 0 0 15px rgba(var(--accent), 0.5); }

    /* Toasts */
    .toast-container { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .toast { background: rgba(30, 30, 35, 0.9); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeIn 0.3s; font-size: 0.9rem; }
  `}</style>
);

// --- 1. LÓGICA VIDEO (ROBUSTA) ---
const useHls = (src, videoRef, onError, onLoading, onStats) => {
  const hlsRef = useRef(null);
  useEffect(() => {
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.0/hls.min.js";
      script.async = true;
      script.onload = () => init();
      document.body.appendChild(script);
    } else init();

    function init() {
      const video = videoRef.current;
      if(!video || !src) return;
      if(onLoading) onLoading(true);
      if(hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

      const safePlay = () => {
          if(onLoading) onLoading(false);
          const p = video.play();
          if(p !== undefined) p.catch(()=>{});
      };

      if(window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
              enableWorker:true, 
              lowLatencyMode:true,
              manifestLoadingTimeOut: 15000, 
              manifestLoadingMaxRetry: 3 
          });
          hlsRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, (e,d) => { 
              if(d.fatal) { 
                  switch(d.type) {
                      case window.Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
                      case window.Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
                      default: hls.destroy(); if(onError) onError("Stream crítico"); break;
                  }
              } 
          });
          
          hls.on(window.Hls.Events.FRAG_LOADED, (e, data) => {
            if(onStats && hls.levels && hls.loadLevel !== -1) {
                const level = hls.levels[hls.loadLevel];
                onStats({
                    res: level ? `${level.width}x${level.height}` : 'Auto',
                    bitrate: level ? `${(level.bitrate/1000).toFixed(0)} kbps` : 'Auto',
                    buffer: video.buffered.length > 0 ? `${(video.buffered.end(video.buffered.length-1) - video.currentTime).toFixed(1)}s` : '0s'
                });
            }
        });

          hls.on(window.Hls.Events.MANIFEST_PARSED, safePlay);
      } else if(video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', safePlay);
          video.addEventListener('error', () => { if(onError) onError("Error nativo"); });
      }
    }
    
    return () => { 
        if(hlsRef.current) hlsRef.current.destroy(); 
        if(videoRef.current) { videoRef.current.removeAttribute('src'); videoRef.current.load(); }
    };
  }, [src]);
};

const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };

const defaultAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Gamer',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Geek',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Chill',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Explore',
  'https://api.dicebear.com/7.x/big-ears/svg?seed=Cute',
  'https://api.dicebear.com/7.x/micah/svg?seed=Art',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Work',
  'https://api.dicebear.com/7.x/open-peeps/svg?seed=Cool',
  'https://api.dicebear.com/7.x/personas/svg?seed=Bald',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Like',
  'https://api.dicebear.com/7.x/croodles/svg?seed=Abstract'
];

// --- 2. COMPONENTES ---

const ToastSystem = ({ toasts }) => (
    <div className="toast-container">
        {toasts.map(t => (
            <div key={t.id} className="toast">
                {typeof t.msg === 'string' ? t.msg : 'Notificación'}
            </div>
        ))}
    </div>
);

const VideoPlayer = ({ channel, onClose, isMuted, onToggleMute, addToast }) => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState({ res: '-', bitrate: '-', buffer: '-' });
    const [sleepTimer, setSleepTimer] = useState(null);
    const [audioOnly, setAudioOnly] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    useEffect(() => { 
        setErrorMsg(null); setIsLoading(true); setStats({res:'-',bitrate:'-',buffer:'-'}); setIsRecording(false);
    }, [channel]);

    useEffect(() => {
        if(!sleepTimer) return;
        const timer = setTimeout(() => { if(onClose) onClose(); else window.location.reload(); }, sleepTimer * 60000);
        return () => clearTimeout(timer);
    }, [sleepTimer]);

    useHls(channel?.url, videoRef, 
        (msg) => { setErrorMsg(msg); setIsLoading(false); }, 
        (loading) => setIsLoading(loading),
        (newStats) => setStats(newStats)
    );

    const startRecording = () => {
        const video = videoRef.current;
        if (!video) return;
        let stream = video.captureStream ? video.captureStream() : video.mozCaptureStream ? video.mozCaptureStream() : null;
        if (!stream) { if(addToast) addToast("Navegador no soporta grabación"); return; }

        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `rec-${channel.name}-${Date.now()}.webm`; a.click();
            if(addToast) addToast("Grabación guardada");
        };
        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        if(addToast) addToast("Grabación iniciada");
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); }
    };

    if (!channel) return <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#555'}}><Tv size={60} style={{opacity:0.2, marginBottom:20}}/><p>Selecciona un canal</p></div>;

    return (
        <div className="video-container" style={{backgroundColor: audioOnly ? '#000' : 'black'}}>
            {isRecording && <div style={{position:'absolute', top:20, left:20, background:'rgba(220,38,38,0.8)', color:'white', padding:'5px 15px', borderRadius:20, display:'flex', alignItems:'center', gap:8, fontWeight:'bold', fontSize:'0.8rem', zIndex:30, boxShadow:'0 0 20px rgba(220,38,38,0.5)'}}><div style={{width:8, height:8, borderRadius:'50%', background:'white'}}></div> REC</div>}
            {audioOnly && (
                <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:5, background:'#0a0c10'}}>
                    <div style={{width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--border-glass)'}}>
                        <div style={{width:80, height:80, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 60px var(--accent)', animation:'pulse-glow 2s infinite'}}>
                            <Headphones size={40} color="white"/>
                        </div>
                    </div>
                    <h2 style={{marginTop:40, color:'white', fontWeight:'200', fontSize:'1.5rem'}}>{channel.name}</h2>
                    <p style={{color:'var(--text-muted)', marginTop:10}}>Modo Audio</p>
                </div>
            )}
            {showStats && (
                <div className="stats-overlay">
                    <div>RES: <span style={{color:'white'}}>{stats.res}</span></div>
                    <div>BIT: <span style={{color:'white'}}>{stats.bitrate}</span></div>
                    <div>BUF: <span style={{color:'white'}}>{stats.buffer}</span></div>
                </div>
            )}
            {isLoading && !errorMsg && (
                <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'black', zIndex:10}}>
                    <RefreshCw className="animate-spin" size={40} color="#3b82f6"/>
                    <span style={{color:'white', fontWeight:'500', letterSpacing:1}}>CONECTANDO...</span>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            )}
            {errorMsg && (
                <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#050505', zIndex:20, padding:30, textAlign:'center'}}>
                    <AlertCircle size={50} color="#ef4444" style={{marginBottom:20}}/>
                    <h3 style={{color:'white', margin:0, fontSize:'1.2rem'}}>Error de Reproducción</h3>
                    <p style={{color:'#9ca3af', margin:'10px 0 20px', fontSize:'0.9rem'}}>{errorMsg}</p>
                    <a href={channel.url} target="_blank" rel="noreferrer" style={{padding:'10px 20px', background:'rgba(255,255,255,0.1)', color:'white', textDecoration:'none', borderRadius:12, display:'flex', alignItems:'center', gap:10, fontSize:'0.9rem', border:'1px solid var(--border-glass)'}}>
                        <ExternalLink size={16}/> Abrir Externamente
                    </a>
                </div>
            )}
            
            <video ref={videoRef} controls crossOrigin="anonymous" muted={isMuted} style={{outline:'none'}} />

            {sleepTimer && (
                <div style={{position:'absolute', top:30, right:30, background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:20, color:'white', display:'flex', alignItems:'center', gap:6, backdropFilter:'blur(10px)', fontSize:'0.75rem', border:'1px solid var(--border-glass)'}}>
                    <Moon size={12}/> {sleepTimer}m
                </div>
            )}

            <div className="video-controls">
                <button onClick={() => videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()} className="nav-btn active" style={{borderRadius:'50%', width:50, height:50}}><Play size={22} fill="currentColor"/></button>
                
                <div style={{flex:1, paddingLeft:10}}>
                    <h3 style={{margin:0, color:'white', fontSize:'1rem', fontWeight:'600'}}>{channel.name}</h3>
                    <div style={{display:'flex', alignItems:'center', gap:6, marginTop:4}}>
                        <div style={{width:6, height:6, borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 10px var(--accent)'}}></div>
                        <span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>EN VIVO</span>
                    </div>
                </div>

                <div style={{display:'flex', gap:10}}>
                    <button onClick={isRecording ? stopRecording : startRecording} className="nav-btn" style={{color: isRecording ? '#ef4444' : 'white'}} title="Grabar"><Disc size={20} fill={isRecording ? "currentColor" : "none"}/></button>
                    <button onClick={() => setAudioOnly(!audioOnly)} className="nav-btn" title="Solo Audio"><Headphones size={20} color={audioOnly?'var(--accent)':'white'}/></button>
                    <button onClick={() => setShowStats(!showStats)} className="nav-btn" title="Info Técnica"><Info size={20} color={showStats?'var(--accent)':'white'}/></button>
                    
                    <div style={{position:'relative'}} className="group">
                        <button className="nav-btn"><Moon size={20}/></button>
                        <div style={{position:'absolute', bottom:'120%', right:0, background:'rgba(20,20,25,0.95)', padding:8, borderRadius:12, border:'1px solid var(--border-glass)', display:'none', flexDirection:'column', gap:5, minWidth:100, backdropFilter:'blur(10px)'}} className="group-hover:flex">
                            {[15, 30, 60, 0].map(m => (
                                <div key={m} onClick={()=>setSleepTimer(m===0?null:m)} style={{padding:'8px 12px', cursor:'pointer', borderRadius:8, color:sleepTimer===m?'var(--accent)':'#ccc', fontSize:'0.8rem', background:sleepTimer===m?'rgba(255,255,255,0.05)':'transparent'}}>
                                    {m === 0 ? 'Apagar' : `${m} min`}
                                </div>
                            ))}
                        </div>
                        <style>{`.group:hover .group-hover\\:flex { display: flex; }`}</style>
                    </div>

                    <div style={{width:1, height:24, background:'rgba(255,255,255,0.2)', margin:'0 5px'}}></div>

                    <button onClick={onToggleMute} className="nav-btn">{isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}</button>
                    <button onClick={() => videoRef.current.requestPictureInPicture()} className="nav-btn"><PictureInPicture size={20}/></button>
                    {onClose && <button onClick={onClose} className="nav-btn" style={{color:'#ef4444'}}><X size={20}/></button>}
                </div>
            </div>
        </div>
    );
};

// --- 3. APP PRINCIPAL ---
export default function App() {
  const [profiles, setProfiles] = useState(() => getFromStorage('iptv_pro_profiles', [{id:1, name:'Usuario', color:'#3b82f6', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}]));
  const [activeProfile, setActiveProfile] = useState(null);
  const [playlists, setPlaylists] = useState(() => getFromStorage('iptv_pro_lists', [{id:'def', name:'TV Pública', url:'https://iptv-org.github.io/iptv/languages/spa.m3u', active:true, type:'url'}]));
  const [channels, setChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('home'); 
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Multiview & Player States
  const [playingChannel, setPlayingChannel] = useState(null);
  const [mainChannel, setMainChannel] = useState(null);
  const [secondaryChannel, setSecondaryChannel] = useState(null);
  const [activeSlot, setActiveSlot] = useState(1);
  
  // Modales & Utilidades
  const [showModal, setShowModal] = useState(null); 
  const [newProfileName, setNewProfileName] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Profile Editing
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  
  const accent = activeProfile?.color || '#3b82f6';

  // Persistencia
  useEffect(() => {
      if(activeProfile) {
          setFavorites(getFromStorage(`favs_${activeProfile.id}`, []));
          setHistory(getFromStorage(`hist_${activeProfile.id}`, []));
      }
  }, [activeProfile]);

  useEffect(() => { 
      if(activeProfile) {
          saveToStorage(`favs_${activeProfile.id}`, favorites);
          saveToStorage(`hist_${activeProfile.id}`, history);
      }
  }, [favorites, history, activeProfile]);
  
  useEffect(() => { saveToStorage('iptv_pro_profiles', profiles); }, [profiles]);

  const addToast = (msg) => {
      const id = Date.now();
      const text = typeof msg === 'string' ? msg : 'Operación completada';
      setToasts(p => [...p, {id, msg: text}]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  // CARGA DE LISTA
  const loadPlaylist = async () => {
      if(!activeProfile) return;
      setIsLoading(true);
      setChannels([]);
      const list = playlists.find(p => p.active) || playlists[0];
      let content = '';

      try {
          if(list.type === 'file') {
              content = list.content;
          } else {
              const strategies = useProxy ? [
                  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
                  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
              ] : [(u) => u];

              let success = false;
              for (const strategy of strategies) {
                  try {
                      const ctrl = new AbortController();
                      setTimeout(() => ctrl.abort(), 8000);
                      const res = await fetch(strategy(list.url), { signal: ctrl.signal });
                      if (res.ok) { content = await res.text(); success = true; break; }
                  } catch (e) { console.warn("Proxy fallido"); }
              }
              if (!success) throw new Error();
          }

          const parsed = [];
          let curr = {};
          content.split('\n').forEach(line => {
              line = line.trim();
              if(line.startsWith('#EXTINF')) {
                  const name = line.split(',').pop();
                  const logo = line.match(/tvg-logo="([^"]*)"/)?.[1];
                  const group = line.match(/group-title="([^"]*)"/)?.[1] || 'General';
                  curr = {id: crypto.randomUUID(), name, logo, group};
              } else if(line.startsWith('http')) {
                  curr.url = line;
                  if(curr.name) parsed.push(curr);
                  curr={};
              }
          });
          setChannels(parsed);
          const cats = new Set(['Todos', ...parsed.map(c => c.group)]);
          setCategories([...cats].sort());
      } catch (e) {
          console.error(e);
          addToast("Error al cargar lista. Intenta desactivar/activar Proxy en Ajustes.");
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => { loadPlaylist(); }, [playlists, activeProfile]);

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          const newList = {id: crypto.randomUUID(), name: file.name, type:'file', content: ev.target.result, active: true};
          setPlaylists(prev => [...prev.map(p=>({...p, active:false})), newList]);
          setShowModal(null);
          addToast("Archivo importado");
      };
      reader.readAsText(file);
  };

  const handleChannelClick = (ch) => {
      setHistory(prev => [ch, ...prev.filter(h => h.url !== ch.url)].slice(0, 10));
      if(view === 'multiview') {
          if(activeSlot === 1) setMainChannel(ch); else setSecondaryChannel(ch);
      } else {
          setPlayingChannel(ch);
      }
  };

  const toggleFavorite = (e, ch) => {
      e?.stopPropagation();
      const exists = favorites.some(f => f.url === ch.url);
      setFavorites(prev => exists ? prev.filter(f => f.url !== ch.url) : [...prev, ch]);
      addToast(exists ? "Eliminado de favoritos" : "Añadido a favoritos");
  };

  const createProfile = (e) => {
      e.preventDefault();
      if(!newProfileName) return;
      const newP = {id: Date.now(), name: newProfileName, color: accent, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newProfileName}`};
      setProfiles([...profiles, newP]);
      setShowModal(null);
      setNewProfileName('');
  };

  const handleEditProfile = (profile) => {
      setEditingProfile(profile);
      setEditName(profile.name);
      setEditColor(profile.color);
      setShowModal('edit_profile');
  };

  const saveProfileChanges = () => {
      const updated = profiles.map(p => p.id === editingProfile.id ? {
          ...p, 
          name: editName, 
          color: editColor,
          avatar: editingProfile.avatar
      } : p);
      setProfiles(updated);
      setShowModal(null);
      setEditingProfile(null);
      addToast("Perfil actualizado");
  };

  const deleteProfile = () => {
      if(profiles.length <= 1) { addToast("Debe haber al menos un perfil"); return; }
      if(window.confirm("¿Eliminar perfil?")) {
          setProfiles(prev => prev.filter(p => p.id !== editingProfile.id));
          setShowModal(null);
          setEditingProfile(null);
      }
  };

  const handleAvatarUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          setEditingProfile(prev => ({...prev, avatar: ev.target.result}));
      };
      reader.readAsDataURL(file);
  };
  
  const handleDefaultAvatarClick = (url) => {
      setEditingProfile(prev => ({...prev, avatar: url}));
  };

  const filteredChannels = useMemo(() => {
      return channels.filter(ch => {
          const matchesSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesSearch;
      }).slice(0, 1000);
  }, [channels, searchTerm]);

  // --- LOGIN ---
  if(!activeProfile) return (
      <div className="profile-screen">
          <SafeStyles accentColor="#3b82f6"/>
          <ToastSystem toasts={toasts}/>
          <h1 style={{fontSize:'4rem', fontWeight:800, marginBottom:60, letterSpacing:-2, background:'linear-gradient(to bottom, #fff, #9ca3af)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', color: '#fff'}}>IPTV Studio</h1>
          
          <div style={{display:'flex', gap:50, flexWrap:'wrap', justifyContent:'center'}}>
              {profiles.map(p => (
                  <div key={p.id} className="profile-card" onClick={() => isManaging ? handleEditProfile(p) : setActiveProfile(p)} style={{cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div className="avatar-container">
                          <img src={p.avatar} className="profile-img"/>
                          {isManaging && <div className="edit-overlay"><Edit2 color="white" size={32}/></div>}
                      </div>
                      <span style={{color:'#fff', fontSize:'1.3rem', marginTop:20, fontWeight:'500'}}>{p.name}</span>
                  </div>
              ))}
              <div className="profile-card" onClick={()=>setShowModal('new_profile')} style={{cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <div className="avatar-container" style={{border:'2px dashed #444', display:'flex', alignItems:'center', justifyContent:'center', width:148, height:148, borderRadius:40}}>
                      <Plus size={50} color="#666"/>
                  </div>
                  <span style={{color:'#666', fontSize:'1.3rem', marginTop:20, fontWeight:'500'}}>Añadir</span>
              </div>
          </div>

          <button onClick={()=>setIsManaging(!isManaging)} style={{marginTop:60, padding:'12px 30px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)', color:'white', borderRadius:30, cursor:'pointer', fontWeight:'600', letterSpacing:1, fontSize:'0.9rem'}}>
              {isManaging ? 'HECHO' : 'ADMINISTRAR PERFILES'}
          </button>

          {showModal === 'new_profile' && (
              <div className="modal-overlay" onClick={(e)=>{if(e.target===e.currentTarget) setShowModal(null)}}>
                  <div className="modal-content">
                      <h3 style={{color:'white', marginBottom:20, fontSize:'1.5rem'}}>Nuevo Perfil</h3>
                      <form onSubmit={createProfile}>
                          <input autoFocus value={newProfileName} onChange={e=>setNewProfileName(e.target.value)} placeholder="Nombre del perfil" style={{width:'100%', padding:16, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)', color:'white', borderRadius:12, marginBottom:20, fontSize:'1.1rem'}}/>
                          <div style={{display:'flex', gap:15}}>
                              <button type="button" onClick={()=>setShowModal(null)} style={{flex:1, padding:14, background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:14, cursor:'pointer', fontWeight:'bold'}}>Cancelar</button>
                              <button type="submit" style={{flex:1, padding:14, background:'#3b82f6', border:'none', color:'white', borderRadius:14, cursor:'pointer', fontWeight:'bold'}}>Crear</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

          {showModal === 'edit_profile' && editingProfile && (
              <div className="modal-overlay" onClick={(e)=>{if(e.target===e.currentTarget) setShowModal(null)}}>
                  <div className="modal-content">
                      <h3 style={{color:'white', marginBottom:20, fontSize:'1.5rem'}}>Editar Perfil</h3>
                      
                      <div style={{display:'flex', justifyContent:'center', marginBottom:20, position:'relative'}}>
                          <img src={editingProfile.avatar} style={{width:120, height:120, borderRadius:30, objectFit:'cover'}}/>
                          <label style={{position:'absolute', bottom:-10, background:'#3b82f6', padding:10, borderRadius:'50%', cursor:'pointer', boxShadow:'0 5px 15px rgba(0,0,0,0.5)'}}>
                              <input type="file" style={{display:'none'}} onChange={handleAvatarUpload} accept="image/*"/>
                              <Camera size={20} color="white"/>
                          </label>
                      </div>

                      <div className="avatar-grid">
                          {defaultAvatars.map((url, idx) => (
                              <img 
                                  key={idx} 
                                  src={url} 
                                  className={`avatar-option ${editingProfile.avatar === url ? 'selected' : ''}`} 
                                  onClick={() => handleDefaultAvatarClick(url)}
                              />
                          ))}
                      </div>

                      <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nombre" style={{width:'100%', padding:16, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)', color:'white', borderRadius:12, marginBottom:20, fontSize:'1.1rem'}}/>
                      
                      <div style={{display:'flex', gap:10, marginBottom:30, justifyContent:'center'}}>
                          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                              <div key={c} onClick={()=>setEditColor(c)} style={{width:30, height:30, borderRadius:'50%', background:c, cursor:'pointer', border: editColor===c?'2px solid white':'none', transform: editColor===c?'scale(1.2)':'scale(1)', transition:'all 0.2s'}}></div>
                          ))}
                      </div>

                      <div style={{display:'flex', gap:15}}>
                          <button onClick={deleteProfile} style={{flex:1, padding:14, background:'rgba(239,68,68,0.2)', border:'1px solid rgba(239,68,68,0.5)', color:'#ef4444', borderRadius:14, cursor:'pointer', fontWeight:'bold', display:'flex', justifyContent:'center', alignItems:'center', gap:8}}><Trash2 size={18}/> Borrar</button>
                          <button onClick={saveProfileChanges} style={{flex:1, padding:14, background:'#3b82f6', border:'none', color:'white', borderRadius:14, cursor:'pointer', fontWeight:'bold', display:'flex', justifyContent:'center', alignItems:'center', gap:8}}><Check size={18}/> Guardar</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  // --- APP ---
  return (
      <div className="app-container">
          <SafeStyles accentColor={accent}/>
          <ToastSystem toasts={toasts}/>
          
          {/* Sidebar */}
          <div className="sidebar">
              <img src={activeProfile.avatar} style={{width:50, height:50, borderRadius:16, marginBottom:40, cursor:'pointer', border:`2px solid ${accent}`}} onClick={()=>setActiveProfile(null)} title="Salir"/>
              
              <button className={`nav-btn ${view==='home'?'active':''}`} onClick={()=>setView('home')}><Home size={24}/></button>
              <button className={`nav-btn ${view==='list'?'active':''}`} onClick={()=>setView('list')}><Grid size={24}/></button>
              <button className={`nav-btn ${view==='epg'?'active':''}`} onClick={()=>setView('epg')}><Calendar size={24}/></button>
              <button className={`nav-btn ${view==='favs'?'active':''}`} onClick={()=>setView('favs')}><Star size={24}/></button>
              {/* FIX: Botón Multiview ahora siempre funciona */}
              <button className={`nav-btn ${view==='multiview'?'active':''}`} onClick={()=>{setView('multiview');}}><SplitSquareHorizontal size={24}/></button>
              
              <div style={{marginTop:'auto', display:'flex', flexDirection:'column', gap:15}}>
                  <button className="nav-btn" onClick={()=>setShowModal('playlists')} title="Listas"><Layers size={24}/></button>
                  <button className="nav-btn" onClick={()=>setShowModal('settings')} title="Ajustes"><Settings size={24}/></button>
              </div>
          </div>

          {/* Content */}
          <div className="content-area">
              <div className="top-bar">
                  <div className="search-box">
                      <Search size={20} color="#9ca3af"/>
                      <input className="search-input" placeholder="Buscar canales, películas..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
                  </div>
                  <div style={{padding:'8px 16px', background:'rgba(255,255,255,0.05)', borderRadius:30, fontSize:'0.85rem', color:'#ccc', display:'flex', alignItems:'center', gap:10, border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{width:8, height:8, borderRadius:'50%', background:isLoading?'#f59e0b':'#10b981', boxShadow:isLoading?'0 0 10px #f59e0b':'0 0 10px #10b981'}}></div>
                      {playlists.find(p=>p.active)?.name}
                  </div>
              </div>

              {/* VISTAS */}
              <div style={{flex:1, overflowY:'auto'}} className="custom-scrollbar">
                  
                  {/* HOME VIEW */}
                  {view === 'home' && (
                      <div style={{padding:'110px 50px 50px'}}>
                          <div style={{background:`linear-gradient(120deg, ${accent}20, transparent)`, padding:60, borderRadius:32, border:'1px solid rgba(255,255,255,0.05)', position:'relative', overflow:'hidden', marginBottom:50}}>
                              <h1 style={{fontSize:'3.5rem', fontWeight:800, margin:0, letterSpacing:-1, color: '#fff'}}>Hola, {activeProfile.name}</h1>
                              <p style={{color:'#a1a1aa', fontSize:'1.3rem', marginTop:15}}>Explora {channels.length} canales en vivo.</p>
                              <button onClick={()=>setView('list')} style={{marginTop:35, padding:'16px 40px', background:'white', color:'black', border:'none', borderRadius:18, fontWeight:'800', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:12, transition:'transform 0.2s'}} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                                  <Play size={22} fill="currentColor"/> VER TV
                              </button>
                          </div>

                          {history.length > 0 && (
                              <div style={{marginBottom:50}}>
                                  <h2 style={{fontSize:'1.6rem', marginBottom:25, display:'flex', alignItems:'center', gap:12}}><History color={accent}/> Continuar Viendo</h2>
                                  <div style={{display:'flex', gap:25, overflowX:'auto', paddingBottom:20}}>
                                      {history.map(ch => (
                                          <div key={ch.id} className="channel-card" style={{minWidth:240}} onClick={()=>handleChannelClick(ch)}>
                                              <div className="card-image">{ch.logo ? <img src={ch.logo}/> : <Tv size={50} color="#444"/>}</div>
                                              <div className="card-info">{ch.name}</div>
                                              <div className="play-icon-overlay"><Play fill="white"/></div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          <h2 style={{fontSize:'1.6rem', marginBottom:25, display:'flex', alignItems:'center', gap:12}}><Star color="#eab308" fill="#eab308"/> Favoritos</h2>
                          {favorites.length > 0 ? (
                              <div className="grid-view" style={{padding:0}}>
                                  {favorites.map(ch => (
                                      <div key={ch.id} className="channel-card" onClick={() => handleChannelClick(ch)}>
                                          <div className="card-image">{ch.logo ? <img src={ch.logo}/> : <Tv size={50} color="#444"/>}</div>
                                          <div className="card-info">{ch.name}</div>
                                          <div className="play-icon-overlay"><Play fill="white"/></div>
                                      </div>
                                  ))}
                              </div>
                          ) : <div style={{padding:60, border:'2px dashed rgba(255,255,255,0.1)', borderRadius:24, textAlign:'center', color:'#666', fontSize:'1.1rem'}}>No tienes canales favoritos.</div>}
                      </div>
                  )}

                  {/* LIST VIEW */}
                  {(view === 'list' || view === 'favs') && (
                      <div className="grid-view">
                          {isLoading && <div style={{gridColumn:'1/-1', textAlign:'center', padding:50, color:'#666'}}>Cargando canales...</div>}
                          {(view==='favs' ? favorites : filteredChannels).map(ch => (
                              <div key={ch.id} className="channel-card" onClick={() => handleChannelClick(ch)}>
                                  <div className="card-image">
                                      {ch.logo ? <img src={ch.logo}/> : <Tv size={50} color="#444"/>}
                                      <button onClick={(e)=>{e.stopPropagation(); toggleFavorite(e,ch)}} style={{position:'absolute', top:15, right:15, background:'rgba(0,0,0,0.6)', border:'none', width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: favorites.some(f=>f.url===ch.url)?'#facc15':'white'}}>
                                          <Star size={18} fill={favorites.some(f=>f.url===ch.url)?"currentColor":"none"}/>
                                      </button>
                                  </div>
                                  <div className="card-info">{ch.name}</div>
                                  <div className="card-overlay">
                                      <span style={{color:'white', fontWeight:'bold', fontSize:'1.1rem'}}>{ch.name}</span>
                                      <span style={{color:'#ccc', fontSize:'0.85rem', marginTop:5}}>{ch.group}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* EPG VIEW */}
                  {view === 'epg' && (
                      <div className="epg-view">
                          <div className="epg-header">
                              <div className="epg-corner">CANAL</div>
                              <div className="epg-times">
                                  {[...Array(12)].map((_,i) => <div key={i} className="epg-time-cell">{new Date(Date.now()+i*3600000).getHours()}:00</div>)}
                              </div>
                          </div>
                          <div className="epg-body">
                              {filteredChannels.map(ch => (
                                  <div key={ch.id} className="epg-row">
                                      <div className="epg-channel-col" onClick={()=>handleChannelClick(ch)} style={{cursor:'pointer'}}>
                                          {ch.logo && <img src={ch.logo} style={{width:30, height:30, objectFit:'contain'}}/>}
                                          <span style={{fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'white'}}>{ch.name}</span>
                                      </div>
                                      <div className="epg-programs">
                                          {[...Array(12)].map((_,i) => (
                                              <div key={i} className="epg-program-item" onClick={()=>handleChannelClick(ch)}>
                                                  Programación Regular
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* MULTIVIEW VIEW */}
                  {(view === 'player' || view === 'multiview') && (
                      <div className="player-overlay">
                          <div style={{height:80, borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 40px', background:'rgba(10,10,10,0.9)', backdropFilter:'blur(20px)'}}>
                              <button onClick={()=>setView('list')} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', display:'flex', gap:10, fontWeight:'800', fontSize:'1rem', alignItems:'center', letterSpacing:1}}>
                                  <ArrowLeft strokeWidth={3}/> SALIR AL MENÚ
                              </button>
                              {view==='multiview' && (
                                  <div style={{display:'flex', gap:8, background:'rgba(255,255,255,0.05)', padding:6, borderRadius:14}}>
                                      <button onClick={()=>setActiveSlot(1)} style={{padding:'10px 25px', borderRadius:10, border:'none', background: activeSlot===1?accent:'transparent', color:'white', cursor:'pointer', fontWeight:'bold', transition:'0.2s'}}>Pantalla 1</button>
                                      <button onClick={()=>setActiveSlot(2)} style={{padding:'10px 25px', borderRadius:10, border:'none', background: activeSlot===2?accent:'transparent', color:'white', cursor:'pointer', fontWeight:'bold', transition:'0.2s'}}>Pantalla 2</button>
                                  </div>
                              )}
                          </div>
                          <div style={{flex:1, display:'flex', flexDirection: view==='multiview'?'row':'column'}}>
                              <div style={{flex:1, borderRight:'1px solid rgba(255,255,255,0.1)', position:'relative', border: (view==='multiview'&&activeSlot===1)?`3px solid ${accent}`:'none'}} onClick={()=>setActiveSlot(1)}>
                                  <VideoPlayer channel={mainChannel} isMuted={view==='multiview' && activeSlot!==1} addToast={addToast}/>
                                  {!mainChannel && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>Selecciona un canal</div>}
                              </div>
                              {view==='multiview' && (
                                  <div style={{flex:1, position:'relative', border: (activeSlot===2)?`3px solid ${accent}`:'none'}} onClick={()=>setActiveSlot(2)}>
                                      <VideoPlayer channel={secondaryChannel} isMuted={activeSlot!==2} onClose={()=>setSecondaryChannel(null)} addToast={addToast}/>
                                      {!secondaryChannel && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>Selecciona un canal</div>}
                                  </div>
                              )}
                              
                              {/* Sidebar en Reproductor */}
                              <div style={{width:350, background:'rgba(15, 15, 20, 0.95)', backdropFilter:'blur(30px)', borderLeft:'1px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column'}}>
                                  <div style={{padding:25, borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                                      <h3 style={{margin:'0 0 15px 0', fontSize:'0.85rem', color:'#9ca3af', fontWeight:'800', letterSpacing:1.5}}>CAMBIO RÁPIDO</h3>
                                      <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Filtrar canales..." style={{width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid var(--border-glass)', padding:14, borderRadius:14, color:'white', outline:'none', fontSize:'1rem'}}/>
                                  </div>
                                  <div style={{flex:1, overflowY:'auto'}} className="custom-scrollbar">
                                      {filteredChannels.slice(0,100).map(ch => (
                                          <div key={ch.id} onClick={()=>handleChannelClick(ch)} style={{padding:'15px 25px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.03)', display:'flex', gap:15, alignItems:'center', background: mainChannel?.id===ch.id?`${accent}15`:'transparent', borderLeft: mainChannel?.id===ch.id?`4px solid ${accent}`:'4px solid transparent', transition:'0.2s'}}>
                                              <div style={{width:40, height:40, background:'rgba(255,255,255,0.05)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                  {ch.logo ? <img src={ch.logo} style={{maxWidth:'80%', maxHeight:'80%'}}/> : <Tv size={18} color="#666"/>}
                                              </div>
                                              <div style={{flex:1}}>
                                                  <div style={{fontSize:'0.95rem', color: mainChannel?.id===ch.id?'white':'#d1d5db', fontWeight: mainChannel?.id===ch.id?'bold':'normal'}}>{ch.name}</div>
                                              </div>
                                              {mainChannel?.id===ch.id && <div style={{width:8, height:8, borderRadius:'50%', background:accent, boxShadow:`0 0 15px ${accent}`}}></div>}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Player Overlay (Single) */}
          {playingChannel && (
              <div className="fullscreen-player">
                  <VideoPlayer channel={playingChannel} onClose={()=>setPlayingChannel(null)} addToast={addToast}/>
              </div>
          )}

          {/* MODAL PLAYLISTS */}
          {showModal === 'playlists' && (
              <div className="modal-overlay" onClick={(e)=>{if(e.target===e.currentTarget) setShowModal(null)}}>
                  <div className="modal-content">
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:30}}>
                          <h3 style={{fontSize:'1.8rem', fontWeight:'800', margin:0, color:'white'}}>Gestionar Listas</h3>
                          <button onClick={()=>setShowModal(null)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X size={28}/></button>
                      </div>
                      
                      <div style={{border:'2px dashed rgba(255,255,255,0.1)', padding:40, textAlign:'center', borderRadius:20, marginBottom:30, cursor:'pointer', position:'relative', background:'rgba(255,255,255,0.02)', transition:'0.3s'}} onMouseEnter={e=>e.currentTarget.style.borderColor=accent} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
                          <input type="file" onChange={handleFileUpload} style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
                          <FileUp size={48} style={{marginBottom:15, color:accent}}/>
                          <p style={{margin:0, fontSize:'1.1rem', color:'white', fontWeight:'bold'}}>Subir archivo .m3u local</p>
                          <p style={{margin:'8px 0 0', fontSize:'0.9rem', color:'#9ca3af'}}>Haz clic o arrastra aquí</p>
                      </div>

                      <div style={{maxHeight:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:12}}>
                          {playlists.map(p => (
                              <div key={p.id} onClick={()=>{setPlaylists(prev => prev.map(x => ({...x, active: x.id===p.id}))); setShowModal(null);}} style={{padding:20, border:`1px solid ${p.active ? accent : 'rgba(255,255,255,0.1)'}`, borderRadius:16, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: p.active ? `${accent}15` : 'transparent', transition:'0.2s'}}>
                                  <div>
                                      <span style={{fontWeight:'bold', display:'block', fontSize:'1.1rem', color: p.active ? 'white' : '#ccc'}}>{p.name}</span>
                                      <span style={{fontSize:'0.85rem', opacity:0.5, marginTop:4, display:'block'}}>{p.type === 'file' ? 'Archivo Local' : 'URL Remota'}</span>
                                  </div>
                                  <div style={{display:'flex', gap:15, alignItems:'center'}}>
                                      {p.active && <div style={{padding:'6px 12px', background:accent, borderRadius:20, fontSize:'0.75rem', fontWeight:'bold', color:'white'}}>ACTIVA</div>}
                                      {playlists.length > 1 && <Trash2 size={20} onClick={(e)=>{e.stopPropagation(); setPlaylists(prev=>prev.filter(x=>x.id!==p.id))}} style={{opacity:0.5, cursor:'pointer'}}/>}
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div style={{marginTop:30, paddingTop:30, borderTop:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>
                           <button onClick={()=>{const u=prompt("URL de la lista .m3u:"); if(u) {setPlaylists([...playlists, {id:crypto.randomUUID(), name:'Nueva Lista Web', url:u, active:true, type:'url'}]); setShowModal(null);}}} style={{background:'transparent', border:'none', color:accent, cursor:'pointer', fontWeight:'800', fontSize:'1.1rem', display:'flex', alignItems:'center', gap:10, margin:'0 auto'}}>
                               <Plus size={24}/> Añadir desde URL
                           </button>
                      </div>
                  </div>
              </div>
          )}

          {/* MODAL SETTINGS */}
          {showModal === 'settings' && (
              <div className="modal-overlay" onClick={(e)=>{if(e.target===e.currentTarget) setShowModal(null)}}>
                  <div className="modal-content">
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:30}}>
                          <h3 style={{fontSize:'1.8rem', fontWeight:'800', margin:0, color:'white'}}>Ajustes</h3>
                          <button onClick={()=>setShowModal(null)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X size={28}/></button>
                      </div>
                      <div style={{marginBottom:40}}>
                          <p style={{marginBottom:15, color:'#9ca3af', fontSize:'0.85rem', fontWeight:'800', letterSpacing:1.5}}>CONEXIÓN</p>
                          <div onClick={()=>setUseProxy(!useProxy)} style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', padding:20, background:useProxy?`${accent}15`:'rgba(255,255,255,0.03)', borderRadius:16, border:`1px solid ${useProxy?accent:'rgba(255,255,255,0.1)'}`, transition:'0.3s'}}>
                              <div>
                                  <span style={{display:'block', fontWeight:'600', fontSize:'1.1rem', color: useProxy ? 'white' : '#ccc'}}>Modo Proxy (CORS)</span>
                                  <span style={{fontSize:'0.9rem', color:'#9ca3af', marginTop:5, display:'block'}}>Activa esto si los canales no cargan</span>
                              </div>
                              <div style={{width:50, height:28, background:useProxy?accent:'#333', borderRadius:20, position:'relative', transition:'all 0.3s'}}>
                                  <div style={{width:22, height:22, background:'white', borderRadius:'50%', position:'absolute', top:3, left: useProxy?25:3, transition:'all 0.3s', boxShadow:'0 2px 5px rgba(0,0,0,0.3)'}}></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}