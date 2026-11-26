import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { bakeParked, car } from './models';
import { makeContactShadows } from './lighting';

import type { RoomId } from '@/lib/rooms';

export function makeRoom(id:RoomId){
  const garage=id==='garage';
  const scene=new T.Scene();
  scene.background=new T.Color('#203630');
  const shadows=makeContactShadows(2);
  shadows.material.uniforms.strength.value=.64;
  scene.add(shadows);
  const accent=garage?'#ba8050':'#628d83',wall=garage?'#b9ad92':'#a2b4a3',ink='#263a36';
  const source=new RoundedBoxGeometry(1,1,1,2,.065);
  const batches=new Map<string,T.BufferGeometry[]>();
  const stamp=new T.Object3D();
  const put=(x:number,y:number,z:number,w:number,h:number,d:number,color:string,angle=0)=>{
    stamp.position.set(x,y,z);stamp.rotation.y=angle;stamp.scale.set(w,h,d);stamp.updateMatrix();
    const group=batches.get(color)??[];
    group.push(source.clone().applyMatrix4(stamp.matrix));
    batches.set(color,group);
  };
  put(0,-.11,0,11.7,.22,13.5,'#5e6b61');
  put(0,2.15,-6.58,11.7,4.3,.26,wall);
  for(const side of [-1,1]){
    put(side*5.78,2.15,0,.25,4.3,13.32,wall);
    put(side*5.59,.46,0,.14,.81,13.6,ink);
    for(const z of [-5,-2,1,4]){
      put(side*5.58,2.28,z,.19,3.9,.13,'#7b8b7b');
      put(side*5.45,3.61,z,.29,.095,.64,'#ece096');
    }
    put(side*4.55,.45,-.6,1.2,.89,8.6,ink);
    put(side*4.55,.95,-.6,1.38,.18,8.7,accent);
    for(const z of [-4.1,-2.3,-.5,1.3,3.1]){
      put(side*3.94,.53,z,.047,.47,1.55,accent);
      put(side*3.90,.65,z,.037,.046,.48,'#eed5a8');
    }
  }
  put(0,.45,-6.40,11.5,.81,.17,ink);
  put(0,2.63,-6.36,7.2,1.45,.11,'#435d55');
  put(0,1.1,-6.39,7.55,.13,.47,accent);
  for(let i=0;i<9;i++){
    put(-4.8+i*1.2,.011,0,.022,.023,13.35,'#748077');
    put(0,.012,-5.1+i*1.25,11.28,.022,.027,'#748077');
  }
  for(const side of [-1,1]){
    put(side*2.9,.03,-2.23,.084,.028,5.06,'#d8ac64');
    put(side*3.13,3.96,0,.23,.16,11.8,'#3f5149');
    for(const z of [-4.8,-1.7,1.5,4.6]){
      put(side*3.13,3.86,z,.48,.085,1.62,'#f2e1a9');
    }
  }
  for(const [x,z,c] of [[-4.55,-4.6,'#c5a16a'],[-4.55,2.7,'#829888'],[4.56,-4.25,'#8e7766'],[4.51,1.2,'#c1a16e']] as const){
    put(x,1.20,z,.65,.39,.55,c);
    put(x,1.42,z,.72,.095,.61,'#cab78e');
    put(x,1.28,z+.288,.31,.09,.025,'#ddc8a1');
  }
  batches.forEach((list,color)=>{
    const geometry=mergeGeometries(list);
    list.forEach(g=>g.dispose());
    if(geometry)scene.add(new T.Mesh(geometry,new T.MeshStandardMaterial({color,roughness:.81})));
  });
  source.dispose();
  scene.add(new T.HemisphereLight('#f8edcb','#7f9c84',2.2));
  const flood=new T.DirectionalLight('#ffdbab',2.1);
  flood.position.set(3.2,7,4.2);
  scene.add(flood);

  const plaque=document.createElement('canvas');
  plaque.width=768;plaque.height=160;
  const pen=plaque.getContext('2d');
  if(pen){
    pen.fillStyle='#28443f';pen.fillRect(0,0,768,160);
    pen.strokeStyle='#ccb27d';pen.lineWidth=6;pen.strokeRect(8,8,752,144);
    pen.fillStyle='#ffe9ba';pen.font='700 47px Georgia';pen.textAlign='center';pen.textBaseline='middle';
    pen.fillText(garage?'River Motor Works':'Research Gallery',384,65);
    pen.font='500 24px system-ui';pen.fillText(garage?'ROADSTER SHOWROOM':'DEVELOPER WORLD',384,117);
    const texture=new T.CanvasTexture(plaque);texture.colorSpace=T.SRGBColorSpace;
    const sign=new T.Mesh(new T.PlaneGeometry(6.95,1.43),new T.MeshBasicMaterial({map:texture}));
    sign.position.set(0,2.58,-6.27);
    scene.add(sign);
  }

  if(garage){
    const display=car('#649283');
    display.root.position.set(0,.14,-2.25);display.root.rotation.y=Math.PI/2;display.lights.visible=false;
    const model=bakeParked(display.root);
    if(model)scene.add(model);
    display.paint.dispose();
  }else{
    const podium=new T.Mesh(new T.CylinderGeometry(1.24,1.34,.36,24),new T.MeshStandardMaterial({color:'#8d9981'}));
    podium.position.set(0,.18,-2.25);scene.add(podium);
    const globe=new T.Mesh(new T.IcosahedronGeometry(.8,2),new T.MeshStandardMaterial({color:'#79aaa3',metalness:.31,roughness:.29,wireframe:true}));
    globe.position.set(0,1.35,-2.25);scene.add(globe);
    const ring=new T.Mesh(new T.TorusGeometry(1.06,.034,8,45),new T.MeshStandardMaterial({color:'#d9bb77'}));
    ring.rotation.x=Math.PI/2;ring.position.set(0,1.35,-2.25);scene.add(ring);
    return {scene,shadows,animate:(time:number)=>{globe.rotation.y=time*.28;globe.rotation.x=.24;}};
  }
  return {scene,shadows,animate:()=>{}};
}
