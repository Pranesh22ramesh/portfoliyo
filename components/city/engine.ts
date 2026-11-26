import * as T from 'three';
import { blocked, districts, distance, entrance, lookoutHeight, parkedCars, pets, secret, spawn, type District, type DistrictId, type Point } from '@/lib/city';
import { roadRoute as route } from '@/lib/city-route';
import { neighbors, type Neighbor } from '@/lib/neighbors';
import { createMotion, enterExit, jump, step, teleport, type Inputs, type Motion } from '@/lib/city-motion';
import { advanceTraffic, createTraffic, trafficSolid } from '@/lib/traffic';
import { createSignals } from './traffic-visual';
import { makeRoom } from './interior';
import { roomBlocked,type RoomId } from '@/lib/rooms';
import { makeContactShadows, skyDome } from './lighting';
import { bakeParked, car, compactCar, disposeWorld, person, town, wildlife, type CharacterRig } from './models';

export type Preferences = { quality:'low'|'medium'|'high'; light:'cycle'|'day'|'night'; audio:boolean; color:string; seenIntro:boolean };
export type Stats = { fps:number; frame:number; draws:number; triangles:number; scale:number };
export type Snapshot = Point & { angle:number; speed:number; driving:boolean; near:DistrictId|null; neighbor:number; pet:number; night:boolean; height:number; room:RoomId|null; pace:'idle'|'walk'|'run'|'sprint'|'airborne' };
export type Game = {
  destroy:()=>void; interact:()=>void; vehicle:()=>void; travel:(d?:District)=>void;
  settings:(p:Preferences)=>void; gps:(d?:District)=>void; pause:(v:boolean)=>void;
  jump:()=>void; look:(radians:number)=>void; enterRoom:(id:RoomId)=>void; exitRoom:()=>void;
  photo:(angle:number|null,zoom?:number)=>void; capture:()=>string; skip:()=>void;
};
type Events = {
  ready:()=>void; lost:()=>void; update:(s:Snapshot)=>void; stats:(s:Stats)=>void;
  open:(d:District)=>void; visit:(id:DistrictId)=>void; pet:(index:number)=>void; neighbor:(person:Neighbor)=>void; note:(text:string)=>void;
};

