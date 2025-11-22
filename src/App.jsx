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

// --- ESTILOS RESPONSIVOS (MOBILE FIRST) ---
const SafeStyles = ({ accentColor }) => (
  <style>{`
    :root { 
      --bg-deep: #030303; 
      --bg-panel: rgba(20, 20, 25, 0.9); 
      --bg-card: rgba(255, 255, 255, 0.05); 
      --accent: ${accentColor}; 
      --text-main: #ffffff; 
      --text-muted: #9ca3af; 
      --border-glass: rgba(255,255,255,0.1);
    }
    
    * { box-sizing: border-box; outline: none; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; background-color: var(--bg-deep); color: var(--text-main); font-family: 'Inter', system-ui, -apple-system, sans-serif; overflow: hidden; }

    /* Scrollbar */
    *::-webkit-scrollbar { width: 4px; height: 4px; }
    *::-webkit-scrollbar-track { background: transparent; }
    *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

    /* Layout Principal */
    .app-container { display: flex; height: 100vh; width: 100vw; background: var(--bg-deep); overflow: hidden; }
    
    /* Sidebar (Escritorio) */
    .sidebar { 
        width: 80px; 
        background: rgba(10, 10, 10, 0.8); 
        backdrop-filter: blur(20px); 
        border-right: 1px solid var(--border-glass); 
        display: flex; flex-direction: column; align-items: center; 
        padding: 30px 0; z-index: 50; 
        transition: all 0.3s ease;
    }

    /* Navegación */
    .nav-btn { 
        width: 44px; height: 44px; border-radius: 12px; border: none; background: transparent; 
        color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; 
        margin-bottom: 10px; transition: 0.2s;
    }
    .nav-btn.active { background: var(--accent); color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    
    .sidebar-avatar { width: 44px; height: 44px; border-radius: 12px; margin-bottom: 20px; border: 2px solid var(--accent); cursor: pointer; }

    /* Área de Contenido */
    .content-area { flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative; }
    
    /* Top Bar */
    .top-bar { 
        height: 70px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; 
        background: rgba(10,10,10,0.8); backdrop-filter: blur(10px); z-index: 20;
        border-bottom: 1px solid var(--border-glass);
    }
    
    .search-box { 
        display: flex; align-items: center; background: rgba(255,255,255,0.08); 
        padding: 8px 15px; border-radius: 20px; width: 300px; 
        border: 1px solid transparent; transition: 0.3s;
    }
    .search-box:focus-within { border-color: var(--accent); background: rgba(0,0,0,0.5); }
    .search-input { background: transparent; border: none; color: white; margin-left: 10px; width: 100%; font-size: 0.9rem; }

    /* Grid */
    .grid-view { 
        padding: 20px; overflow-y: auto; flex: 1; 
        display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;
        padding-bottom: 100px; /* Espacio para navbar móvil */
    }
    
    .channel-card { 
        background: var(--bg-card); border-radius: 12px; overflow: hidden; 
        position: relative; aspect-ratio: 16/9; cursor: pointer; border: 1px solid var(--border-glass);
    }
    .card-image { 
        height: 100%; width: 100%; padding: 15px; display: flex; align-items: center; justify-content: center; 
        background: radial-gradient(circle, rgba(255,255,255,0.03), transparent);
    }
    .card-image img { max-width: 80%; max-height: 80%; object-fit: contain; }
    .card-info { 
        position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; 
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
    }

    /* Player Layout Classes */
    .player-overlay { position: absolute; inset: 0; background: #000; z-index: 60; display: flex; flex-direction: column; }
    .player-body { flex: 1; display: flex; overflow: hidden; }
    .player-body.single { flex-direction: row; }
    .player-body.multi { flex-direction: row; }
    
    .video-container { flex: 1; position: relative; background: black; display: flex; align-items: center; justify-content: center; border-right: 1px solid var(--border-glass); }
    .video-controls { 
        position: absolute; bottom: 20px; left: 20px; right: 20px; padding: 10px 20px; 
        background: rgba(20, 20, 25, 0.9); backdrop-filter: blur(10px); border-radius: 16px; 
        display: flex; align-items: center; gap: 15px; opacity: 0; transition: opacity 0.3s;
    }
    .video-container:hover .video-controls { opacity: 1; }

    .player-sidebar { width: 300px; background: rgba(10,10,10,0.95); border-left: 1px solid var(--border-glass); display: flex; flex-direction: column; }

    /* RESPONSIVE: MÓVIL (< 768px) */
    @media (max-width: 768px) {
        .app-container { flex-direction: column; }
        
        /* Sidebar se convierte en Bottom Nav */
        .sidebar { 
            width: 100%; height: 60px; flex-direction: row; justify-content: space-around; 
            padding: 0; position: fixed; bottom: 0; border-right: none; border-top: 1px solid var(--border-glass); 
            background: rgba(10,10,10,0.95);
        }
        .sidebar-avatar { display: none; } /* Ocultar avatar en móvil para espacio */
        .nav-btn { margin-bottom: 0; width: auto; height: 100%; flex: 1; border-radius: 0; }
        .nav-btn svg { width: 20px; height: 20px; }
        
        /* Ajuste Contenido */
        .content-area { height: 100%; padding-bottom: 60px; }
        .top-bar { padding: 0 15px; height: 60px; }
        .search-box { width: 100%; font-size: 0.8rem; }
        
        /* Grid Móvil */
        .grid-view { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding: 15px; }
        
        /* Player Móvil */
        .player-body.single { flex-direction: column; }
        .player-body.multi { flex-direction: column; }
        .player-sidebar { width: 100%; height: 40%; border-left: none; border-top: 1px solid var(--border-glass); }
        .video-controls { padding: 8px 15px; bottom: 10px; left: 10px; right: 10px; opacity: 1 !important; /* Siempre visible en móvil */ }
        
        /* EPG Móvil */
        .epg-channel-col { min-width: 120px; position: sticky; left: 0; z-index: 10; background: #111; }
    }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 200; display: flex; alignItems: center; justify-content: center; padding: 20px; }
    .modal-content { background: #16181d; border-radius: 20px; padding: 25px; width: 100%; max-width: 450px; border: 1px solid var(--border-glass); max-height: 80vh; overflow-y: auto; }
    
    /* Login Screen */
    .profile-screen { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, #1a1a2e 0%, black 100%); }
    .profile-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 20px; }
    .avatar-option { width: 50px; height: 50px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; background: #222; }
    .avatar-option.selected { border-color: var(--accent); }
  `}</style>
);

