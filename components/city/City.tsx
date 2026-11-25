'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Camera, Car, Compass, Flag, Gauge, Map, Settings, Star, Volume2, VolumeX } from 'lucide-react';
import { bounds, columns, districts, pets, route, spawn, stamps, streets, type District, type DistrictId } from '@/lib/city';
import { emptyInput, type InputKey } from '@/lib/city-motion';
import type { Game, Preferences, Snapshot, Stats } from './engine';
import { startAudio } from './audio';
import { Portfolio } from './Portfolio';

const defaults:Preferences={quality:'medium',light:'cycle',audio:false,color:'#ff664d',seenIntro:false};
const paint=['#ff664d','#5cb6ff','#a994ff','#8ce2a4','#ffc556','#eef3ff'];
const initial:Snapshot={...spawn,speed:0,driving:true,near:null,pet:-1,night:false};
const directions:Record<string,InputKey>={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'brake'};
const aliases:Record<string,string>={education:'university',certifications:'achievements',about:'home'};
type Panel = 'map'|'settings'|'passport'|'photo'|'tutorial'|'destination'|'pet';
const prefKey='developer-world-preferences-v1', progressKey='developer-world-passport-v1';
function load(key:string):unknown { try{return JSON.parse(localStorage.getItem(key)??'null');}catch{return null;} }
function save(key:string,value:unknown) {try{localStorage.setItem(key,JSON.stringify(value));}catch{/* storage may be disabled */}}
function savedPrefs():Preferences{
  const p=load(prefKey) as Partial<Preferences>|null;
  return {
    quality:p?.quality==='low'||p?.quality==='high'?p.quality:defaults.quality,
    light:p?.light==='day'||p?.light==='night'?p.light:defaults.light,
    audio:p?.audio===true, color:paint.includes(p?.color??'')?p!.color!:defaults.color, seenIntro:p?.seenIntro===true,
  };
}
function CityMap({hud,goal,select}:{hud:Snapshot;goal?:District;select?:(d:District)=>void}){
  const height=bounds.bottom-bounds.top, width=bounds.right-bounds.left;
  const points=goal?route(hud,goal).map(p=>p.x+','+p.z).join(' '):'';
  return <svg viewBox={`${bounds.left} ${bounds.top} ${width} ${height}`} className="dw-minimap" role={select?'group':'img'} aria-label="City map">
    <rect x={bounds.left} y={bounds.top} width={width} height={height} fill="#123641"/>
    <rect x={bounds.left} y="-8" width={width} height="16" fill="#347a95"/>
    {streets.map(z=><path key={z} d={`M${bounds.left} ${z}H${bounds.right}`} stroke="#54727a" strokeWidth="5"/>)}
    {columns.map(x=><path key={x} d={`M${x} ${bounds.top}V${bounds.bottom}`} stroke="#54727a" strokeWidth="5"/>)}
    {points&&<polyline points={points} fill="none" stroke="#ffcf62" strokeWidth="1.9" strokeLinejoin="round"/>}
    {districts.map(d=><g key={d.id} role={select?'button':undefined} tabIndex={select?0:undefined} aria-label={d.name}
      onClick={select?()=>select(d):undefined} onKeyDown={select?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(d);}}:undefined}>
      <title>{d.name}</title><circle cx={d.x} cy={d.z} r={select?6:4} fill={d.color} stroke="#142c39" strokeWidth="1.2"/>
    </g>)}
    <path d="M0 -5L4 4L0 2L-4 4Z" fill="white" stroke="#102a3d" strokeWidth=".7" transform={`translate(${hud.x} ${hud.z}) rotate(${180-hud.angle*180/Math.PI})`}/>
  </svg>;
}

