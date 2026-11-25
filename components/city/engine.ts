import * as T from 'three';
import { districts, distance, entrance, parkedCars, pets, route, secret, spawn, type District, type DistrictId, type Point } from '@/lib/city';
import { createMotion, enterExit, step, teleport, type Inputs } from '@/lib/city-motion';
import { bakeParked, car, disposeWorld, person, town, wildlife } from './models';

export type Preferences = { quality:'low'|'medium'|'high'; light:'cycle'|'day'|'night'; audio:boolean; color:string; seenIntro:boolean };
export type Stats = { fps:number; frame:number; draws:number; triangles:number; scale:number };
export type Snapshot = Point & { angle:number; speed:number; driving:boolean; near:DistrictId|null; pet:number; night:boolean };
export type Game = {
  destroy:()=>void; interact:()=>void; vehicle:()=>void; travel:(d?:District)=>void;
  settings:(p:Preferences)=>void; gps:(d?:District)=>void; pause:(v:boolean)=>void;
  photo:(angle:number|null)=>void; capture:()=>string; skip:()=>void;
};
type Events = {
  ready:()=>void; lost:()=>void; update:(s:Snapshot)=>void; stats:(s:Stats)=>void;
  open:(d:District)=>void; visit:(id:DistrictId)=>void; pet:(index:number)=>void; note:(text:string)=>void;
};