// --- 1. HOOKS ---
const useHls = (src, videoRef, onError, onLoading) => {
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
          const hls = new window.Hls({enableWorker:true, lowLatencyMode:true});
          hlsRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, (e,d) => { 
             if(d.fatal) { 
                 if(d.type === window.Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                 else { hls.destroy(); if(onError) onError("Stream error"); }
             } 
          });
          hls.on(window.Hls.Events.MANIFEST_PARSED, safePlay);
      } else if(video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', safePlay);
          video.addEventListener('error', () => { if(onError) onError("Native error"); });
      }
    }
    return () => { if(hlsRef.current) hlsRef.current.destroy(); };
  }, [src]);
};

const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };

const defaultAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/bottts/svg?seed=Gamer',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy', 'https://api.dicebear.com/7.x/lorelei/svg?seed=Chill',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Explore', 'https://api.dicebear.com/7.x/micah/svg?seed=Art',
  'https://api.dicebear.com/7.x/open-peeps/svg?seed=Cool', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro'
];

// --- 2. COMPONENTES ---
const Toast = ({ msg }) => (
    <div style={{position:'fixed', top:20, right:20, background:'rgba(30,30,30,0.9)', color:'white', padding:'10px 20px', borderRadius:10, zIndex:1000, backdropFilter:'blur(5px)', border:'1px solid rgba(255,255,255,0.1)'}}>{msg}</div>
);