export function City(){
  const host=useRef<HTMLDivElement>(null), shell=useRef<HTMLElement>(null), dialog=useRef<HTMLDialogElement>(null);
  const game=useRef<Game|null>(null), input=useRef(emptyInput()), audio=useRef<ReturnType<typeof startAudio>|null>(null);
  const [hud,setHUD]=useState(initial), [stats,setStats]=useState<Stats>(), [prefs,setPrefs]=useState(defaults);
  const preferences=useRef(defaults), seen=useRef(new Set<DistrictId>());
  const [visited,setVisited]=useState<DistrictId[]>([]), [panel,setPanel]=useState<Panel|null>(null);
  const [selected,setSelected]=useState<District>(districts[0]), [goal,setGoal]=useState<District>();
  const [status,setStatus]=useState<'idle'|'loading'|'ready'|'error'>('idle'), [attempt,setAttempt]=useState(0);
  const [note,setNote]=useState(''), [pet,setPet]=useState(0), [angle,setAngle]=useState(1.3);
  const [stick,setStick]=useState({x:0,z:0});
  const noteTimer=useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hasIntro,setHasIntro]=useState(false);
  const previousFocus=useRef<HTMLElement|null>(null);

  const inform=useCallback((message:string)=>{
    setNote(message); clearTimeout(noteTimer.current);
    noteTimer.current=setTimeout(()=>setNote(''),3000);
  },[]);
  const visit=useCallback((id:DistrictId)=>{
    if(seen.current.has(id))return;
    seen.current.add(id); const list=Array.from(seen.current); setVisited(list); save(progressKey,list);
  },[]);
  const patch=useCallback((next:Partial<Preferences>)=>{
    const p={...preferences.current,...next}; preferences.current=p; setPrefs(p); save(prefKey,p); game.current?.settings(p);
    if(next.audio && !audio.current) {
      try{audio.current=startAudio();}
      catch{inform('Audio is unavailable in this browser.'); const muted={...p,audio:false}; preferences.current=muted; setPrefs(muted); save(prefKey,muted);}
    }
    if(next.audio===false)audio.current?.update(0,false,false,false);
  },[inform]);
  const open=useCallback((p:Panel)=>{Object.assign(input.current,emptyInput()); setStick({x:0,z:0});setPanel(p);},[]);
  const openDistrict=useCallback((d:District)=>{setSelected(d);visit(d.id);open('destination');},[open,visit]);
  useEffect(()=>{
    const p=savedPrefs();preferences.current=p;setPrefs(p);
    const values=load(progressKey);
    if(Array.isArray(values)){seen.current=new Set(districts.filter(d=>values.includes(d.id)).map(d=>d.id));setVisited(Array.from(seen.current));}
    const hash=location.hash.slice(1);
    if(aliases[hash])document.getElementById(aliases[hash])?.scrollIntoView();
    if(!hash||hash==='world')setAttempt(1);
    const enableSavedAudio=()=>{
      if(preferences.current.audio&&!audio.current){try{audio.current=startAudio();}catch{patch({audio:false});}}
    };
    document.addEventListener('pointerdown',enableSavedAudio);
    document.addEventListener('keydown',enableSavedAudio);
    const silence=()=>{Object.assign(input.current,emptyInput());setStick({x:0,z:0});if(document.hidden)audio.current?.update(0,false,false,false);};
    document.addEventListener('visibilitychange',silence);
    window.addEventListener('blur',silence);
    return ()=>{document.removeEventListener('pointerdown',enableSavedAudio);document.removeEventListener('keydown',enableSavedAudio);document.removeEventListener('visibilitychange',silence);window.removeEventListener('blur',silence);audio.current?.destroy();audio.current=null;clearTimeout(noteTimer.current);};
  },[patch]);
  useEffect(()=>{
    if(!attempt||!host.current)return;
    let cancelled=false, introTimer:ReturnType<typeof setTimeout>;
    let instance:Game|undefined, observer:IntersectionObserver|undefined;
    setStatus('loading');
    void import('./engine').then(({startWorld})=>{
      if(cancelled||!host.current)return;
      const intro=!preferences.current.seenIntro;
      instance=startWorld(host.current,input.current,preferences.current,{
        ready(){
          setStatus('ready');
          if(intro&&!preferences.current.seenIntro){
            setHasIntro(true);
            introTimer=setTimeout(()=>{
              if(preferences.current.seenIntro)return;
              setHasIntro(false);patch({seenIntro:true});
              if(visible.current&&!activePanel.current)open('tutorial');
            },3800);
          }
        },
        lost(){setStatus('error'); setHasIntro(false); audio.current?.update(0,false,false,false); clearTimeout(introTimer);},
        update(s){setHUD(s); audio.current?.update(s.speed,preferences.current.audio,s.driving,Math.abs(s.z)<15);},
        stats:setStats,open:openDistrict,visit,
        pet(index){setPet(index); open('pet');},note:inform,
      });
      game.current=instance;
      if(shell.current && 'IntersectionObserver' in window){
        observer=new IntersectionObserver(([entry])=>{
          visible.current=entry.isIntersecting;
          instance?.pause(!entry.isIntersecting||(Boolean(activePanel.current)&&activePanel.current!=='photo'));
          if(!entry.isIntersecting){Object.assign(input.current,emptyInput());audio.current?.update(0,false,false,false);}
        },{threshold:.08});
        observer.observe(shell.current);
      }
    }).catch(()=>{if(!cancelled)setStatus('error');});
    return ()=>{cancelled=true;clearTimeout(introTimer);observer?.disconnect();instance?.destroy();game.current=null;};
  },[attempt,inform,open,openDistrict,patch,visit]);
  const visible=useRef(true), activePanel=useRef<Panel|null>(null);
  useEffect(()=>{
    activePanel.current=panel;
    const el=dialog.current;
    if(panel&&!el?.open){previousFocus.current=document.activeElement as HTMLElement;el?.showModal();}
    if(!panel&&el?.open){el.close();previousFocus.current?.focus();}
    game.current?.pause(!visible.current||(Boolean(panel)&&panel!=='photo'));
    game.current?.photo(panel==='photo'?angle:null);
    if(panel&&panel!=='photo')audio.current?.update(0,false,false,false);
  },[panel,angle]);
  useEffect(()=>{
    const handle=(e:KeyboardEvent)=>{
      if(e.type==='keyup'){if(directions[e.code])input.current[directions[e.code]]=false;return;}
      if(!game.current||!visible.current||panel||e.altKey||e.ctrlKey||e.metaKey)return;
      const target=e.target as HTMLElement;
      if(target.closest('input,select,textarea,[contenteditable]'))return;
      if(!shell.current?.contains(target)&&target!==document.body&&target!==document.documentElement)return;
      if(target.closest('button,a')&&(e.code==='Space'||e.code.startsWith('Arrow')))return;
      const direction=directions[e.code];
      if(direction){ e.preventDefault(); input.current[direction]=true; }
      if(e.repeat)return;
      if(e.code==='KeyE')game.current.interact();
      if(e.code==='KeyF')game.current.vehicle();
      if(e.code==='KeyM')open('map');
      if(e.code==='Escape')open('settings');
      if(e.code==='KeyR'){game.current.travel();inform('Returned to the city entrance.');}
    };
    window.addEventListener('keydown',handle);window.addEventListener('keyup',handle);
    return ()=>{window.removeEventListener('keydown',handle);window.removeEventListener('keyup',handle);};
  },[panel,open,inform]);
  function skip(){game.current?.skip();setHasIntro(false);patch({seenIntro:true});}
  function teleport(){game.current?.travel(selected);setPanel(null);shell.current?.focus();}
  function chooseGPS(){setGoal(selected);game.current?.gps(selected);setPanel(null);shell.current?.focus();inform('GPS route set to '+selected.name+'.');}
  function joystick(e:PointerEvent<HTMLDivElement>){
    const rect=e.currentTarget.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dz=e.clientY-rect.top-rect.height/2;
    const factor=Math.min(1,32/(Math.hypot(dx,dz)||1));
    setStick({x:dx*factor,z:dz*factor});
    Object.assign(input.current,{up:dz<-11,down:dz>11,left:dx<-11,right:dx>11});
  }
  function releaseStick(){setStick({x:0,z:0});Object.assign(input.current,{up:false,down:false,left:false,right:false});}
  const near=districts.find(d=>d.id===hud.near);
  const title=panel==='destination'?selected.name:panel==='pet'?pets[pet].name:
    panel==='map'?'City map':panel==='settings'?'Settings':panel==='passport'?'Developer Passport':panel==='photo'?'Photo mode':'Driving tutorial';
  return <section id="world" ref={shell} tabIndex={0} className="dw-world" aria-label="Developer World driving game">
    <div ref={host} className="dw-canvas" onPointerDown={()=>shell.current?.focus({preventScroll:true})}/>
    <div className="dw-shade"/>
    <div className="dw-world-head">
      <div className="dw-world-title"><p className="dw-kicker"><Compass size={15}/> Pranesh Ramesh</p><h1>Developer World<span>.</span></h1><p className="dw-subtitle">Drive through Pranesh Ramesh’s software portfolio.</p></div>
      <div className="dw-toolbar" aria-label="Game tools">
        <button type="button" onClick={()=>open('map')} title="City map"><Map size={18}/><span>Map</span></button>
        <button type="button" onClick={()=>open('passport')} title="Passport"><Star size={18}/><span>Passport</span></button>
        <button type="button" onClick={()=>open('settings')} title="Settings"><Settings size={18}/><span>Settings</span></button>
      </div>
    </div>
    {status!=='ready'&&<div className="dw-loader" role="status">
      {status==='loading'?<><progress aria-label="Loading 3D city"/><span>Loading the city…</span></>:<>
        <strong>{status==='error'?'3D is unavailable':'Explore the city'}</strong>
        <button className="dw-button dw-primary" onClick={()=>setAttempt(n=>n+1)}>{status==='error'?'Retry 3D':'Start driving'}</button><a href="#recruiter">Open Recruiter Mode</a>
      </>}
    </div>}
    {status==='ready'&&<>
      <p className="dw-location"><span aria-hidden="true"/>{near?.name??(hud.z>7?'Southbank':hud.z< -7?'Northbank':'River crossing')}</p>
      <div className="dw-hud">
        <button className="dw-map-button" onClick={()=>open('map')} aria-label="Open city map"><CityMap hud={hud} goal={goal}/></button>
        <div className="dw-speed" aria-label={Math.round(hud.speed)+' kilometres per hour'}><Gauge size={19}/><strong>{Math.round(hud.speed)}</strong><span>km/h</span><i style={{width:Math.min(100,hud.speed/86*100)+'%'}} aria-hidden="true"/></div>
      </div>
      <div className="dw-game-actions">
        <button onClick={()=>{game.current?.vehicle();shell.current?.focus();}}><Car size={17}/>{hud.driving?'Exit car':'Enter car'}</button>
        <button onClick={()=>{game.current?.interact();shell.current?.focus();}}><Flag size={17}/>{hud.pet>=0?'Pet':near?'Talk':'Interact'}</button>
        <button title="Photo mode" aria-label="Photo mode" onClick={()=>{setAngle(hud.angle+.8);open('photo');}}><Camera size={17}/></button>
      </div>
      {goal&&<div className="dw-gps"><Flag size={15}/>{goal.name}<button aria-label="Clear GPS" onClick={()=>{setGoal(undefined);game.current?.gps();}}>×</button></div>}
      <div className="dw-control-hint"><kbd>WASD</kbd> Drive <kbd>Space</kbd> Brake <kbd>F</kbd> Exit <kbd>E</kbd> Talk</div>
      <div className="dw-touch">
        <div className="dw-stick" aria-label="Touch joystick" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);joystick(e);}}
          onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))joystick(e);}} onPointerUp={releaseStick} onPointerCancel={releaseStick} onLostPointerCapture={releaseStick}>
          <span style={{transform:`translate(${stick.x}px,${stick.z}px)`}}/>
        </div>
        <button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);input.current.brake=true;}}
          onPointerUp={()=>{input.current.brake=false;}} onPointerCancel={()=>{input.current.brake=false;}} onLostPointerCapture={()=>{input.current.brake=false;}}>Brake</button>
      </div>
    </>}
    {hasIntro&&<button className="dw-skip dw-button" onClick={skip}>Skip intro</button>}
    {note&&<p className="dw-toast" role="status">{note}</p>}
    <dialog ref={dialog} aria-labelledby="dw-dialog-title" className={panel==='photo'?'dw-dialog dw-photo':'dw-dialog'} onCancel={e=>{e.preventDefault();setPanel(null);}} onClick={e=>{if(e.target===e.currentTarget)setPanel(null);}}>
      <div className="dw-dialog-inner">
        <div className="dw-dialog-head"><h2 id="dw-dialog-title">{title}</h2><button aria-label="Close panel" onClick={()=>setPanel(null)}>×</button></div>
        {panel==='map'&&<>
          <div className="dw-map-layout"><CityMap hud={hud} goal={goal} select={setSelected}/>
            <div className="dw-district-list">{districts.map(d=><button key={d.id} aria-pressed={selected.id===d.id} style={{'--district':d.color} as CSSProperties} onClick={()=>setSelected(d)}>{d.name}</button>)}</div>
          </div>
          <div className="dw-actions"><button onClick={()=>openDistrict(selected)}>Open {selected.name}</button><button disabled={status!=='ready'} onClick={chooseGPS}>Set GPS</button><button disabled={status!=='ready'} className="dw-button dw-primary" onClick={teleport}>Fast travel</button></div>
        </>}
        {panel==='destination'&&<><blockquote><strong>{selected.host}</strong><p>“{selected.line}”</p></blockquote><Portfolio id={selected.id}/><div className="dw-actions"><a href={'#'+selected.id} onClick={()=>setPanel(null)}>Open shareable section</a>{selected.id==='garage'&&<button onClick={()=>open('settings')}>Customize car</button>}</div></>}
        {panel==='pet'&&<p>{pets[pet].line}</p>}
        {panel==='tutorial'&&<><Portfolio id="garage"/><div className="dw-actions"><button className="dw-button dw-primary" onClick={()=>setPanel(null)}>Start driving</button><a href="#recruiter" onClick={()=>setPanel(null)}>Recruiter Mode</a></div></>}
        {panel==='passport'&&<>
          <label className="dw-passport">{visited.length} of {districts.length} destinations visited<progress max={districts.length} value={visited.length}/></label>
          <ul className="dw-stamps">{stamps.map(([id,label])=><li key={id}>{visited.includes(id)?'✓':'○'} {label}</li>)}<li>{visited.length===districts.length?'✓':'○'} World Explorer</li></ul>
        </>}
        {panel==='settings'&&<>
          <div className="dw-settings">
            <label>Graphics<select aria-label="Graphics" value={prefs.quality} onChange={e=>patch({quality:e.target.value as Preferences['quality']})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
            <label>Lighting<select aria-label="Lighting" value={prefs.light} onChange={e=>patch({light:e.target.value as Preferences['light']})}><option value="cycle">Day / night cycle</option><option value="day">Day</option><option value="night">Night</option></select></label>
            <button aria-pressed={prefs.audio} onClick={()=>patch({audio:!prefs.audio})}>{prefs.audio?<Volume2 size={17}/>:<VolumeX size={17}/>} Audio {prefs.audio?'on':'off'}</button>
          </div>
          <fieldset className="dw-paint"><legend>Supercar paint</legend>{paint.map((c,i)=><button key={c} aria-label={['Coral','Sky blue','Lavender','Mint','Gold','White'][i]} aria-pressed={prefs.color===c} style={{background:c}} onClick={()=>patch({color:c})}/>)}</fieldset>
          <div className="dw-actions"><button onClick={()=>open('tutorial')}>Controls</button><button onClick={()=>open('map')}>Navigation</button><button disabled={status!=='ready'} onClick={()=>{game.current?.travel();setPanel(null);}}>Reset vehicle</button></div>
          {stats&&<p className="dw-stats" data-testid="world-performance">{stats.fps} FPS · worst frame {stats.frame} ms · {stats.draws} draws · {stats.triangles} triangles · {stats.scale}× render scale</p>}
        </>}
        {panel==='photo'&&<>
          <label className="dw-search">Camera angle<input type="range" min="-3.15" max="9.43" step=".04" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
          <button className="dw-button dw-primary" onClick={()=>{const url=game.current?.capture();if(url){const a=document.createElement('a');a.href=url;a.download='developer-world.png';a.click();}}}>Download photo</button>
        </>}
      </div>
    </dialog>
  </section>;
}
