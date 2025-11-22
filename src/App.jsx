import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Play, Search, Tv, AlertCircle, X, Globe, Star, 
  Filter, RefreshCw, Clock, Grid, List as ListIcon, 
  PictureInPicture, Monitor, Trash2, Plus, 
  Layers, Headphones, Volume2, VolumeX, Home, Maximize2, Minimize2, 
  Wifi, Activity, Palette, XCircle, Lock, Camera, SplitSquareHorizontal, FileUp, LogOut, ExternalLink
} from 'lucide-react';

// --- ESTILOS DE SEGURIDAD (Garantía de diseño) ---
const SafeStyles = () => (
  <style>{`
    :root { --bg-dark: #0a0c10; --bg-panel: #11141a; --bg-card: #1a1d24; --accent: #2563eb; --text-main: #ffffff; --text-muted: #9ca3af; }
    * { box-sizing: border-box; }
    body { margin: 0; background-color: var(--bg-dark); color: var(--text-main); font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
    
    /* Utilidades */
    .flex { display: flex; } .flex-col { flex-direction: column; } .items-center { align-items: center; } .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; } .h-screen { height: 100vh; width: 100vw; } .w-full { width: 100%; } .h-full { height: 100%; }
    .relative { position: relative; } .absolute { position: absolute; } .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .gap-2 { gap: 0.5rem; } .gap-4 { gap: 1rem; } .p-4 { padding: 1rem; } .p-8 { padding: 2rem; }
    
    /* Sidebar & Nav */
    .sidebar { width: 80px; background-color: var(--bg-panel); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; padding: 20px 0; height: 100vh; z-index: 20; }
    .nav-btn { width: 50px; height: 50px; border-radius: 15px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; margin-bottom: 10px; }
    .nav-btn:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-btn.active { background: var(--accent); color: white; box-shadow: 0 4px 15px rgba(37,99,235,0.3); }

    /* Perfiles */
    .profile-grid { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; z-index: 10; position: relative; }
    .profile-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; }
    .profile-item:hover { transform: translateY(-5px); }
    .profile-avatar { width: 120px; height: 120px; border-radius: 25px; object-fit: cover; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 3px solid transparent; transition: border 0.2s; }
    .profile-item:hover .profile-avatar { border-color: white; }
    .profile-name { margin-top: 15px; font-size: 1.1rem; font-weight: 600; color: var(--text-muted); }
    .profile-item:hover .profile-name { color: white; }

    /* Layout */
    .main-content { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: var(--bg-dark); }
    .top-bar { height: 70px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; background: rgba(10,12,16,0.8); backdrop-filter: blur(10px); z-index: 10; }
    .search-container { display: flex; align-items: center; background: var(--bg-card); padding: 10px 20px; border-radius: 30px; width: 350px; border: 1px solid rgba(255,255,255,0.05); transition: border 0.2s; }
    .search-container:focus-within { border-color: rgba(255,255,255,0.2); }
    .search-input { background: transparent; border: none; color: white; margin-left: 10px; outline: none; width: 100%; font-size: 0.9rem; }

    /* Grid Canales */
    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; padding: 0 10px; }
    .channel-card { background: var(--bg-card); border-radius: 15px; overflow: hidden; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.05); position: relative; aspect-ratio: 16/9; display: flex; flex-direction: column; }
    .channel-card:hover { transform: scale(1.03); border-color: rgba(255,255,255,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 5; }
    .card-image { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,0.2); position: relative; }
    .card-image img { max-width: 80%; max-height: 80%; object-fit: contain; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5)); }
    .card-info { padding: 12px; background: rgba(0,0,0,0.2); font-size: 0.85rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Player */
    .player-overlay { position: absolute; inset: 0; background: #000; z-index: 50; display: flex; flex-direction: column; }
    .video-container { flex: 1; position: relative; background: black; display: flex; align-items: center; justify-content: center; }
    .video-element { width: 100%; height: 100%; object-fit: contain; }
    .video-controls { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; gap: 20px; pointer-events: none; }
    .video-container:hover .video-controls { opacity: 1; }
    .video-controls > * { pointer-events: auto; }
    
    /* Estado de Carga/Error */
    .status-msg { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; height: 100%; gap: 10px; text-align: center; padding: 20px; }
    .error-badge { background: rgba(239,68,68,0.1); color: #ef4444; padding: 5px 10px; border-radius: 5px; font-size: 0.8rem; border: 1px solid rgba(239,68,68,0.2); margin-top: 5px; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }
  `}</style>
);