const VideoPlayer = ({ channel, onClose, isMuted, className }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useHls(channel?.url, videoRef, setError, setLoading);

    return (
        <div className={`video-container ${className}`}>
            {loading && !error && <div style={{position:'absolute', color:'white'}}><RefreshCw className="animate-spin"/></div>}
            {error && <div style={{position:'absolute', color:'#ef4444', textAlign:'center', padding:20, background:'rgba(0,0,0,0.8)', borderRadius:10}}>Error de señal<br/><a href={channel?.url} target="_blank" style={{color:'#3b82f6', fontSize:'0.8rem'}}>Abrir externo</a></div>}
            <video ref={videoRef} style={{width:'100%', height:'100%'}} controls crossOrigin="anonymous" muted={isMuted} />
            {onClose && <button onClick={onClose} style={{position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.5)', border:'none', color:'white', padding:8, borderRadius:'50%'}}><X/></button>}
        </div>
    );
};

// --- 3. APP PRINCIPAL ---
export default function App() {
  const [profiles, setProfiles] = useState(() => getFromStorage('iptv_v22_profiles', [{id:1, name:'Admin', color:'#3b82f6', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}]));
  const [activeProfile, setActiveProfile] = useState(null);
  const [playlists, setPlaylists] = useState(() => getFromStorage('iptv_v22_lists', [{id:'def', name:'TV Pública', url:'https://iptv-org.github.io/iptv/languages/spa.m3u', active:true, type:'url'}]));
  const [channels, setChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Player
  const [mainChannel, setMainChannel] = useState(null);
  const [secondaryChannel, setSecondaryChannel] = useState(null);
  const [activeSlot, setActiveSlot] = useState(1);
  
  // UI
  const [showModal, setShowModal] = useState(null); 
  const [toast, setToast] = useState(null);
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Load Data
  useEffect(() => {
    if(activeProfile) setFavorites(getFromStorage(`favs_${activeProfile.id}`, []));
  }, [activeProfile]);

  useEffect(() => { if(activeProfile) saveToStorage(`favs_${activeProfile.id}`, favorites); }, [favorites]);
  useEffect(() => { saveToStorage('iptv_v22_profiles', profiles); }, [profiles]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const loadPlaylist = async () => {
      if(!activeProfile) return;
      setChannels([]);
      const list = playlists.find(p => p.active) || playlists[0];
      try {
          let content = list.type === 'file' ? list.content : null;
          if(!content) {
              const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(list.url)}`);
              if(res.ok) content = await res.text();
              else throw new Error();
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
      } catch { showToast("Error cargando lista"); }
  };

  useEffect(() => { loadPlaylist(); }, [playlists, activeProfile]);

  const handleChannelClick = (ch) => {
      if(view === 'multiview') {
          if(activeSlot === 1) setMainChannel(ch); else setSecondaryChannel(ch);
      } else {
          setMainChannel(ch); setSecondaryChannel(null); setView('player');
      }
  };

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          const newList = {id: crypto.randomUUID(), name: file.name, type:'file', content: ev.target.result, active: true};
          setPlaylists(prev => [...prev.map(p=>({...p, active:false})), newList]);
          setShowModal(null);
          showToast("Lista importada");
      };
      reader.readAsText(file);
  };

  const saveProfile = () => {
      if(!editName) return;
      const newP = { id: editingProfile?.id || Date.now(), name: editName, color: '#3b82f6', avatar: editAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editName}` };
      if(editingProfile) {
          setProfiles(prev => prev.map(p => p.id === newP.id ? newP : p));
      } else {
          setProfiles(prev => [...prev, newP]);
      }
      setShowModal(null);
  };

  const filtered = useMemo(() => channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 500), [channels, searchTerm]);

  // Login View
  if(!activeProfile) return (
      <div className="profile-screen">
          <SafeStyles accentColor="#3b82f6"/>
          <h1 style={{color:'white', fontSize:'2.5rem', marginBottom:40}}>IPTV Cinema</h1>
          <div className="profile-grid">
              {profiles.map(p => (
                  <div key={p.id} style={{textAlign:'center', cursor:'pointer'}} onClick={() => {
                      if(isManaging) { setEditingProfile(p); setEditName(p.name); setEditAvatar(p.avatar); setShowModal('profile'); } 
                      else setActiveProfile(p);
                  }}>
                      <img src={p.avatar} style={{width:100, height:100, borderRadius:20, marginBottom:10, border: isManaging ? '2px dashed white' : 'none'}}/>
                      <div style={{color:'white'}}>{p.name}</div>
                      {isManaging && <div style={{color:'#ef4444', fontSize:'0.8rem'}}>Editar</div>}
                  </div>
              ))}
              <div style={{textAlign:'center', cursor:'pointer'}} onClick={() => { setEditingProfile(null); setEditName(''); setEditAvatar(''); setShowModal('profile'); }}>
                  <div style={{width:100, height:100, borderRadius:20, border:'2px dashed #666', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10}}><Plus color="#666"/></div>
                  <div style={{color:'#666'}}>Añadir</div>
              </div>
          </div>
          <button onClick={()=>setIsManaging(!isManaging)} style={{marginTop:50, padding:'10px 20px', background:'transparent', border:'1px solid #666', color:'#ccc', borderRadius:20, cursor:'pointer'}}>
              {isManaging ? 'Hecho' : 'Administrar Perfiles'}
          </button>

          {showModal === 'profile' && (
              <div className="modal-overlay">
                  <div className="modal-content">
                      <h3 style={{color:'white', marginBottom:20}}>{editingProfile ? 'Editar' : 'Nuevo'} Perfil</h3>
                      <div style={{display:'flex', gap:10, overflowX:'auto', paddingBottom:15, marginBottom:15}}>
                          {defaultAvatars.map(url => (
                              <img key={url} src={url} onClick={()=>setEditAvatar(url)} style={{width:50, height:50, borderRadius:10, cursor:'pointer', border: editAvatar===url?'2px solid #3b82f6':'none'}}/>
                          ))}
                      </div>
                      <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nombre" style={{width:'100%', padding:10, background:'#333', border:'none', color:'white', borderRadius:8, marginBottom:20}}/>
                      <div style={{display:'flex', gap:10}}>
                          <button onClick={()=>setShowModal(null)} style={{flex:1, padding:10, background:'transparent', border:'1px solid #666', color:'white', borderRadius:8, cursor:'pointer'}}>Cancelar</button>
                          {editingProfile && <button onClick={()=>{setProfiles(p=>p.filter(x=>x.id!==editingProfile.id)); setShowModal(null);}} style={{flex:1, padding:10, background:'#ef4444', border:'none', color:'white', borderRadius:8, cursor:'pointer'}}>Borrar</button>}
                          <button onClick={saveProfile} style={{flex:1, padding:10, background:'#3b82f6', border:'none', color:'white', borderRadius:8, cursor:'pointer'}}>Guardar</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  // Main View
  return (
      <div className="app-container">
          <SafeStyles accentColor={activeProfile.color}/>
          {toast && <Toast msg={toast}/>}
          
          <div className="sidebar">
              <img src={activeProfile.avatar} className="sidebar-avatar" onClick={()=>setActiveProfile(null)}/>
              <button className={`nav-btn ${view==='home'?'active':''}`} onClick={()=>setView('home')}><Home/></button>
              <button className={`nav-btn ${view==='list'?'active':''}`} onClick={()=>setView('list')}><Grid/></button>
              <button className={`nav-btn ${view==='favs'?'active':''}`} onClick={()=>setView('favs')}><Star/></button>
              <button className={`nav-btn ${view==='multiview'?'active':''}`} onClick={()=>setView('multiview')}><SplitSquareHorizontal/></button>
              <div style={{marginTop:'auto'}}>
                  <button className="nav-btn" onClick={()=>setShowModal('playlists')}><Layers/></button>
              </div>
          </div>

          <div className="content-area">
              <div className="top-bar">
                  <div className="search-box"><Search size={18} color="#999"/><input className="search-input" placeholder="Buscar..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
                  <div style={{color:'#999', fontSize:'0.8rem'}}>{playlists.find(p=>p.active)?.name}</div>
              </div>

              <div className="content-scroll" style={{flex:1, overflowY:'auto'}}>
                  {view === 'home' && (
                      <div className="grid-view">
                          <div style={{gridColumn:'1/-1', marginBottom:20}}>
                              <h1 style={{fontSize:'2rem', margin:0}}>Hola, {activeProfile.name}</h1>
                              <p style={{color:'#999'}}>Tienes {channels.length} canales disponibles.</p>
                          </div>
                          {favorites.length > 0 && <h3 style={{gridColumn:'1/-1', marginTop:20}}>Favoritos</h3>}
                          {favorites.map(ch => (
                             <div key={ch.id} className="channel-card" onClick={()=>handleChannelClick(ch)}>
                                 <div className="card-image">{ch.logo ? <img src={ch.logo}/> : <Tv/>}</div>
                                 <div className="card-info">{ch.name}</div>
                             </div>
                          ))}
                      </div>
                  )}

                  {(view === 'list' || view === 'favs') && (
                      <div className="grid-view">
                          {(view==='favs' ? favorites : filtered).map(ch => (
                              <div key={ch.id} className="channel-card" onClick={()=>handleChannelClick(ch)}>
                                 <div className="card-image">{ch.logo ? <img src={ch.logo}/> : <Tv/>}</div>
                                 <div className="card-info">{ch.name}</div>
                                 <button onClick={(e)=>{e.stopPropagation(); const exist=favorites.find(f=>f.id===ch.id); if(exist) setFavorites(p=>p.filter(x=>x.id!==ch.id)); else setFavorites(p=>[...p, ch])}} style={{position:'absolute', top:5, right:5, background:'rgba(0,0,0,0.5)', border:'none', color:favorites.find(f=>f.id===ch.id)?'yellow':'white', borderRadius:'50%', padding:5, cursor:'pointer'}}><Star size={14}/></button>
                              </div>
                          ))}
                      </div>
                  )}

                  {(view === 'player' || view === 'multiview') && (
                      <div className="player-overlay">
                          <div className="top-bar" style={{background:'#000', position:'relative'}}>
                              <button onClick={()=>setView('list')} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center', gap:5}}><ArrowLeft/> Salir</button>
                              {view === 'multiview' && (
                                  <div style={{display:'flex', gap:10}}>
                                      <button onClick={()=>setActiveSlot(1)} style={{padding:'5px 10px', background:activeSlot===1?activeProfile.color:'#333', border:'none', color:'white', borderRadius:5, cursor:'pointer'}}>Pantalla 1</button>
                                      <button onClick={()=>setActiveSlot(2)} style={{padding:'5px 10px', background:activeSlot===2?activeProfile.color:'#333', border:'none', color:'white', borderRadius:5, cursor:'pointer'}}>Pantalla 2</button>
                                  </div>
                              )}
                          </div>
                          
                          <div className={`player-body ${view === 'multiview' ? 'multi' : 'single'}`}>
                              <div className="video-container" style={{border: (view==='multiview' && activeSlot===1) ? `2px solid ${activeProfile.color}` : 'none'}} onClick={()=>setActiveSlot(1)}>
                                  <VideoPlayer channel={mainChannel} isMuted={view==='multiview' && activeSlot!==1}/>
                                  {!mainChannel && <div style={{position:'absolute', color:'#666'}}>Selecciona un canal</div>}
                              </div>
                              
                              {view === 'multiview' && (
                                  <div className="video-container" style={{border: activeSlot===2 ? `2px solid ${activeProfile.color}` : 'none'}} onClick={()=>setActiveSlot(2)}>
                                      <VideoPlayer channel={secondaryChannel} isMuted={activeSlot!==2} onClose={()=>setSecondaryChannel(null)}/>
                                      {!secondaryChannel && <div style={{position:'absolute', color:'#666'}}>Selecciona un canal</div>}
                                  </div>
                              )}

                              <div className="player-sidebar">
                                  <div style={{padding:10, borderBottom:'1px solid #333'}}><input placeholder="Cambiar canal..." style={{width:'100%', background:'#333', border:'none', padding:8, borderRadius:5, color:'white'}} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
                                  <div style={{flex:1, overflowY:'auto'}}>
                                      {filtered.slice(0,100).map(ch => (
                                          <div key={ch.id} onClick={()=>handleChannelClick(ch)} style={{padding:10, cursor:'pointer', borderBottom:'1px solid #333', fontSize:'0.9rem', color: mainChannel?.id===ch.id ? 'white' : '#aaa', fontWeight: mainChannel?.id===ch.id ? 'bold' : 'normal'}}>
                                              {ch.name}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {showModal === 'playlists' && (
              <div className="modal-overlay">
                  <div className="modal-content">
                      <h3>Gestionar Listas</h3>
                      <div style={{border:'2px dashed #666', padding:20, textAlign:'center', margin:'20px 0', borderRadius:10, cursor:'pointer', position:'relative'}}>
                          <input type="file" onChange={handleFileUpload} style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
                          <p>Subir archivo .m3u</p>
                      </div>
                      <div style={{marginBottom:20, maxHeight:150, overflowY:'auto'}}>
                          {playlists.map(p => (
                              <div key={p.id} onClick={()=>{setPlaylists(ls=>ls.map(l=>({...l, active:l.id===p.id}))); setShowModal(null);}} style={{padding:10, background:p.active?activeProfile.color:'#333', marginBottom:5, borderRadius:5, cursor:'pointer'}}>{p.name}</div>
                          ))}
                      </div>
                      <button onClick={()=>{const u=prompt("URL:"); if(u) {setPlaylists([...playlists, {id:crypto.randomUUID(), name:'Nueva URL', url:u, active:true, type:'url'}]); setShowModal(null);}}} style={{width:'100%', padding:10, background:'transparent', border:`1px solid ${activeProfile.color}`, color:activeProfile.color, borderRadius:8, cursor:'pointer'}}>+ Añadir URL</button>
                      <button onClick={()=>setShowModal(null)} style={{width:'100%', marginTop:10, padding:10, background:'transparent', border:'none', color:'#666', cursor:'pointer'}}>Cerrar</button>
                  </div>
              </div>
          )}
      </div>
  );
}