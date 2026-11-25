import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { columns, districts, entrance, secret, shop, streets } from '@/lib/city';

const box = new T.BoxGeometry(1,1,1);
const ball = new T.IcosahedronGeometry(.5,1);
const lowBall = new T.IcosahedronGeometry(.5,0);
const cone = new T.ConeGeometry(.5,1,7);
const tube = new T.CylinderGeometry(.5,.5,1,12);
// The body and canopy use bevelled cross sections along the vehicle's length.
function loft(sections:number[][]) {
  const rings=sections.map(([z,width,low,high])=>[
    [-width*.83,low,z],[-width,low+.12,z],[-width*.88,high,z],
    [width*.88,high,z],[width,low+.12,z],[width*.83,low,z],
  ]);
  const positions:number[]=[];
  const face=(a:number[],b:number[],c:number[])=>positions.push(...a,...b,...c);
  for(let i=0;i<rings.length-1;i++){
    for(let j=0;j<6;j++){
      const k=(j+1)%6;
      face(rings[i][j],rings[i+1][j],rings[i][k]);
      face(rings[i][k],rings[i+1][j],rings[i+1][k]);
    }
  }
  const back=rings[0],front=rings[rings.length-1];
  for(let j=1;j<5;j++){face(back[0],back[j],back[j+1]);face(front[0],front[j+1],front[j]);}
  const geometry=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.computeVertexNormals();
  // The shared merge pipeline expects a UV attribute alongside positions and normals.
  geometry.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(positions.length*2/3),2));
  return geometry;
}
const body=loft([[-2.09,1.04,.43,.96],[-1.59,1.17,.38,1.12],[.68,1.1,.39,1.06],[1.59,1.07,.41,.83],[2.13,.91,.48,.66]]);
const glass=loft([[-1.47,.61,1.07,1.13],[-.78,.8,1.08,1.61],[.07,.77,1.06,1.62],[.84,.55,1.04,1.16]]);
const vertexPaint = new T.MeshLambertMaterial({ vertexColors:true });
const sharedGeometries = new Set<T.BufferGeometry>([box,ball,lowBall,cone,tube,body,glass]);
const materials = new Map<string,T.MeshStandardMaterial>();
function material(color:string) {
  let result = materials.get(color);
  if (!result) {
    result = new T.MeshStandardMaterial({ color, roughness: .78 });
    materials.set(color,result);
  }
  return result;
}
type Shape = [x:number,y:number,z:number,w:number,h:number,d:number,color:string, geo?:T.BufferGeometry, rot?:number];
function mesh([x,y,z,w,h,d,color,geo=box,rot=0]:Shape) {
  const m = new T.Mesh(geo,material(color));
  m.position.set(x,y,z); m.scale.set(w,h,d); m.rotation.y=rot;
  return m;
}
function pieces(parent:T.Group, shapes:Shape[]) { shapes.forEach(s=>parent.add(mesh(s))); }
function coloredGeometry(m:T.Mesh, matrix:T.Matrix4) {
  const source=m.geometry;
  const g=(source.index?source.toNonIndexed():source.clone()).applyMatrix4(matrix);
  const color=(m.material as T.MeshStandardMaterial).color;
  if(g.hasAttribute('color'))return g;
  const rgb=new Float32Array(g.attributes.position.count*3);
  for(let i=0;i<rgb.length;i+=3){rgb[i]=color.r;rgb[i+1]=color.g;rgb[i+2]=color.b;}
  g.setAttribute('color',new T.BufferAttribute(rgb,3));
  return g;
}
function combine(list:T.BufferGeometry[]) {
  if(!list.length)return null;
  const geometry=mergeGeometries(list);
  list.forEach(g=>g.dispose());
  return geometry;
}
function collapse(group:T.Group) {
  const geometries:T.BufferGeometry[]=[];
  for(const child of group.children) {
    if(!(child instanceof T.Mesh))continue;
    child.updateMatrix(); geometries.push(coloredGeometry(child,child.matrix));
  }
  const geometry=combine(geometries);
  if(!geometry)return;
  for(const child of [...group.children])if(child instanceof T.Mesh)group.remove(child);
  group.add(new T.Mesh(geometry,vertexPaint));
}
export function bakeParked(group:T.Group) {
  group.updateMatrixWorld(true);
  const geometries:T.BufferGeometry[]=[];
  group.traverseVisible(o=>{
    if(o instanceof T.Mesh)geometries.push(coloredGeometry(o,o.matrixWorld));
  });
  const geometry=combine(geometries);
  group.traverse(o=>{if(o instanceof T.Mesh&&!sharedGeometries.has(o.geometry))o.geometry.dispose();});
  return geometry?new T.Mesh(geometry,vertexPaint):null;
}
export function car(color:string) {
  const root=new T.Group();
  const paint=new T.MeshStandardMaterial({color,roughness:.24,metalness:.28});
  const chassis=new T.Group(); root.add(chassis);
  pieces(chassis,[
    [0,.56,0,2.16,.39,4.3,'#202737'],
    [0,0,0,1,1,1,color,body], [0,0,0,1,1,1,'#213853',glass],
    [0,1.62,-.37,1.35,.055,.84,color], [0,.55,2.13,1.42,.12,.08,'#111722'],
    [-1.09,.73,-.42,.11,.29,.84,'#222c3d'],[1.09,.73,-.42,.11,.29,.84,'#222c3d'],
    [-1.02,1.1,.52,.32,.15,.27,color],[1.02,1.1,.52,.32,.15,.27,color],
    [0,1.32,-1.97,2.3,.1,.42,'#263247'], [0,1.12,-1.93,1.24,.36,.1,'#263247'],
    [-.68,.7,2,.45,.09,.14,'#f1faff'], [.68,.7,2,.45,.09,.14,'#f1faff'],
    [-.69,.89,-2.1,.59,.085,.09,'#ff4f72'], [.69,.89,-2.1,.59,.085,.09,'#ff4f72'],
  ]);
  chassis.children.forEach(child=>{const m=child as T.Mesh;if(m.material===material(color))m.material=paint;});
  const wheels: {pivot:T.Group; roller:T.Group}[]=[];
  for (const x of [-1.02,1.02]) for(const z of [-1.32,1.3]) {
    const pivot=new T.Group(); pivot.position.set(x,.48,z); root.add(pivot);
    const roller=new T.Group(); pivot.add(roller);
    for(const [r,w,c,off] of [[.9,.41,'#182030',0],[.59,.06,'#8499b2',Math.sign(x)*.22],[.26,.065,'#293448',Math.sign(x)*.26]] as const){
      const tire=mesh([off,0,0,r,w,r,c,tube]); tire.rotation.z=Math.PI/2; roller.add(tire);
    }
    collapse(roller); wheels.push({pivot,roller});
  }
  const lights=new T.Group(); root.add(lights);
  pieces(lights,[[-.73,.16,3.4,1.18,.03,2.8,'#ffe9a0',ball],[.73,.16,3.4,1.18,.03,2.8,'#ffe9a0',ball]]);
  return {root,wheels,paint,lights};
}
export function person(color:string, skin:string, style=0) {
  const root=new T.Group();
  pieces(root,[[0,1.22,0,.72,.78,.52,color,ball],[0,1.89,0,.64,.67,.62,skin,ball],[0,2.14,-.055,.69,.32,.63,style%3===0?'#ffc155':'#243044',ball],
    [-.12,1.94,.28,.075,.085,.08,'#222c3e',ball],[.12,1.94,.28,.075,.085,.08,'#222c3e',ball]]);
  const legs=[]; const arms=[];
  for(const side of [-1,1]){
    const leg=new T.Group(); leg.position.set(side*.18,.91,0); root.add(leg);
    pieces(leg,[[0,-.38,0,.25,.74,.26,'#2b3955'],[0,-.8,.08,.31,.19,.41,'#242637']]); legs.push(leg);
    const arm=new T.Group(); arm.position.set(side*.39,1.48,0); root.add(arm);
    pieces(arm,[[0,-.24,0,.2,.55,.22,color,ball],[0,-.49,0,.2,.24,.23,skin,ball]]); arms.push(arm);
  }
  collapse(root); legs.forEach(collapse); arms.forEach(collapse);
  return {root, legs, arms};
}
export function wildlife(kind:number) {
  const root=new T.Group(); const limbs:T.Group[]=[];
  const c=['#b86c43','#ed9a55','#ffe46d','#e8f4fc','#ac7bff'][kind];
  if(kind<2){
    pieces(root,[[0,.52,0,.63,.62,1.2,c,ball],[0,.83,.56,.59,.61,.61,c,ball],[0,.72,.83,.24,.23,.31,'#303543',ball],[0,.74,-.66,.16,.59,.15,c,cone]]);
    for(const side of [-1,1]) {
      pieces(root,[[side*.21,1.16,.55,.2,.38,.19,c,cone]]);
      for(const z of [-.34,.35]) {
        const leg=new T.Group(); leg.position.set(side*.21,.49,z); root.add(leg);
        pieces(leg,[[0,-.18,0,.17,.42,.18,c,ball]]); limbs.push(leg);
      }
    }
  } else if(kind===4) {
    pieces(root,[[0,.43,0,.105,.13,.52,'#61395e',ball],[0,.44,.25,.1,.1,.12,'#61395e',ball]]);
    for(const side of [-1,1]){
      const wing=new T.Group();root.add(wing);wing.position.set(side*.065,.44,0);
      pieces(wing,[[side*.25,0,.09,.57,.085,.54,'#bd81ec',ball],[side*.20,0,-.19,.43,.075,.39,'#f6a3d0',ball],[side*.36,.046,.12,.11,.055,.12,'#ffe1a9',ball]]);
      limbs.push(wing);
    }
  } else {
    pieces(root,[[0,.38,0,.63,.42,.81,c,ball],[0,.6,.35,.39,.4,.41,c,ball],[0,.56,.58,.2,.14,.25,'#ff9b47',cone]]);
    for(const side of [-1,1]){
      const wing=new T.Group(); root.add(wing); wing.position.set(side*.2,.42,0);
      pieces(wing,[[side*.31,0,-.03,.72,.12,.47,c,ball]]); limbs.push(wing);
    }
  }
  collapse(root); limbs.forEach(collapse);
  return {root,limbs};
}