// --- 1. HOOK HLS (Lógica de Video Mejorada) ---
const useHls = (src, videoRef, onError, onLoading) => {
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if(onLoading) onLoading(true);

    if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
    }

    const handlePlay = () => {
        if(onLoading) onLoading(false);
        const p = video.play();
        if (p !== undefined) p.catch(() => {}); // Ignorar abortos
    };

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ 
          enableWorker: true, 
          lowLatencyMode: true,
          // Config para recuperar errores automáticamente
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 2,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(window.Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
            switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                    console.warn("Error de red, intentando recuperar...");
                    hls.startLoad();
                    break;
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                    console.warn("Error de medio, recuperando...");
                    hls.recoverMediaError();
                    break;
                default:
                    console.error("Error fatal HLS:", data);
                    hls.destroy();
                    if (onError) onError("Stream incompatible o bloqueado por CORS");
                    break;
            }
        }
      });
      
      hls.on(window.Hls.Events.MANIFEST_PARSED, handlePlay);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', handlePlay);
      video.addEventListener('error', () => { if(onError) onError("Error nativo de reproducción"); });
    } else {
        if(onError) onError("Tu navegador no soporta este formato");
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener('loadedmetadata', handlePlay);
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);
};

// --- 2. UTILIDADES ---
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromStorage = (key, def) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : def;
};

// --- 3. COMPONENTE DE VIDEO (Con manejo de errores visible) ---
const VideoPlayer = ({ channel, onClose, isMuted, onToggleMute }) => {
    const videoRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Limpiar estado al cambiar canal
    useEffect(() => { setErrorMsg(null); setIsLoading(true); }, [channel]);

    useHls(channel?.url, videoRef, (msg) => { setErrorMsg(msg); setIsLoading(false); }, (loading) => setIsLoading(loading));

    if (!channel) return <div className="status-msg"><Tv size={40} style={{opacity:0.5}}/><p>Selecciona un canal</p></div>;

    return (
        <div className="video-container">
            {/* LOADING STATE */}
            {isLoading && !errorMsg && (
                <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'black', zIndex:10}}>
                    <RefreshCw className="animate-spin" size={30} style={{animation:'spin 1s linear infinite', marginBottom:10, color:'#2563eb'}}/>
                    <span style={{color:'#9ca3af', fontSize:'0.9rem'}}>Cargando señal...</span>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* ERROR STATE */}
            {errorMsg && (
                <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#000', zIndex:20, padding:20, textAlign:'center'}}>
                    <AlertCircle size={40} color="#ef4444" style={{marginBottom:10}}/>
                    <h3 style={{color:'white', margin:0}}>No se puede reproducir</h3>
                    <p style={{color:'#9ca3af', fontSize:'0.9rem', margin:'10px 0'}}>{errorMsg}</p>
                    <div className="error-badge">Posible bloqueo CORS o canal offline</div>
                    
                    <a href={channel.url} target="_blank" rel="noopener noreferrer" style={{marginTop:20, padding:'10px 20px', background:'#2563eb', color:'white', textDecoration:'none', borderRadius:8, display:'flex', alignItems:'center', gap:8, fontWeight:'bold'}}>
                        <ExternalLink size={16}/> Abrir Externamente
                    </a>
                    <p style={{fontSize:'0.7rem', color:'#6b7280', marginTop:10}}>Esto abrirá el canal en una nueva pestaña (funciona mejor).</p>
                </div>
            )}
            
            <video 
                ref={videoRef} 
                className="video-element" 
                muted={isMuted} 
                crossOrigin="anonymous"
            />

            <div className="video-controls">
                <button onClick={() => videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()} className="nav-btn active" style={{borderRadius:'50%'}}><Play size={20} fill="currentColor"/></button>
                
                <div style={{flex:1}}>
                    <h3 style={{margin:0, color:'white', fontSize:'1rem'}}>{channel.name}</h3>
                    <span style={{fontSize:'0.8rem', color:'#2563eb', fontWeight:'bold'}}>EN VIVO</span>
                </div>

                <button onClick={onToggleMute} className="nav-btn">{isMuted ? <VolumeX/> : <Volume2/>}</button>
                <button onClick={() => videoRef.current.requestPictureInPicture()} className="nav-btn"><PictureInPicture/></button>
                {onClose && <button onClick={onClose} className="nav-btn" style={{color:'#ef4444'}}><X/></button>}
            </div>
        </div>
    );
};

