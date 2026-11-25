import * as T from 'three';
import { columns } from '@/lib/city';
import type { Shape } from './models';

type Place = (...shape:Shape)=>void;
const stone=new T.DodecahedronGeometry(.5);
const log=new T.CylinderGeometry(.43,.5,1,9);
const brick='#bdab8b';
const rail='#3c5e55';

/** Landscaped banks stay outside bridge and navigation clearances. */
export function riverfront(put:Place,full:boolean){
  for(const side of [-1,1]){
    for(const [x,span] of [[-29.7,13.5],[.8,13.4],[29.5,13.4],[59.6,13.1]]){
      put(x,-.22,side*7.7,span,.56,1.62,'#70805e');
      put(x,.135,side*8.35,span,.09,1.37,'#c9b58e');
      put(x,.045,side*7.56,span,.14,.17,brick);
      const count=Math.floor(span/(full?2.07:3.8));
      for(let i=0;i<=count;i++){
        const sx=x-span*.47+i*span*.93/count;
        put(sx,.36,side*7.52,.1,.65,.12,rail);
        put(sx,.706,side*7.52,.17,.09,.19,'#d7c092');
      }
      put(x,.55,side*7.52,span,.07,.083,rail);
      put(x,.30,side*7.52,span,.054,.077,rail);
      const rocks=full?7:4;
      for(let i=0;i<rocks;i++){
        const sx=x-span*.48+i*span*.9/(rocks-1);
        put(sx,-.19,side*(7.15+(i%3)*.13),1.24,.43+(i%2)*.16,.71,i%2?'#a49d81':'#7e8b72',stone,i*.51);
      }
      put(x+span*.2,.36,side*8.95,1.49,.39,.63,'#88634d');
      put(x+span*.2,.56,side*8.95,1.56,.12,.68,'#ad8460');
    }
    for(const x of columns){
      for(const laneSide of [-1,1]){
        const edge=x+laneSide*5.55;
        for(const z of [-6.55,6.55]){
          if(Math.sign(z)!==side)continue;
          put(edge,.75,z,.49,1.3,.48,'#c3ad86');
          put(edge,1.43,z,.6,.13,.59,'#f0d6a7');
          put(edge,1.65,z,.08,.37,.08,'#3c5553',log);
          put(edge,1.88,z,.24,.19,.23,'#fff0b8');
          put(edge,2.0,z,.34,.12,.33,'#426560');
        }
      }
    }
  }
  // Pollinator beds beside the entrance to park and garage.
  for(const [x,z] of [[53.1,-24.4],[65.9,-26.3],[22.6,36.3],[9.2,37.1]]){
    put(x,.35,z,2.45,.5,.68,'#999170');
    put(x,.61,z,2.33,.16,.61,'#536841');
    const flowers=full?9:3;
    for(let i=0;i<flowers;i++){
      const dx=-1+i*2/(flowers-1), dz=Math.sin(i*2.4)*.14;
      put(x+dx,.76,z+dz,.052,.28,.048,'#788c58',log);
      put(x+dx,.89+(i%3)*.07,z+dz,.19,.15,.19,['#e8ad6e','#d58777','#d8c18c'][i%3],stone,i);
    }
  }
}

/** Continuous foothills stay outside the boundaries of the walker and car. */
export function makeFoothills(full:boolean){
  const g=new T.PlaneGeometry(272,252,full?42:23,full?38:21);
  g.rotateX(-Math.PI/2);
  g.translate(12,-.83,-8);
  const pos=g.getAttribute('position');
  const rgb=new Float32Array(pos.count*3);
  const moss=new T.Color('#697f5d'), grass=new T.Color('#a0a57a'), rock=new T.Color('#949789');
  const mixed=new T.Color();
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),z=pos.getZ(i);
    const out=Math.max(0,-57-x,x-86,-84-z,z-68);
    const lift=T.MathUtils.smoothstep(out,1,28);
    const broad=(Math.sin(x*.046+z*.037)+Math.cos(z*.078-x*.025)*.6+1.6)/3.2;
    const ripple=.4*Math.sin(x*.154+z*.091)*Math.cos(z*.16);
    pos.setY(i,-.83+lift*(2+9*broad+ripple));
    mixed.copy(moss).lerp(grass,broad*.76).lerp(rock,T.MathUtils.smoothstep(broad,.67,1)*.41);
    rgb.set([mixed.r,mixed.g,mixed.b],i*3);
  }
  g.computeVertexNormals();
  g.setAttribute('color',new T.Float32BufferAttribute(rgb,3));
  return new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true}));
}