export function startWorld(host:HTMLElement, input:Inputs, prefs:Preferences, events:Events):Game {
  const renderer=new T.WebGLRenderer({antialias:prefs.quality==='high',powerPreference:'low-power'});
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.14;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene=new T.Scene();
  const daySky=new T.Color('#c9d0b9'), nightSky=new T.Color('#303e59');
  const sky=daySky.clone(); scene.background=sky;
  scene.fog=new T.Fog(sky,43,112);
  const atmosphere=skyDome();scene.add(atmosphere);
  const camera=new T.PerspectiveCamera(52,1,.16,165);
  const overhead=new T.HemisphereLight('#dbe6ea','#a78c69',1.79); scene.add(overhead);
  const sun=new T.DirectionalLight('#ffe0aa',2.7); sun.position.set(-28,36,39); scene.add(sun);
  const gl=renderer.getContext();
  const rendererInfo=gl.getExtension('WEBGL_debug_renderer_info');
  const device=rendererInfo?String(gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL)):'';
  const software=/swiftshader|llvmpipe|software/i.test(device);
  const city=town(!software); scene.add(city.root);
  const motion=createMotion(), vehicle=car(prefs.color,true), driver=person('#368481','#b77c56',2);
  scene.add(vehicle.root,driver.root);
  const cars=createTraffic();
  const outdoorSolid=(x:number,z:number,radius:number)=>blocked(x,z,radius)||trafficSolid(cars,x,z,radius);
  const streetSignals=createSignals();
  scene.add(streetSignals.mesh);
  const trafficMeshes=cars.map(state=>{
    if(software){
      const mesh=bakeParked(compactCar(state.color));
      if(mesh){scene.add(mesh);return {object:mesh,rig:null};}
    }
    const rig=car(state.color);
    rig.root.scale.set(state.trim===1?.92:.96,state.trim===1?1.2:1,state.trim===2?1.05:.95);
    scene.add(rig.root);
    return {object:rig.root,rig};
  });
  for(const {x,z,color} of parkedCars){
    const parked=software?null:car(color);
    const root=parked?.root??compactCar(color);
    root.position.set(x,.11,z); root.rotation.y=Math.PI/2;
    const model=bakeParked(root);
    if(model)scene.add(model);
    parked?.paint.dispose();
  }
  const landlords=districts.map((d,i)=>{
    const p=person(d.color,['#9b654b','#cf956a','#e1aa82','#7c4d39'][i%4],i);
    const place=entrance(d); p.root.position.set(place.x+1.2,.25,place.z);
    scene.add(p.root); return p;
  });
  const crowds=neighbors.map(n=>{
    const p=person(n.color,n.skin,n.outfit);
    p.root.position.set(n.x,.14,n.z);
    scene.add(p.root); return p;
  });
  const animals=Array.from({length:8},(_,i)=>{const p=wildlife(i<2?i:i===2?2:i%2?3:4); scene.add(p.root); return p;});
  const shadowActors=[...landlords,...crowds,...animals];
  const pinMat=new T.MeshBasicMaterial({color:'#fff39a'});
  const pinGeo=new T.TorusGeometry(.43,.078,6,16);
  const pins=districts.map(d=>{
    const p=entrance(d); const pin=new T.Mesh(pinGeo,pinMat); pin.position.set(p.x,3.3,p.z); scene.add(pin); return pin;
  });
  const routeMaterial=new T.MeshBasicMaterial({color:'#ffdf58'});
  const routeSegments=Array.from({length:24},()=>{
    const m=new T.Mesh(new T.BoxGeometry(1,.045,.31),routeMaterial); m.visible=false; scene.add(m); return m;
  });
  const shadows=makeContactShadows(2+parkedCars.length+landlords.length+crowds.length+animals.length);
  scene.add(shadows);
  const shadowMatrix=new T.Object3D();
  function shadowAt(index:number,x:number,z:number,w:number,l:number,heading=0,y=.147,mesh=shadows){
    shadowMatrix.position.set(x,y,z);
    shadowMatrix.rotation.set(-Math.PI/2,0,-heading);
    shadowMatrix.scale.set(w,l,1);
    shadowMatrix.updateMatrix();
    mesh.setMatrixAt(index,shadowMatrix.matrix);
  }
  const target=new T.Vector3(), desired=new T.Vector3(), look=new T.Vector3(), droplet=new T.Object3D();
  camera.position.set(spawn.x+11,13,spawn.z+12);
  let quality=software?.43:1, paused=false, photo:number|null=null, photoZoom=1, routeTarget:District|undefined;
  let room:{id:RoomId;saved:Motion;view:ReturnType<typeof makeRoom>}|undefined;
  let cameraYaw=0,signalTick=-1;
  let time=0, intro=prefs.seenIntro?0:3.4, first=true, raf=0, last=0, nextHUD=0, nextGPS=0, previousVisit:DistrictId|null=null;
  let frames=0, sample=0, frameWorst=0, adaptiveCooldown=0, disposed=false, contextLost=false;
  let latestNear:District|undefined, latestPet=-1, latestNeighbor=-1, atSecret=false;
  let reflections:T.Texture|undefined,paintNormal:T.Texture|undefined;
  const meshRequest=new AbortController();
  const upgradeVehicle=()=>{
    void import('./roadster').then(async ({loadRoadster,roadsterReflections,paintMicroNormal})=>{
      if(disposed||contextLost)return;
      const next=await loadRoadster(meshRequest.signal);
      if(disposed||contextLost){next.body.dispose();next.glass.dispose();next.roof.dispose();return;}
      vehicle.paintShell.geometry=next.body;
      vehicle.paintedRoof.geometry=next.roof;
      vehicle.paintedRoof.position.set(0,0,0);
      vehicle.paintedRoof.scale.setScalar(1);
      if(vehicle.windscreen){
        vehicle.windscreen.geometry=next.glass;
        vehicle.windscreen.material.opacity=.44;
      }
      if(!software&&prefs.quality!=='low'){
        reflections=roadsterReflections();
        paintNormal=paintMicroNormal();
        vehicle.paint.normalMap=paintNormal;
        vehicle.paint.normalScale.set(.36,.36);
        vehicle.paint.envMap=reflections;
        vehicle.paint.envMapIntensity=.70;
        vehicle.paint.needsUpdate=true;
      }
      renderer.domElement.dataset.roadster='gltf';
    }).catch(error=>{
      if(!meshRequest.signal.aborted)console.warn('Using the built-in roadster model.',error);
    });
  };
  const assetTimer=window.setTimeout(upgradeVehicle,500);
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
    camera.far=shortView?(software?69:83):165;
    (scene.fog as T.Fog).near=shortView?37:45;
    (scene.fog as T.Fog).far=shortView?(software?65:78):115;
    camera.updateProjectionMatrix();
  };
  const observer=new ResizeObserver(resize); observer.observe(host); resize();
  const animatePerson=(p:CharacterRig, stride:number, amount:number)=>{
    const swing=Math.sin(stride)*amount;
    p.legs[0].rotation.x=swing; p.legs[1].rotation.x=-swing;
    p.arms[0].rotation.x=-swing*.64; p.arms[1].rotation.x=swing*.64;
    p.knees[0].rotation.x=Math.max(0,swing)*.59;
    p.knees[1].rotation.x=Math.max(0,-swing)*.59;
    p.elbows[0].rotation.x=-Math.abs(swing)*.4;
    p.elbows[1].rotation.x=-Math.abs(swing)*.4;
    p.head.rotation.z=swing*.08;
  };
  const refreshRoute=(point:Point)=>{
    const line=routeTarget?route(point,routeTarget):[];
    routeSegments.forEach((m,i)=>{
      const a=line[i],b=line[i+1]; m.visible=Boolean(a&&b);
      if(!a||!b)return;
      m.position.set((a.x+b.x)/2,.171,(a.z+b.z)/2);
      m.scale.x=distance(a,b); m.rotation.y=-Math.atan2(b.z-a.z,b.x-a.x);
    });
  };
  const playerPose=()=>{
    driver.root.visible=!motion.driving;
    driver.root.position.set(motion.player.x,(room?0:.12+lookoutHeight(motion.player.x,motion.player.z))+motion.height,motion.player.z);
    driver.root.rotation.y=motion.player.angle;
    const rig=driver.setDetail(!motion.driving);
    if(!rig)return;
    const speed=Math.abs(motion.velocity);
    animatePerson(rig,motion.stride,speed<.1?.018:Math.min(.83,.3+speed*.062));
    if(motion.height>.045){
      rig.legs[0].rotation.x=-.48;rig.legs[1].rotation.x=.19;
      rig.knees[0].rotation.x=.94;rig.knees[1].rotation.x=.61;
      rig.arms[0].rotation.x=-.42;rig.arms[1].rotation.x=-.30;
    }else if(speed<.1){
      rig.head.rotation.y=reduced?0:Math.sin(time*.94)*.07;
      driver.root.position.y+=reduced?0:Math.sin(time*2)*.014;
    }else rig.head.rotation.y=0;
  };
  const paintFrame=(dt:number)=>{
    applySize();
    playerPose();
    if(room){
      const walk=motion.player,aim=photo??(walk.angle+cameraYaw);
      const radius=photo===null?4.5:4.5/photoZoom;
      const clamp=T.MathUtils.clamp;
      desired.set(clamp(walk.x-Math.sin(aim)*radius,-5.28,5.28),2.61+motion.height*.3,
        clamp(walk.z-Math.cos(aim)*radius,-6.13,6.6));
      camera.position.lerp(desired,first?1:1-Math.exp(-dt*9));
      camera.lookAt(clamp(walk.x+Math.sin(aim)*1.7,-5.25,5.25),1.52+motion.height*.4,clamp(walk.z+Math.cos(aim)*1.7,-5.9,6.4));
      shadowAt(0,walk.x,walk.z,.55,.59,0,.035,room.view.shadows);
      room.view.shadows.instanceMatrix.needsUpdate=true;
      room.view.animate(time);
      renderer.render(room.view.scene,camera);
      if(first){first=false;events.ready();}
      return;
    }
    const pose=motion.driving?motion.car:motion.player;
    const night=prefs.light==='night'?1:prefs.light==='day'?0:(1-Math.cos(time*.024))/2;
    sky.copy(daySky).lerp(nightSky,night);
    (scene.fog as T.Fog).color.copy(sky);
    overhead.intensity=1.86-night*1.07; sun.intensity=2.92-night*2.77;
    vehicle.paint.envMapIntensity=.72-night*.51;
    atmosphere.material.uniforms.night.value=night;
    city.bulbs.emissiveIntensity=.03+night*1.65; city.water.uniforms.time.value=reduced?0:time; city.water.uniforms.night.value=night;
    vehicle.lights.visible=night>.43;
    const carHeight=lookoutHeight(motion.car.x,motion.car.z);
    const playerHeight=motion.driving?0:lookoutHeight(motion.player.x,motion.player.z);
    vehicle.root.position.set(motion.car.x,.12+carHeight,motion.car.z); vehicle.root.rotation.y=motion.car.angle;

    const pace=Math.min(1,Math.abs(motion.velocity)/16);
    vehicle.root.rotation.z=reduced?0:motion.steering*pace*.024;
    const noseX=Math.sin(motion.car.angle)*1.6,noseZ=Math.cos(motion.car.angle)*1.6;
    const rise=lookoutHeight(motion.car.x+noseX,motion.car.z+noseZ)-lookoutHeight(motion.car.x-noseX,motion.car.z-noseZ);
    vehicle.root.rotation.x=-Math.atan2(rise,3.2)+(reduced?0:Math.sin(time*7)*pace*.0026);
    vehicle.wheels.forEach(({pivot,roller},i)=>{roller.rotation.x=motion.wheels; pivot.rotation.y=i%2?motion.steering*.32:0;});
    trafficMeshes.forEach(({object,rig},i)=>{
      const state=cars[i];
      object.visible=distance(state,pose)<(software?38:72);
      if(!object.visible)return;
      object.position.set(state.x,.12,state.z);
      object.rotation.y=state.angle;
      if(rig)rig.wheels.forEach(({roller})=>{roller.rotation.x=state.wheels;});
    });
    const signalFrame=Math.floor(time*4);
    if(signalFrame!==signalTick){signalTick=signalFrame;streetSignals.update(time);}
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
      const detailDistance=software?22:prefs.quality==='low'?32:55;
      const detailSquared=detailDistance*detailDistance;
      for(const detail of city.facadeDetails){
        const dx=detail.x-pose.x,dz=detail.z-pose.z;
        detail.mesh.visible=dx*dx+dz*dz<detailSquared;
      }
      city.foliage.forEach((leaf,i)=>{leaf.rotation.z=reduced?0:Math.sin(time*1.15+i)*.035;});
      landlords.forEach((p,i)=>{
        const range=distance({x:p.root.position.x,z:p.root.position.z},pose);
        p.root.visible=range<50;
        if(!p.root.visible)return;
        const rig=p.setDetail(range<(software?14:25));
        p.root.rotation.y=Math.sin(time*.6+i)*.25;
        if(!rig)return;
        rig.head.rotation.y=Math.sin(time*.69+i)*.19;
        rig.elbows[1].rotation.x=-.38;
        rig.arms[1].rotation.z=-.12-Math.max(0,Math.sin(time*1.55+i))**8*.82;
      });
      crowds.forEach((p,i)=>{
        const n=neighbors[i];
        const walking=n.motion==='walk', sitting=n.motion==='sit';
        const phase=time*.39+i*1.7;
        const patrolX=n.x+(walking?Math.sin(phase)*2.55:0);
        const delta=patrolX-p.root.position.x;
        const nextX=p.root.position.x+Math.sign(delta)*Math.min(1.08*dt,Math.abs(delta));
        const canWalk=walking&&Math.abs(delta)>.025&&!outdoorSolid(nextX,n.z,.44)&&Math.hypot(nextX-pose.x,n.z-pose.z)>(motion.driving?2.2:.92);
        const npcX=canWalk?nextX:p.root.position.x;
        p.root.position.set(npcX,sitting?-.14:.18+lookoutHeight(npcX,n.z),n.z);
        const range=Math.hypot(npcX-pose.x,n.z-pose.z);
        const rangeLimit=software?23:quality<.68?32:44;
        p.root.visible=range<rangeLimit;
        if(!p.root.visible)return;
        const detailed=range<(software?10:22);
        const rig=p.setDetail(detailed);
        const facing=!motion.driving&&range<2.75?Math.atan2(pose.x-npcX,pose.z-n.z):
          canWalk?(delta>0?Math.PI/2:-Math.PI/2):Math.sin(.48*time+i)*.19;
        p.root.rotation.y+=Math.atan2(Math.sin(facing-p.root.rotation.y),Math.cos(facing-p.root.rotation.y))*Math.min(1,dt*7);
        if(rig){
          animatePerson(rig,time*5+i,canWalk?.36:.035);
          rig.head.rotation.y=Math.sin(time*.72+i)*.17;
          if(sitting){rig.legs[0].rotation.x=-1.2;rig.legs[1].rotation.x=-1.13;rig.knees[0].rotation.x=1.14;rig.knees[1].rotation.x=1.09;}
        }
      });
      animals.forEach((p,i)=>{
        const base=pets[i], a=time*(i<3?.73:.98)+i*1.3;
        const x=base?.x??62, z=base?.z??-45, span=i<2?.75:i===2?1.2:10+i;
        p.root.position.set(x+Math.cos(a)*span,i<2?.36:i===2?.11:i%2?5+i*.23:.95+Math.sin(time+i)*.28,z+Math.sin(a)*span*.7);
        p.root.rotation.y=-a+.4;
        p.root.visible=distance({x,z},pose)<61&&(i<3||quality>.72);
        if(p.root.visible&&p.tail&&!reduced)p.tail.rotation.y=Math.sin(time*5+i)*.51;
        if(p.root.visible)p.limbs.forEach((limb,j)=>{if(i<2)limb.rotation.x=Math.sin(time*6+j*Math.PI/2)*.46;else limb.rotation.z=(j?1:-1)*Math.sin(time*(i===2?3:11))*.66;});
      });
      pins.forEach((pin,i)=>{pin.position.y=3.2+Math.sin(time*2+i)*.24; pin.rotation.y=pose.angle+Math.PI;});
    }
    const terrain=motion.driving?carHeight:playerHeight;
    target.set(pose.x,terrain+(motion.driving?1.25:1.55+motion.height*.46),pose.z);
    const aim=photo??(pose.angle+cameraYaw);
    const normalDistance=motion.driving?(camera.aspect<.8?11.4:9.5):5.9;
    const behind=photo===null?normalDistance:normalDistance/photoZoom;
    const introOrbit=intro>0?intro*.56:0;
    desired.set(pose.x-Math.sin(aim+introOrbit)*(behind+intro*5),motion.driving?(photo===null?5.9+intro*4.6:2.05+3.85/photoZoom):(photo===null?3.4:1.48+1.9/photoZoom),pose.z-Math.cos(aim+introOrbit)*(behind+intro*5));
    desired.y+=Math.max(lookoutHeight(desired.x,desired.z),terrain);
    const buildingAt=(x:number,z:number)=>districts.some(d=>d.id!=='park'&&Math.abs(d.x-x)<8.3&&Math.abs(d.z-z)<7.4);
    for(let fraction=.2;fraction<=1;fraction+=.1){
      if(buildingAt(T.MathUtils.lerp(pose.x,desired.x,fraction),T.MathUtils.lerp(pose.z,desired.z,fraction))){
        desired.x=T.MathUtils.lerp(pose.x,desired.x,Math.max(.21,fraction-.16));
        desired.z=T.MathUtils.lerp(pose.z,desired.z,Math.max(.21,fraction-.16));
        break;
      }
    }
    look.copy(target);
    if(photo===null){look.x+=Math.sin(aim)*4.4; look.z+=Math.cos(aim)*4.4;}
    camera.position.lerp(desired,first?1:1-Math.exp(-dt*(photo===null?6.5:12)));
    camera.lookAt(look);
    atmosphere.position.copy(camera.position);
    shadows.material.uniforms.strength.value=.37-night*.16;
    shadowAt(0,motion.car.x,motion.car.z,1.88,2.85,motion.car.angle,.147+carHeight);
    shadowAt(1,motion.player.x,motion.player.z,motion.driving?0:.61,motion.driving?0:.68,0,.147+playerHeight);
    let index=2;
    for(const parked of parkedCars)shadowAt(index++,parked.x,parked.z,1.7,2.65,Math.PI/2);
    for(const actor of shadowActors){
      const {x,y,z}=actor.root.position;
      const radius=actor.root.visible&&y<.5?.52:0;
      shadowAt(index++,x,z,radius,radius,0,y>.2?.255:.147);
    }
    shadows.instanceMatrix.needsUpdate=true;
    renderer.render(scene,camera);
    if(first){first=false;events.ready();}
  };
  const halt=()=>{cancelAnimationFrame(raf);raf=0;last=0;frames=0;sample=0;frameWorst=0;};
  const wake=()=>{if(!raf&&!disposed&&!contextLost&&!document.hidden&&(!paused||photo!==null||first))raf=requestAnimationFrame(tick);};
  const sync=()=>{if(document.hidden||(paused&&photo===null&&!first))halt();else wake();};
  const updateHUD=(forced?:District)=>{
    const pose=motion.driving?motion.car:motion.player;
      latestNear=room?undefined:forced??districts.find(d=>distance(entrance(d),pose)<8);
      latestPet=motion.driving||room?-1:animals.slice(0,3).findIndex(a=>a.root.visible&&distance({x:a.root.position.x,z:a.root.position.z},pose)<3.2);
      latestNeighbor=-1;
      if(!motion.driving&&!room){
        let range=2.65;
        crowds.forEach(({root},i)=>{
          const nearby=distance({x:root.position.x,z:root.position.z},pose);
          if(root.visible&&nearby<range){range=nearby;latestNeighbor=i;}
        });
      }
      if(latestNear && previousVisit!==latestNear.id)events.visit(latestNear.id);
      atSecret=!motion.driving&&!room&&distance(secret,pose)<3.1;
      previousVisit=latestNear?.id??null;
      const speed=Math.abs(motion.velocity);
      const pace=motion.height>.04?'airborne':speed<.2?'idle':speed<3.4?'walk':speed<6.5?'run':'sprint';
      renderer.domElement.dataset.traffic=room?'':String(cars.filter(car=>car.velocity>.2).length);
      events.update({...pose,height:motion.height,room:room?.id??null,pace,speed:Math.abs(motion.velocity)*3.6,driving:motion.driving,near:previousVisit,neighbor:latestNeighbor,pet:latestPet,night:prefs.light==='night'||(prefs.light==='cycle'&&Math.cos(time*.024)<.12)});
  };
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
      const solid=room?roomBlocked:outdoorSolid;
      if(!room)advanceTraffic(cars,time,dt,[motion.car,motion.driving?motion.car:motion.player]);
      for(let i=0;i<steps;i++)step(motion,input,dt/steps,solid);
      cameraYaw*=Math.exp(-dt*(Math.abs(motion.velocity)>1?.75:.11));
    }
    const pose=motion.driving?motion.car:motion.player;
    if(!room&&now>nextGPS){nextGPS=now+230; refreshRoute(pose);}
    if(now>nextHUD){nextHUD=now+100;updateHUD();}
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
  function leaveRoom(){
    if(!room)return;
    const prior=room;
    room=undefined;
    scene.add(driver.root);
    disposeWorld(prior.view.scene);
    Object.assign(motion,prior.saved);
    cameraYaw=0;first=true;updateHUD();wake();
  }
  return {
    destroy(){if(room){const old=room;room=undefined;scene.add(driver.root);disposeWorld(old.view.scene);}disposed=true;meshRequest.abort();window.clearTimeout(assetTimer);reflections?.dispose();paintNormal?.dispose();halt();document.removeEventListener('visibilitychange',sync);observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',onLoss);disposeWorld(scene);renderer.dispose();renderer.domElement.remove();},
    interact(){
      updateHUD();
      if(room){events.note('Use the Exit building button to return outside.');return;}
      if(atSecret){events.note(secret.name+': '+secret.line);return;}
      if(latestPet!==-1){events.pet(latestPet);return;}
      if(latestNeighbor!==-1){events.neighbor(neighbors[latestNeighbor]);return;}
      if(latestNear){events.open(latestNear);return;}
      events.note('Follow a destination pin or open the city map.');
    },
    vehicle(){if(room)return;events.note(enterExit(motion,outdoorSolid));updateHUD();},
    jump(){jump(motion);},
    look(radians){cameraYaw=T.MathUtils.clamp(cameraYaw+radians,-Math.PI,Math.PI);},
    enterRoom(id){
      if(room)return;
      const saved=structuredClone(motion);
      const view=makeRoom(id);
      room={id,saved,view};
      Object.assign(motion,createMotion(),{driving:false,player:{x:0,z:3.55,angle:Math.PI}});
      shadowAt(1,0,-2.25,id==='garage'?2.58:1.46,id==='garage'?1.29:1.46,0,.035,view.shadows);
      view.scene.add(driver.root);
      intro=0;cameraYaw=0;first=true;updateHUD();wake();
    },
    exitRoom:leaveRoom,
    travel(d){leaveRoom();teleport(motion,d); cameraYaw=0;intro=0; first=true; updateHUD(d); wake();},
    settings(value){const changed=prefs.quality!==value.quality; prefs=value;vehicle.paint.color.set(prefs.color);if(changed){quality=software?.43:1;resize();}},
    gps(d){routeTarget=d;refreshRoute(motion.driving?motion.car:motion.player);},
    pause(value){paused=value;sync();},
    photo(angle,zoom=1){photo=angle;photoZoom=T.MathUtils.clamp(zoom,1,2.75);sync();},
    capture(){paintFrame(1);return renderer.domElement.toDataURL('image/png');},
    skip(){intro=0;},
  };
}