export function town() {
  const root=new T.Group();
  const batches=new Map<string,T.BufferGeometry[]>();
  const lampBulbs:T.BufferGeometry[]=[];
  const foliage:T.Mesh[]=[];
  const permanent=(...s:Shape)=> {
    const m=mesh(s); m.updateMatrix();
    const key=s[6];
    const g=coloredGeometry(m,m.matrix);
    if(key==='#fff0b8')lampBulbs.push(g);
    else { const chunk=Math.floor((s[0]+60)/40)+','+Math.floor((s[2]+85)/38);
      const batch=batches.get(chunk)??[]; batch.push(g); batches.set(chunk,batch); }
  };
  permanent(14,-2.2,-8,145,3,153,'#3c745e');
  for(const [z,d] of [[-46,76],[37.5,61]]) permanent(14,-.5,z,143,1,d,'#82b97f');
  for(const x of columns){
    permanent(x,.04,-8,12,.12,151,'#525d72');
    permanent(x-.0,.06,0,12,.16,16,'#626c80');
    for(const side of [-1,1]){
      permanent(x+side*7,.11,-46,2,.22,76,'#d4c7af');
      permanent(x+side*7,.11,37.5,2,.22,61,'#d4c7af');
      permanent(x+side*5.78,.56,0,.22,.86,15.5,'#e8ce9e');
      for(let z=-6;z<=6;z+=4)permanent(x+side*5.74,.56,z,.52,1.1,.52,'#f1dfb7');
    }
    for(let z=-82;z<68;z+=5)if(streets.every(j=>Math.abs(z-j)>7)) permanent(x,.125,z,.18,.018,2,'#f5dba7');
  }
  for(const z of streets){
    permanent(14,.05,z,143,.12,10,'#525d72');
    for(const side of [-1,1])permanent(14,.11,z+side*6,143,.2,2,'#d4c7af');
    for(let x=-53;x<85;x+=5)if(columns.every(j=>Math.abs(x-j)>7))permanent(x,.13,z,2,.02,.17,'#f5dba7');
    for(const x of columns) for(let i=-3;i<=3;i++) permanent(x+i*1.1,.134,z+4.1,.52,.02,1.25,'#dbdae0');
  }
  const typeHeights=[5.2,4,8,6,7,11,6,9,4,0];
  districts.forEach((d,i)=>{
    permanent(d.x,.12,d.z,21,.25,22,'#d4c7af');
    if(d.id==='park'){
      permanent(d.x,.3,d.z,19,.29,18,'#78af71',ball);
      permanent(d.x,.46,d.z,3.3,.6,3.3,'#f2e0ba',tube);
      permanent(d.x,.78,d.z,2.7,.09,2.7,'#70dcd8',tube);
      permanent(d.x,1.18,d.z,.26,.9,.26,'#ccf5f7',tube);
      for(const sx of [-1,1])permanent(d.x+sx*4,1.75,d.z-4,.18,3,.2,'#e46e52');
      permanent(d.x,3.24,d.z-4,8,.2,.2,'#ffc65a');
      for(const sx of [-2,2]) { permanent(d.x+sx,1.28,d.z-4,.12,3.6,.12,'#d4a549'); permanent(d.x+sx,.61,d.z-4,1,.16,.6,'#6a8eff'); }
    } else {
      const h=typeHeights[i];
      permanent(d.x,h/2+.24,d.z,15.6,h,13.5,d.color);
      permanent(d.x,h+.45,d.z,16.4,.65,14.4,'#f4e2c8');
      if(i===0 || i===8) permanent(d.x,h+1.6,d.z,17,3.2,15,d.color,cone,Math.PI/4);
      else if(i===6 || i===4) {
        permanent(d.x,h+1.15,d.z+5.5,14,1.9,2,'#e9d1b7',cone);
        for(let x=-6;x<=6;x+=3) permanent(d.x+x,h*.46,d.z+7.1,.43,h*.84,.43,'#f5e6ce',tube);
      } else {
        permanent(d.x-3,h+1.1,d.z-2,4,1.5,5,'#576880');
        permanent(d.x+4,h+.98,d.z+1.3,3,1.1,4,'#92b9c3');
      }
      permanent(d.x,1.31,d.z+6.8,2.7,2.6,.2,'#34475b');
      permanent(d.x,2.85,d.z+7.15,4.3,.26,1.3,'#f6e5cf');
      for(let floor=0;floor<Math.floor(h/2);floor++)for(const offset of [-5,-2.6,2.6,5]){
        permanent(d.x+offset,2.1+floor*2,d.z+6.8,1.42,1.04,.16,'#405d79');
        permanent(d.x+offset,1.59+floor*2,d.z+6.95,1.58,.12,.37,'#f1e1c6');
        permanent(d.x+7.84,2.1+floor*2,d.z+offset,.16,1.04,1.42,'#405d79');
      }
    }
    const p=entrance(d);
    permanent(p.x,.23,p.z,3.6,.13,2.6,d.color);
    permanent(p.x+2,.94,p.z,.13,1.5,.13,'#47566b');
    permanent(p.x+2,1.69,p.z,.84,.56,.17,d.color);
  });
  permanent(shop.x,1.9,shop.z,13,3.8,8,'#ebbd9a');
  permanent(shop.x,4.0,shop.z,13.6,.6,8.8,'#b86263');
  permanent(shop.x,2.7,shop.z+4.46,12,.3,1.7,'#e88068');
  for(let x=-5;x<=5;x+=2)permanent(shop.x+x,2.7,shop.z+4.55,.7,.32,1.75,'#ffe8c0');
  permanent(shop.x,1.26,shop.z+4.02,2.25,2.45,.18,'#334858');
  for(const x of [-4,4])permanent(shop.x+x,1.68,shop.z+4.04,3,1.44,.2,'#4c6c78');
  permanent(secret.x,.53,secret.z,2.3,.17,.61,'#cc8c56');
  permanent(secret.x,.88,secret.z-.3,2.3,.42,.12,'#cc8c56');
  permanent(secret.x,.25,secret.z,1.65,.46,.33,'#4d5661');
  permanent(secret.x,1.39,secret.z-.25,.48,.43,.18,'#ffe08a',ball);
  for(const [x,z] of [[5,41],[-23,-51],[51,-27]]){
    for(const side of [-1,1]){
      const ring=new T.TorusGeometry(.41,.064,5,14);
      permanent(x+side*.58,.48,z,1,1,1,'#293449',ring);
      ring.dispose();
    }
    const tilt=new T.BoxGeometry(1,1,1).rotateZ(Math.PI/4);
    permanent(x,.79,z,.8,.65,.085,'#ea845e',tilt);
    tilt.dispose();
    permanent(x+.45,1.06,z,.12,.48,.13,'#455a67');
    permanent(x+.46,1.24,z,.36,.08,.24,'#455a67');
  }
  const random=(i:number)=>{const v=Math.sin(i*91.492+17.1)*43758.54; return v-Math.floor(v);};
  const tree=(x:number,z:number,n:number,moving=false)=>{
    const h=2.8+random(n)*3;
    permanent(x,h*.34,z,.43,h*.72,.43,'#8d654d',tube);
    const crown:Shape=[x,h*.78,z,h*.87,h*.82,h*.85,['#438e69','#5ca66d','#699e64','#7db475'][n%4],n%3===0?cone:ball];
    if(moving){const leaf=mesh(crown);root.add(leaf);foliage.push(leaf);}
    else permanent(...crown);
    permanent(x+.6,h*.61,z+.24,h*.69,h*.58,h*.64,'#6db474',lowBall);
  };
  for(const [i,x,z] of [[4,-8,32],[3,8,20],[8,25,40],[6,39,34],[9,-38,29],[7,52,-36],[15,68,-33],[16,56,-49],[17,68,-65]]) tree(x,z,i,i%2===0);
  for(let i=0;i<320;i++){
    const x=-54+random(i)*138,z=-82+random(i+320)*147;
    if(Math.abs(z)<8||columns.some(v=>Math.abs(v-x)<8)||streets.some(v=>Math.abs(v-z)<7)||districts.some(v=>Math.abs(v.x-x)<10&&Math.abs(v.z-z)<10)||Math.hypot(x-61,z+57)<10)continue;
    if(i%4===0)tree(x,z,i);
    else {
      permanent(x+.8,.19,z-.5,.19,.44,.18,'#567d51',cone);
      permanent(x,.34,z,.97,.74,.94,i%3===0?'#85a3a2':'#68a66d',lowBall);
      for(let a=0;a<3;a++)permanent(x+a*.75,.24,z+.55,.22,.36,.22,['#ffc65a','#ff9397','#f5e8db'][a],cone);
    }
  }
  for(const x of columns) for(const z of [-75,-45,-15,15,45,60]){
    const lx=x+7.3,lz=z+6.3;
    permanent(lx,1.72,lz,.15,3.3,.15,'#445267',tube);
    permanent(lx-.47,3.34,lz,1.04,.13,.16,'#445267');
    permanent(lx-.96,3.26,lz,.57,.19,.35,'#fff0b8');
    permanent(x-7.05,1.1,z-5.2,.13,2.2,.13,'#445267');
    permanent(x-7.05,2.28,z-5.2,.36,.74,.32,'#263347');
    for(let i=0;i<3;i++)permanent(x-7.05,2+i*.22,z-5,.15,.15,.07,['#79d781','#ffcb64','#ff7764'][i],ball);
  }
  for (const [x,z] of [[53,-23],[66,-37],[54,-52],[69,-50],[-28,41],[28,-19]]) {
    permanent(x,.54,z,2,.18,.62,'#bf8053');
    permanent(x,.91,z-.28,2,.44,.12,'#bf8053');
    for(const offset of [-.73,.73])permanent(x+offset,.25,z,.15,.5,.45,'#536477');
  }
  const addBatch=(list:T.BufferGeometry[],mat:T.Material)=> {
    const merged=mergeGeometries(list);
    list.forEach(g=>g.dispose());
    if(merged)root.add(new T.Mesh(merged,mat));
  };
  batches.forEach(list=>addBatch(list,vertexPaint));
  const bulbs=material('#fff0b8'); bulbs.emissive.set('#ffce7b');
  addBatch(lampBulbs,bulbs);
  const water=new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`
    varying vec2 surface;
    void main(){surface=(modelMatrix*vec4(position,1.)).xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
  `,fragmentShader:`
    varying vec2 surface; uniform float time;
    void main(){float wave=sin(surface.x*.53+surface.y*1.5-time*1.2)+sin(surface.x*.42-surface.y*.93+time*.67);
    vec3 color=mix(vec3(.12,.51,.66),vec3(.37,.78,.77),smoothstep(-1.2,1.6,wave));
    gl_FragColor=vec4(color+vec3(smoothstep(1.83,1.98,wave)*.15),1.);
    #include <colorspace_fragment>
    }
  `});
  const river=new T.Mesh(new T.PlaneGeometry(143,16),water);
  river.rotation.x=-Math.PI/2; river.position.set(14.5,-.32,0); root.add(river);
  const pond=new T.Mesh(new T.CircleGeometry(1,32),water);
  pond.rotation.x=-Math.PI/2; pond.position.set(61,.27,-57); pond.scale.set(9,7,1); root.add(pond);
  const clouds=Array.from({length:5},(_,i)=>{
    const group=new T.Group(); group.position.set(-50+i*29,19+i%2*3,-38+random(i+1000)*65); root.add(group);
    pieces(group,[[0,0,0,9,2.6,4.5,'#f3f5f6',ball],[2,1,.4,6,3.4,4.4,'#f3f5f6',ball],[-2,.5,0,5,2.8,4.2,'#f3f5f6',ball]]);
    return group;
  });
  const spray=new T.InstancedMesh(ball,material('#c7f3ed'),9);
  spray.frustumCulled=false; root.add(spray);
  return {root,water,bulbs,clouds,foliage,spray};
}

export function disposeWorld(scene:T.Scene) {
  const geometries=new Set<T.BufferGeometry>();
  const mats=new Set<T.Material>();
  scene.traverse(o=>{ const m=o as T.Mesh; if(m.geometry)geometries.add(m.geometry); if(m.material) (Array.isArray(m.material)?m.material:[m.material]).forEach(v=>mats.add(v)); });
  geometries.forEach(g=>{if(!sharedGeometries.has(g))g.dispose();});
  mats.forEach(m=>{if(m!==vertexPaint&&!Array.from(materials.values()).includes(m as T.MeshStandardMaterial))m.dispose();});
}