export function startWorld(host:HTMLElement, input:Inputs, prefs:Preferences, events:Events):Game {
  const renderer=new T.WebGLRenderer({antialias:prefs.quality==='high',powerPreference:'low-power'});
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene=new T.Scene();
  const daySky=new T.Color('#b6dbe6'), nightSky=new T.Color('#283157');
  const sky=daySky.clone(); scene.background=sky;
  scene.fog=new T.Fog(sky,45,115);
  const camera=new T.PerspectiveCamera(52,1,.16,165);
  const overhead=new T.HemisphereLight('#edf9ff','#ad8d6a',2.25); scene.add(overhead);
  const sun=new T.DirectionalLight('#fff1d3',2.6); sun.position.set(-28,48,39); scene.add(sun);
  const city=town(); scene.add(city.root);
  const motion=createMotion(), vehicle=car(prefs.color), driver=person('#57c3b0','#b77c56');
  scene.add(vehicle.root,driver.root);
  for(const {x,z,color} of parkedCars){
    const parked=car(color);
    parked.root.position.set(x,.11,z); parked.root.rotation.y=Math.PI/2; parked.lights.visible=false;
    const model=bakeParked(parked.root);
    if(model)scene.add(model);
    parked.paint.dispose();
  }
  const landlords=districts.map((d,i)=>{
    const p=person(d.color,['#9b654b','#cf956a','#e1aa82','#7c4d39'][i%4],i);
    const place=entrance(d); p.root.position.set(place.x+1.2,.25,place.z);
    scene.add(p.root); return p;
  });
  const crowds=Array.from({length:12},(_,i)=>{
    const p=person(['#df8b9d','#5a7fc1','#e2a960','#62ad90'][i%4],i%2?'#b98769':'#e1aa82',i);
    scene.add(p.root); return p;
  });
  const animals=Array.from({length:8},(_,i)=>{const p=wildlife(i<2?i:i===2?2:i%2?3:4); scene.add(p.root); return p;});
  const pinMat=new T.MeshBasicMaterial({color:'#fff39a'});
  const pinGeo=new T.OctahedronGeometry(.6);
  const pins=districts.map(d=>{
    const p=entrance(d); const pin=new T.Mesh(pinGeo,pinMat); pin.position.set(p.x,3.3,p.z); scene.add(pin); return pin;
  });
  const routeMaterial=new T.MeshBasicMaterial({color:'#ffdf58'});
  const routeSegments=Array.from({length:7},()=>{
    const m=new T.Mesh(new T.BoxGeometry(1,.045,.31),routeMaterial); m.visible=false; scene.add(m); return m;
  });
  const shadow=new T.Mesh(new T.CircleGeometry(1,16),new T.MeshBasicMaterial({color:'#172b36',transparent:true,opacity:.26,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2; shadow.scale.set(1.4,2.35,1); scene.add(shadow);
  const target=new T.Vector3(), desired=new T.Vector3(), look=new T.Vector3(), droplet=new T.Object3D();
  camera.position.set(spawn.x+11,13,spawn.z+12);
  const gl=renderer.getContext();
  const rendererInfo=gl.getExtension('WEBGL_debug_renderer_info');
  const device=rendererInfo?String(gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL)):'';
  const software=/swiftshader|llvmpipe|software/i.test(device);
  let quality=software?.68:1, paused=false, photo:number|null=null, routeTarget:District|undefined;
  let time=0, intro=prefs.seenIntro?0:3.4, first=true, raf=0, last=0, nextHUD=0, nextGPS=0, previousVisit:DistrictId|null=null;
  let frames=0, sample=0, frameWorst=0, adaptiveCooldown=0, disposed=false, contextLost=false;
  let latestNear:District|undefined, latestPet=-1, atSecret=false;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)intro=0;

  let needsResize=true;
  const resize=()=>{needsResize=true;};
  const applySize=()=>{
    if(!needsResize||!host.clientWidth||!host.clientHeight)return;
    needsResize=false;
    const max=prefs.quality==='high'?1.55:prefs.quality==='low'?.85:1.16;
    const cap=Math.sqrt(950000/(host.clientWidth*host.clientHeight));
    renderer.setPixelRatio(Math.min(devicePixelRatio,max,cap)*quality);
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    camera.aspect=host.clientWidth/host.clientHeight;
    const shortView=prefs.quality==='low'||quality<.58;
    camera.far=shortView?83:165;
    (scene.fog as T.Fog).near=shortView?37:45;
    (scene.fog as T.Fog).far=shortView?78:115;
    camera.updateProjectionMatrix();
  };
  const observer=new ResizeObserver(resize); observer.observe(host); resize();
  const animatePerson=(p:ReturnType<typeof person>, stride:number, amount:number)=>{
    const swing=Math.sin(stride)*amount;
    p.legs[0].rotation.x=swing; p.legs[1].rotation.x=-swing;
    p.arms[0].rotation.x=-swing*.75; p.arms[1].rotation.x=swing*.75;
  };
  const refreshRoute=(point:Point)=>{
    const line=routeTarget?route(point,routeTarget):[];
    routeSegments.forEach((m,i)=>{
      const a=line[i],b=line[i+1]; m.visible=Boolean(a&&b);
      if(!a||!b)return;
      m.position.set((a.x+b.x)/2,.17,(a.z+b.z)/2);
      m.scale.x=distance(a,b); m.rotation.y=-Math.atan2(b.z-a.z,b.x-a.x);
    });
  };
  const paintFrame=(dt:number)=>{
    applySize();
    const pose=motion.driving?motion.car:motion.player;
    const night=prefs.light==='night'?1:prefs.light==='day'?0:(1-Math.cos(time*.024))/2;
    sky.copy(daySky).lerp(nightSky,night);
    (scene.fog as T.Fog).color.copy(sky);
    overhead.intensity=2.15-night*1.48; sun.intensity=2.55-night*2.39;
    city.bulbs.emissiveIntensity=.03+night*1.65; city.water.uniforms.time.value=reduced?0:time;
    vehicle.lights.visible=night>.43;
    vehicle.root.position.set(motion.car.x,.12,motion.car.z); vehicle.root.rotation.y=motion.car.angle;
    shadow.position.set(motion.car.x,.19,motion.car.z); shadow.rotation.z=motion.car.angle;
    vehicle.wheels.forEach(({pivot,roller},i)=>{roller.rotation.x=motion.wheels; pivot.rotation.y=i%2?motion.steering*.32:0;});
    driver.root.visible=!motion.driving; driver.root.position.set(motion.player.x,.12,motion.player.z);
    driver.root.rotation.y=motion.player.angle;
    animatePerson(driver,motion.stride,motion.velocity ? .68 : 0);
    if(!paused && photo===null) {
      city.clouds.forEach((c,i)=>{c.position.x=-65+((15+i*29+time*.65)%160);});
      city.spray.visible=distance({x:60,z:-30},pose)<52;
      if(city.spray.visible){
        for(let i=0;i<city.spray.count;i++){
          const phase=(time*.75+i/city.spray.count)%1;
          droplet.position.set(60+Math.cos(i*2.4)*phase*1.2,1.1+Math.sin(phase*Math.PI)*1.15,-30+Math.sin(i*2.4)*phase*1.2);
          droplet.scale.set(.11,.2,.11); droplet.updateMatrix();
          city.spray.setMatrixAt(i,droplet.matrix);
        }
        city.spray.instanceMatrix.needsUpdate=true;
      }
      city.foliage.forEach((leaf,i)=>{leaf.rotation.z=reduced?0:Math.sin(time*1.15+i)*.035;});
      landlords.forEach((p,i)=>{
        p.root.visible=distance({x:p.root.position.x,z:p.root.position.z},pose)<50;
        if(!p.root.visible)return;
        p.root.rotation.y=Math.sin(time*.6+i)*.25;
        p.arms[1].rotation.z=-.12-Math.max(0,Math.sin(time*1.55+i))**8*.82;
      });
      crowds.forEach((p,i)=>{
        const x=[-38,-8,22,52,68][i%5], baseZ=i%2===0?-43:38;
        const sitting=i===8;
        const walking=i%4!==0;
        const phase=time*.21+i*1.7;
        p.root.position.set(sitting?53:x,sitting?-.26:.22,sitting?-22.8:baseZ+(walking?Math.sin(phase)*6:0));
        p.root.visible=i<(quality<.8||prefs.quality==='low'?5:12) && distance({x:p.root.position.x,z:p.root.position.z},pose)<42;
        if(!p.root.visible)return;
        p.root.rotation.y=Math.cos(phase)>0?0:Math.PI;
        animatePerson(p,time*5+i,walking?.45:.04);
        if(sitting){p.legs[0].rotation.x=-1.11;p.legs[1].rotation.x=-1.08;}
      });
      animals.forEach((p,i)=>{
        const base=pets[i], a=time*(i<3?.73:.98)+i*1.3;
        const x=base?.x??62, z=base?.z??-45, span=i<2?.75:i===2?1.2:10+i;
        p.root.position.set(x+Math.cos(a)*span,i<2?.21:i===2?.11:i%2?5+i*.23:.95+Math.sin(time+i)*.28,z+Math.sin(a)*span*.7);
        p.root.rotation.y=-a;
        p.root.visible=distance({x,z},pose)<61&&(i<3||quality>.72);
        if(p.root.visible)p.limbs.forEach((limb,j)=>{if(i<2)limb.rotation.x=Math.sin(time*6+j*Math.PI/2)*.46;else limb.rotation.z=(j?1:-1)*Math.sin(time*(i===2?3:11))*.66;});
      });
      pins.forEach((pin,i)=>{pin.position.y=3.2+Math.sin(time*2+i)*.24; pin.rotation.y=time*.72;});
    }
    target.set(pose.x,motion.driving?1.25:1.55,pose.z);
    const aim=photo??pose.angle;
    const behind=motion.driving?10.8:6.9;
    const introOrbit=intro>0?intro*.56:0;
    desired.set(pose.x-Math.sin(aim+introOrbit)*(behind+intro*5),motion.driving?6.7+intro*4.6:4.1,pose.z-Math.cos(aim+introOrbit)*(behind+intro*5));
    look.copy(target);
    if(photo===null){look.x+=Math.sin(aim)*4.4; look.z+=Math.cos(aim)*4.4;}
    camera.position.lerp(desired,first?1:1-Math.exp(-dt*(photo===null?6.5:12)));
    camera.lookAt(look); renderer.render(scene,camera);
    if(first){first=false;events.ready();}
  };
  const halt=()=>{cancelAnimationFrame(raf);raf=0;last=0;frames=0;sample=0;frameWorst=0;};
  const wake=()=>{if(!raf&&!disposed&&!contextLost&&!document.hidden&&(!paused||photo!==null||first))raf=requestAnimationFrame(tick);};
  const sync=()=>{if(document.hidden||(paused&&photo===null&&!first))halt();else wake();};
  const tick=(now:number)=>{
    raf=0;
    if(disposed||contextLost||document.hidden||(paused&&photo===null&&!first))return;
    const elapsed=last?now-last:16.67; last=now;
    const dt=Math.min(.16,elapsed/1000);
    if(!paused && photo===null) {
      if(input.up||input.down||input.left||input.right)intro=0;
      intro=Math.max(0,intro-dt);
      time+=dt;
      const steps=Math.max(1,Math.ceil(dt/.032));
      for(let i=0;i<steps;i++)step(motion,input,dt/steps);
    }
    const pose=motion.driving?motion.car:motion.player;
    if(now>nextGPS){nextGPS=now+230; refreshRoute(pose);}
    if(now>nextHUD){
      nextHUD=now+100;
      latestNear=districts.find(d=>distance(entrance(d),pose)<8);
      latestPet=animals.slice(0,3).findIndex(a=>!motion.driving&&distance({x:a.root.position.x,z:a.root.position.z},pose)<3.2);
      if(latestNear && previousVisit!==latestNear.id)events.visit(latestNear.id);
      atSecret=!motion.driving&&distance(secret,pose)<3.1;
      previousVisit=latestNear?.id??null;
      events.update({...pose, speed:Math.abs(motion.velocity)*3.6,driving:motion.driving,near:previousVisit,pet:latestPet,night:prefs.light==='night'||(prefs.light==='cycle'&&Math.cos(time*.024)<.12)});
    }
    paintFrame(dt);
    frames++; sample+=elapsed; frameWorst=Math.max(frameWorst,elapsed);
    if(sample>=1200){
      const fps=1000*frames/sample;
      events.stats({fps:Math.round(fps),frame:Math.round(frameWorst),draws:renderer.info.render.calls,triangles:renderer.info.render.triangles,scale:Math.round(renderer.getPixelRatio()*100)/100});
      if(now>adaptiveCooldown){
        const next=fps<33 ? Math.max(.33,quality*(fps<19?.72:.86)) : fps>55 ? Math.min(1,quality+.08):quality;
        if(next!==quality){quality=next; resize(); adaptiveCooldown=now+1300;}
      }
      frames=0; sample=0; frameWorst=0;
    }
    wake();
  };
  const onLoss=(e:Event)=>{e.preventDefault();contextLost=true;halt();events.lost();};
  renderer.domElement.addEventListener('webglcontextlost',onLoss);
  document.addEventListener('visibilitychange',sync);
  wake();
  return {
    destroy(){disposed=true;halt();document.removeEventListener('visibilitychange',sync);observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',onLoss);disposeWorld(scene);renderer.dispose();renderer.domElement.remove();},
    interact(){
      if(atSecret){events.note(secret.name+': '+secret.line);return;}
      if(latestPet!==-1){events.pet(latestPet);return;}
      if(latestNear){events.open(latestNear);return;}
      events.note('Follow a destination pin or open the city map.');
    },
    vehicle(){events.note(enterExit(motion));},
    travel(d){teleport(motion,d); intro=0; first=true; if(d)events.visit(d.id);},
    settings(value){const changed=prefs.quality!==value.quality; prefs=value;vehicle.paint.color.set(prefs.color);if(changed){quality=software?.68:1;resize();}},
    gps(d){routeTarget=d;refreshRoute(motion.driving?motion.car:motion.player);},
    pause(value){paused=value;sync();},
    photo(angle){photo=angle;sync();},
    capture(){paintFrame(1);return renderer.domElement.toDataURL('image/png');},
    skip(){intro=0;},
  };
}