// --- 4. APP PRINCIPAL ---
export default function App() {
  const [profiles, setProfiles] = useState(() => getFromStorage('iptv_profiles_v7', [
    { id: 1, name: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', color: 'blue' }
  ]));
  const [activeProfile, setActiveProfile] = useState(null);
  const [playlists, setPlaylists] = useState(() => getFromStorage('iptv_playlists_v7', [
    { id: 'default', name: 'TV Pública', url: 'https://iptv-org.github.io/iptv/languages/spa.m3u', active: true, type: 'url' }
  ]));
  const [channels, setChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const [mainChannel, setMainChannel] = useState(null);
  const [secondaryChannel, setSecondaryChannel] = useState(null);
  const [activeSlot, setActiveSlot] = useState(1);

  useEffect(() => {
    if(activeProfile) setFavorites(getFromStorage(`favs_${activeProfile.id}`, []));
  }, [activeProfile]);

  useEffect(() => {
      if(activeProfile) saveToStorage(`favs_${activeProfile.id}`, favorites);
  }, [favorites, activeProfile]);

  const loadPlaylist = async () => {
    if (!activeProfile) return;
    setIsLoading(true);
    setChannels([]);
    const activePl = playlists.find(p => p.active) || playlists[0];
    let content = '';

    try {
        if (activePl.type === 'file') {
            content = activePl.content;
        } else {
            const strategies = useProxy ? [
                (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
            ] : [(url) => url];

            let fetchSuccess = false;
            for (const strategy of strategies) {
                try {
                    const proxyUrl = strategy(activePl.url);
                    const controller = new AbortController();
                    const id = setTimeout(() => controller.abort(), 5000);
                    const res = await fetch(proxyUrl, { signal: controller.signal });
                    clearTimeout(id);
                    if (res.ok) { content = await res.text(); fetchSuccess = true; break; }
                } catch (err) { console.warn("Fallo estrategia de carga"); }
            }
            if (!fetchSuccess) throw new Error("Error de conexión");
        }
        
        const parsed = [];
        let current = {};
        content.split('\n').forEach(line => {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                const logo = line.match(/tvg-logo="([^"]*)"/)?.[1];
                const name = line.split(',').pop().trim();
                current = { id: crypto.randomUUID(), name, logo };
            } else if (line.startsWith('http')) {
                current.url = line;
                if (current.name) parsed.push(current);
                current = {};
            }
        });
        setChannels(parsed);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadPlaylist() }, [playlists, useProxy, activeProfile]);

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
          const newPl = { id: crypto.randomUUID(), name: file.name.replace('.m3u', ''), type: 'file', content: evt.target.result, active: true };
          setPlaylists([...playlists.map(p => ({...p, active: false})), newPl]);
          setShowPlaylistModal(false);
      };
      reader.readAsText(file);
  };

  const handleChannelClick = (ch) => {
      if (view === 'multiview') {
          if (activeSlot === 1) setMainChannel(ch); else setSecondaryChannel(ch);
      } else {
          setMainChannel(ch); setSecondaryChannel(null); setView('player');
      }
  };

  const toggleFavorite = (e, ch) => {
      e?.stopPropagation();
      setFavorites(prev => prev.some(f => f.url === ch.url) ? prev.filter(f => f.url !== ch.url) : [...prev, ch]);
  };

  // --- UI LOGIN ---
  if (!activeProfile) return (
      <div className="h-screen flex flex-col items-center justify-center" style={{background: '#0a0c10', backgroundImage: 'radial-gradient(circle at center, #1f2937 0%, #0a0c10 100%)'}}>
         <SafeStyles />
         <h1 style={{fontSize: '3.5rem', marginBottom: '3rem', fontWeight: '800', letterSpacing: '-2px', background: 'linear-gradient(to right, #fff, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>IPTV Studio</h1>
         <div className="profile-grid">
            {profiles.map(p => (
                <div key={p.id} onClick={() => setActiveProfile(p)} className="profile-item">
                    <img src={p.avatar} className="profile-avatar"/>
                    <span className="profile-name">{p.name}</span>
                </div>
            ))}
            <div onClick={() => {
                const n = prompt("Nombre del perfil:");
                if(n) setProfiles([...profiles, {id: Date.now(), name: n, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${n}`, color: 'purple'}]);
            }} className="profile-item">
                <div className="profile-avatar" style={{border: '2px dashed #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937'}}>
                    <Plus size={40} color="#9ca3af"/>
                </div>
                <span className="profile-name">Nuevo</span>
            </div>
         </div>
      </div>
  );

  return (
    <div className="flex h-screen">
        <SafeStyles />
        
        <div className="sidebar">
            <img src={activeProfile.avatar} style={{width: 45, height: 45, borderRadius: 12, marginBottom: 30, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)'}} onClick={()=>setActiveProfile(null)} title="Cerrar Sesión"/>
            <button className={`nav-btn ${view==='home'?'active':''}`} onClick={()=>setView('home')} title="Inicio"><Home size={22}/></button>
            <button className={`nav-btn ${view==='list'?'active':''}`} onClick={()=>setView('list')} title="Canales"><Grid size={22}/></button>
            <button className={`nav-btn ${view==='favs'?'active':''}`} onClick={()=>setView('favs')} title="Favoritos"><Star size={22}/></button>
            <button className={`nav-btn ${view==='multiview'?'active':''}`} onClick={()=>{setView('multiview'); if(!mainChannel) setView('list');}} title="Multiview"><SplitSquareHorizontal size={22}/></button>
            <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10}}>
                <button className="nav-btn" onClick={()=>setShowPlaylistModal(true)} title="Listas"><Layers size={22}/></button>
            </div>
        </div>

        <div className="main-content">
            <div className="top-bar">
                <div className="search-container">
                    <Search size={18} style={{color:'#9ca3af'}}/>
                    <input className="search-input" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Buscar canales..."/>
                </div>
                <div style={{fontSize: 13, color: '#9ca3af', display:'flex', alignItems:'center', gap:8}}>
                    <div style={{width:8, height:8, background:'#22c55e', borderRadius:'50%'}}></div>
                    {playlists.find(p=>p.active)?.name || "Sin Lista"}
                </div>
            </div>

            <div style={{flex: 1, overflowY: 'auto', paddingBottom: 20}}>
                {view === 'home' && (
                    <div className="p-8">
                        <div style={{background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', padding: 50, borderRadius: 25, marginBottom: 40, position:'relative', overflow:'hidden', boxShadow:'0 20px 50px rgba(37,99,235,0.3)'}}>
                            <div style={{position:'relative', zIndex:10}}>
                                <h1 style={{fontSize: '3rem', margin: 0, fontWeight:'800', letterSpacing:'-1px'}}>Bienvenido, {activeProfile.name}</h1>
                                <p style={{color: '#bfdbfe', marginTop: 10, fontSize:'1.2rem'}}>Tu centro de entretenimiento está listo.</p>
                                <button onClick={()=>setView('list')} style={{marginTop: 30, padding: '15px 30px', borderRadius: 15, border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background:'white', color:'#1e40af', fontSize:'1rem', boxShadow:'0 10px 20px rgba(0,0,0,0.2)'}}>
                                    <Play size={20} fill="currentColor"/> Ver Televisión
                                </button>
                            </div>
                        </div>
                        <h2 style={{fontSize:'1.5rem', marginBottom: 20, display:'flex', alignItems:'center', gap:10}}><Star size={24} fill="#eab308" color="#eab308"/> Favoritos</h2>
                        {favorites.length > 0 ? (
                            <div className="channel-grid">
                                {favorites.map(ch => (
                                    <div key={ch.id} className="channel-card" onClick={() => handleChannelClick(ch)}>
                                        <div className="card-image">{ch.logo ? <img src={ch.logo}/> : <Tv size={40} color="#666"/>}</div>
                                        <div className="card-info">{ch.name}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{color:'#666'}}>Añade canales a favoritos pulsando la estrella.</p>}
                    </div>
                )}

                {(view === 'list' || view === 'favs') && (
                    <div className="p-8">
                        <h2 style={{fontSize:'1.8rem', marginBottom: 30}}>{view === 'list' ? 'Todos los Canales' : 'Mis Favoritos'}</h2>
                        {isLoading && <div style={{textAlign:'center', padding:50, color:'#666'}}>Cargando lista...</div>}
                        <div className="channel-grid">
                            {(view === 'favs' ? favorites : channels).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(ch => (
                                <div key={ch.id} className="channel-card" onClick={() => handleChannelClick(ch)}>
                                    <div className="card-image">
                                        {ch.logo ? <img src={ch.logo}/> : <Tv size={40} color="#666"/>}
                                        <button onClick={(e)=>{e.stopPropagation(); toggleFavorite(e,ch)}} style={{position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: favorites.some(f=>f.url===ch.url)?'#facc15':'white'}}>
                                            <Star size={16} fill={favorites.some(f=>f.url===ch.url)?"currentColor":"none"}/>
                                        </button>
                                    </div>
                                    <div className="card-info">{ch.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(view === 'player' || view === 'multiview') && (
                    <div className="player-overlay">
                        <div style={{height: 60, borderBottom: '1px solid #333', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', background:'#111'}}>
                            <button onClick={()=>setView('list')} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontWeight:'bold', fontSize:'1rem'}}>
                                <XCircle size={20}/> SALIR
                            </button>
                            {view === 'multiview' && (
                                <div style={{display:'flex', gap:10, background:'#222', padding:5, borderRadius:10}}>
                                    <button onClick={()=>setActiveSlot(1)} style={{padding:'8px 20px', borderRadius:8, border:'none', background: activeSlot===1?'#2563eb':'transparent', color:'white', cursor:'pointer', fontWeight:'bold'}}>Pantalla 1</button>
                                    <button onClick={()=>setActiveSlot(2)} style={{padding:'8px 20px', borderRadius:8, border:'none', background: activeSlot===2?'#2563eb':'transparent', color:'white', cursor:'pointer', fontWeight:'bold'}}>Pantalla 2</button>
                                </div>
                            )}
                        </div>
                        <div style={{flex: 1, display: 'flex', flexDirection: view === 'multiview' ? 'row' : 'column'}}>
                            <div style={{flex: 1, borderRight: '1px solid #333', position:'relative', cursor: view==='multiview'?'pointer':'default', border: (view==='multiview'&&activeSlot===1)?'3px solid #2563eb':'none'}} onClick={()=>setActiveSlot(1)}>
                                <VideoPlayer channel={mainChannel} isMuted={view === 'multiview' && activeSlot !== 1} onToggleMute={()=>{}}/>
                            </div>
                            {view === 'multiview' && (
                                <div style={{flex: 1, position:'relative', cursor:'pointer', border: (activeSlot===2)?'3px solid #2563eb':'none'}} onClick={()=>setActiveSlot(2)}>
                                    <VideoPlayer channel={secondaryChannel} isMuted={activeSlot !== 2} onClose={() => setSecondaryChannel(null)}/>
                                </div>
                            )}
                            {/* Lista lateral en reproductor */}
                            <div style={{width: 300, background: '#11141a', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column'}}>
                                <div style={{padding: 15, borderBottom: '1px solid #333'}}>
                                    <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Cambiar canal..." style={{width:'100%', background:'#222', border:'1px solid #333', padding:12, borderRadius:10, color:'white', outline:'none'}}/>
                                </div>
                                <div style={{flex: 1, overflowY: 'auto'}}>
                                    {channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(ch => (
                                        <div key={ch.id} onClick={()=>handleChannelClick(ch)} style={{padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 15, alignItems: 'center', background: mainChannel?.id === ch.id ? '#1f2937' : 'transparent', transition:'background 0.2s'}}>
                                            <div style={{width:35, height:35, background:'#000', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                {ch.logo ? <img src={ch.logo} style={{maxWidth:'80%', maxHeight:'80%'}}/> : <Tv size={16} color="#666"/>}
                                            </div>
                                            <span style={{fontSize: '0.9rem', color: mainChannel?.id === ch.id ? 'white' : '#9ca3af', fontWeight: mainChannel?.id === ch.id ? 'bold' : 'normal'}}>{ch.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL LISTAS */}
        {showPlaylistModal && (
            <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, backdropFilter:'blur(5px)'}}>
                <div style={{background:'#1f2937', padding:30, borderRadius:25, width:450, color:'white', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)'}}>
                    <div className="flex justify-between mb-6"><h3 style={{fontSize:'1.5rem', fontWeight:'bold'}}>Gestionar Listas</h3><button onClick={()=>setShowPlaylistModal(false)} className="nav-btn"><X/></button></div>
                    
                    <div style={{border:'2px dashed #4b5563', padding:30, textAlign:'center', borderRadius:15, marginBottom:25, cursor:'pointer', position:'relative', background:'rgba(0,0,0,0.2)', transition:'all 0.2s'}}>
                        <input type="file" onChange={handleFileUpload} style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
                        <FileUp size={40} style={{marginBottom:15, color:'#9ca3af'}}/>
                        <p style={{margin:0, fontSize:'1rem', color:'white', fontWeight:'bold'}}>Subir archivo .m3u</p>
                        <p style={{margin:'5px 0 0', fontSize:'0.8rem', color:'#9ca3af'}}>o arrastra y suelta aquí</p>
                    </div>

                    <div style={{maxHeight: 200, overflowY: 'auto', display:'flex', flexDirection:'column', gap:10}}>
                        {playlists.map(p => (
                            <div key={p.id} onClick={()=>{setPlaylists(prev => prev.map(x => ({...x, active: x.id === p.id}))); setShowPlaylistModal(false);}} style={{padding:15, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: p.active ? '#2563eb' : 'transparent'}}>
                                <div>
                                    <span style={{fontWeight:'bold', display:'block'}}>{p.name}</span>
                                    <span style={{fontSize:'0.8rem', opacity:0.7}}>{p.type === 'file' ? 'Local File' : 'URL Remota'}</span>
                                </div>
                                {playlists.length > 1 && <Trash2 size={18} onClick={(e)=>{e.stopPropagation(); setPlaylists(prev=>prev.filter(x=>x.id!==p.id))}} style={{opacity:0.7}}/>}
                            </div>
                        ))}
                    </div>
                    
                    <div style={{marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>
                         <button onClick={()=>{
                            const u = prompt("URL de la lista .m3u:");
                            if(u) {
                                setPlaylists([...playlists, {id: crypto.randomUUID(), name: 'Nueva Lista Web', url: u, active: true, type: 'url'}]);
                                setShowPlaylistModal(false);
                            }
                        }} style={{background:'transparent', border:'none', color:'#60a5fa', cursor:'pointer', fontWeight:'bold'}}>+ Añadir URL Remota</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}