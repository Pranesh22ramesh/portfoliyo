import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { neighborhood } from './neighborhood';
import { makeFoothills, riverfront } from './riverfront';
import { headlightPools } from './lighting';
import { facade, makeSigns, streetscape } from './scenery';
import { columns, districts, entrance, secret, shop, streets } from '@/lib/city';

const box = new T.BoxGeometry(1,1,1);
const ball = new T.IcosahedronGeometry(.5,1);
const lowBall = new T.IcosahedronGeometry(.5,0);
const oval = new T.SphereGeometry(.5,10,6);
const bevel = new T.CylinderGeometry(.38,.5,1,10);
const cone = new T.ConeGeometry(.5,1,7);
const tube = new T.CylinderGeometry(.5,.5,1,12);
const tireProfile=new T.LatheGeometry([
  new T.Vector2(.30,-.49),new T.Vector2(.433,-.49),new T.Vector2(.485,-.32),
  new T.Vector2(.50,-.17),new T.Vector2(.50,.17),new T.Vector2(.485,.32),
  new T.Vector2(.433,.49),new T.Vector2(.30,.49),
],22);
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
const body=loft([[-2.17,.98,.39,.86],[-2.03,1.10,.34,1.04],[-1.53,1.21,.31,1.16],[-.68,1.12,.32,1.11],[.48,1.06,.31,1.03],[1.39,1.19,.33,.93],[1.94,1.11,.35,.77],[2.19,.89,.44,.64]]);
const glass=loft([[-1.47,.61,1.07,1.13],[-.78,.8,1.08,1.61],[.07,.77,1.06,1.62],[.84,.55,1.04,1.16]]);
const vertexPaint = new T.MeshLambertMaterial({ vertexColors:true });
const townPaint = vertexPaint.clone();
townPaint.onBeforeCompile = (shader) => {
  shader.vertexShader = 'varying vec3 surfacePosition;\n' + shader.vertexShader.replace(
    '#include <begin_vertex>', '#include <begin_vertex>\n surfacePosition=position;'
  );
  shader.fragmentShader = 'varying vec3 surfacePosition;\n' + shader.fragmentShader.replace(
    '#include <color_fragment>', `#include <color_fragment>
    vec3 grainCell=floor(surfacePosition*31.);
    float grain=fract(sin(dot(grainCell,vec3(2.73,4.61,7.22)))*4375.15);
    vec3 broadCell=floor(surfacePosition*3.);
    float broad=fract(sin(dot(broadCell,vec3(8.25,1.91,3.43)))*637.4);
    float fade=1.-smoothstep(20.,65.,gl_FragCoord.w > .0001 ? 1. / gl_FragCoord.w : 100.);
    diffuseColor.rgb *= 1.+(grain-.5)*.094*fade+(broad-.5)*.044;`
  );
};
const sharedGeometries = new Set<T.BufferGeometry>([box,ball,lowBall,oval,bevel,cone,tube,tireProfile,body,glass]);
const materials = new Map<string,T.MeshStandardMaterial>();
function material(color:string) {
  let result = materials.get(color);
  if (!result) {
    result = new T.MeshStandardMaterial({ color, roughness: .78 });
    materials.set(color,result);
  }
  return result;
}
export type Shape = [x:number,y:number,z:number,w:number,h:number,d:number,color:string, geo?:T.BufferGeometry, rot?:number];
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
export function car(color:string, showCabin=false) {
  const root=new T.Group();
  const paint=new T.MeshPhysicalMaterial({color,roughness:.29,metalness:.31,clearcoat:.68,clearcoatRoughness:.22});
  const chassis=new T.Group(), detail=new T.Group(); root.add(chassis,detail);
  pieces(chassis,[
    [0,.33,0,1.77,.215,3.93,'#202737'],
    [0,0,0,1,1,1,color,body],
    [0,1.62,-.37,1.35,.055,.84,color], [0,.54,2.15,1.76,.12,.14,'#121e23'],
    [-1.044,.694,-.54,.09,.105,.51,'#263737'],[1.044,.694,-.54,.09,.105,.51,'#263737'],
    [-1.12,1.071,.49,.293,.112,.225,color,oval],[1.12,1.071,.49,.293,.112,.225,color,oval],
    [0,1.28,-1.97,2.1,.065,.32,'#263247'], [-.61,1.145,-1.92,.09,.245,.117,'#263247'], [.61,1.145,-1.92,.09,.245,.117,'#263247'],
    [-.69,.89,-2.1,.59,.085,.09,'#ff4f72'], [.69,.89,-2.1,.59,.085,.09,'#ff4f72'],
  ]);
  pieces(detail,[
    [0,.44,-2.14,1.82,.19,.15,'#172326'],[0,.73,-2.105,1.71,.25,.12,'#202e32'],
    [0,.68,-2.19,.56,.19,.06,'#f2dab2'],[0,.69,-2.224,.33,.026,.007,'#4f6c68'],
    [0,.91,-2.07,.15,.055,.018,'#e5b677'],[0,.78,1.64,.14,.04,.18,'#dfb46f'],
    [0,.46,2.2,1.9,.072,.18,'#25393a'],[0,1.317,-1.986,1.96,.018,.234,'#364f4c'],
  ]);
  for(const side of [-1,1]){
    pieces(detail,[
      [side*.83,.87,-2.177,.3,.049,.035,'#ef7465'],
      [side*.42,.9,-2.143,.29,.035,.024,'#ff926f'],
      [side*.76,.53,-2.22,.23,.14,.18,'#899892',tube,0],
      [side*.98,.69,-2.11,.1,.26,.11,'#121b20'],
      [side*.77,.704,1.91,.39,.035,.275,'#e6f0e3',oval,side*.24],
      [side*.93,.48,1.99,.31,.10,.19,'#253739',box,side*.28],
      [side*1.035,.42,0,.108,.072,1.88,'#213338'],
      [side*1.14,1.072,.414,.185,.061,.087,'#bdcecc',oval],
      [side*1.008,1.023,.49,.23,.065,.072,'#293b3d',oval],
      [side*.66,1.12,-1.58,.064,.035,.2,'#273c3c'],
    ]);
  }
  let windscreen:T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>|undefined;
  if(showCabin){
    const interior=new T.Group();root.add(interior);
    for(const side of [-1,1]){
      pieces(interior,[
        [side*.36,1.12,-.3,.47,.15,.68,'#332a28',oval],
        [side*.36,1.29,-.61,.48,.54,.23,'#62433b',oval],
        [side*.36,1.51,-.62,.25,.18,.18,'#423435',oval],
        [side*.36,1.35,-.49,.34,.27,.035,'#a76b58'],
      ]);
    }
    pieces(interior,[[0,1.22,.47,1.31,.18,.25,'#253635',oval],[0,1.21,-.03,.17,.17,.69,'#50352f']]);
    const steering=new T.Mesh(new T.TorusGeometry(.15,.023,6,16),material('#293e40'));
    steering.position.set(-.35,1.35,.22);steering.rotation.x=-.37;interior.add(steering);
    collapse(interior);steering.geometry.dispose();
    windscreen=new T.Mesh(glass,new T.MeshStandardMaterial({color:'#497f90',transparent:true,opacity:.38,depthWrite:false,roughness:.14,metalness:.19}));
    root.add(windscreen);
  }else pieces(detail,[[0,0,0,1,1,1,'#355866',glass]]);
  collapse(detail);
  chassis.children.forEach(child=>{const m=child as T.Mesh;if(m.material===material(color))m.material=paint;});
  const paintedRoof=chassis.children.find(child=>child instanceof T.Mesh&&child.position.y===1.62) as T.Mesh<T.BufferGeometry,T.MeshPhysicalMaterial>;
  const paintShell=chassis.children.find(child=>child instanceof T.Mesh&&child.geometry===body) as T.Mesh<T.BufferGeometry,T.MeshPhysicalMaterial>;
  const fixed=new T.Group(); chassis.add(fixed);
  for(const child of [...chassis.children]){
    if(child instanceof T.Mesh && child.material!==paint)fixed.add(child);
  }
  collapse(fixed);
  const wheels: {pivot:T.Group; roller:T.Group}[]=[];
  for (const x of [-1.13,1.13]) for(const z of [-1.32,1.3]) {
    const pivot=new T.Group(); pivot.position.set(x,.43,z); root.add(pivot);
    const roller=new T.Group(); pivot.add(roller);
    const side=Math.sign(x);
    for(const [r,w,c,off] of [[.86,.37,'#192426',0],[.68,.027,'#3b4847',side*.198],[.56,.034,'#7e9291',side*.215],[.43,.033,'#343e41',side*.234],[.16,.07,'#bdc7bd',side*.258]] as const){
      const tread=showCabin&&r===.86?tireProfile:tube;
      const tire=mesh([off,0,0,r,w,r,c,tread]); tire.rotation.z=Math.PI/2; roller.add(tire);
    }
    for(let i=0;i<7;i++){
      const a=i/7*Math.PI*2;
      const spoke=mesh([side*.258,Math.cos(a)*.164,Math.sin(a)*.164,.032,.235,.035,'#c2ccc1']);
      spoke.rotation.x=a; roller.add(spoke);
    }
    pieces(roller,[[side*.241,.164,.11,.036,.18,.089,'#db7760']]);
    collapse(roller); wheels.push({pivot,roller});
  }
  const lights=showCabin?headlightPools():new T.Group();root.add(lights);
  return {root,wheels,paint,lights,paintShell,paintedRoof,windscreen};
}
function makePersonRig(color:string, skin:string, style:number) {
  const root=new T.Group(), head=new T.Group();
  const dark=['#314747','#51423c','#323741','#465850'][style%4];
  const hair=['#2f302b','#4a3330','#4d3b32','#1e2e32'][style%4];
  const uniform=style%4===1?'#303d3c':color;
  pieces(root,[
    [0,.96,0,.45,.31,.33,dark,oval],[0,1.22,0,.51,.66,.35,uniform,oval],
    [0,1.43,-.014,.58,.32,.38,uniform,oval],[0,1.56,0,.19,.2,.21,skin,bevel],
    [0,1.3,.178,.032,.48,.022,'#d7c491'],
    [-.158,1.37,.166,.13,.13,.032,color],[.164,1.36,.154,.095,.062,.031,'#e5c18b'],
  ]);
  root.add(head); head.position.set(0,1.71,.029);
  pieces(head,[
    [0,.08,0,.42,.48,.395,skin,oval],[0,-.049,.041,.34,.251,.315,skin,oval],
    [0,.041,.19,.095,.105,.095,skin,oval],[0,-.079,.181,.103,.025,.018,'#683d33',oval],
    [0,.237,-.047,.444,.228,.398,hair,oval],[0,.133,-.134,.415,.32,.235,hair,oval],
  ]);
  for(const side of [-1,1]){
    pieces(head,[
      [side*.208,.026,-.012,.118,.142,.112,skin,oval],
      [side*.087,.096,.175,.105,.065,.052,'#f3e5ce',oval],
      [side*.087,.095,.2,.044,.052,.024,'#28352f',oval],
      [side*.09,.148,.173,.099,.026,.034,hair,oval],
    ]);
  }
  if(style%3===0){
    pieces(head,[[0,.27,-.019,.494,.142,.435,color,oval],[0,.232,.146,.48,.046,.37,dark,oval]]);
  }else if(style%3===1){
    pieces(head,[[0,.095,.22,.053,.025,.025,'#354435'],
      [-.09,.095,.204,.12,.078,.032,'#493f3a'],[.09,.095,.204,.12,.078,.032,'#493f3a'],
      [-.09,.095,.222,.088,.055,.014,'#a8c0af'],[.09,.095,.222,.088,.055,.014,'#a8c0af']]);
  }else{
    pieces(head,[[-.14,.193,.135,.19,.166,.149,hair,oval],[.039,.225,.126,.29,.13,.159,hair,oval]]);
  }
  if(style===4||style===8){
    pieces(head,[[0,.139,-.20,.45,.355,.25,hair,oval],[.19,.08,-.108,.12,.31,.16,hair,oval],[0,.215,-.235,.26,.26,.23,hair,oval]]);
    pieces(root,[[0,1.46,.116,.40,.12,.197,'#d3b18b',oval]]);
  }
  if(style===5){
    pieces(root,[[0,1.18,.169,.41,.53,.11,'#d0a273',oval],[0,1.065,.213,.27,.12,.046,'#543e36',oval]]);
  }
  if(style===7)pieces(root,[[0,1.44,.182,.118,.23,.045,'#d4b582'],[.154,1.39,.189,.09,.063,.028,'#e4c37a']]);
  if(style===9)pieces(root,[[0,1.12,-.243,.48,.47,.26,'#a36a45'],[0,1.32,-.376,.45,.073,.049,'#dfac6e']]);
  if(style%4===2)pieces(root,[[0,1.24,-.218,.47,.43,.24,'#9e673e',oval],[0,1.37,-.32,.33,.24,.08,'#67493a',oval]]);
  const legs:T.Group[]=[], arms:T.Group[]=[], knees:T.Group[]=[], elbows:T.Group[]=[];
  for(const side of [-1,1]){
    const leg=new T.Group();leg.position.set(side*.129,.84,0);root.add(leg);
    pieces(leg,[[0,-.197,0,.245,.444,.256,dark,oval]]);
    const knee=new T.Group();knee.position.y=-.39;leg.add(knee);
    pieces(knee,[[0,-.175,0,.171,.39,.179,dark,oval],[0,-.37,.069,.218,.137,.337,'#273638',oval],
      [0,-.42,.069,.218,.035,.326,'#c9b797',oval]]);
    legs.push(leg);knees.push(knee);
    const arm=new T.Group();arm.position.set(side*.277,1.454,0);root.add(arm);
    pieces(arm,[[0,-.124,0,.198,.325,.203,uniform,oval]]);
    const elbow=new T.Group();elbow.position.y=-.267;arm.add(elbow);
    pieces(elbow,[[0,-.114,0,.146,.273,.145,skin,oval],[0,-.25,.007,.161,.172,.142,skin,oval],
      [-side*.059,-.229,.06,.067,.103,.069,skin,oval]]);
    for(let finger=0;finger<3;finger++){
      pieces(elbow,[[side*(finger-1)*.032,-.302+Math.abs(finger-1)*.008,.039,.029,.056,.051,skin,lowBall]]);
    }
    arms.push(arm);elbows.push(elbow);
  }
  root.updateMatrixWorld(true);
  const groups=[root,head,...legs,...knees,...arms,...elbows];
  const bones=groups.map(group=>{
    const bone=new T.Bone();
    bone.position.copy(group.position);
    return bone;
  });
  for(let i=1;i<groups.length;i++){
    const parent=groups.indexOf(groups[i].parent as T.Group);
    bones[Math.max(parent,0)].add(bones[i]);
  }
  const skinParts:T.BufferGeometry[]=[];
  groups.forEach((group,boneIndex)=>{
    const parentIndex=Math.max(0,groups.indexOf(group.parent as T.Group));
    for(const child of group.children){
      if(!(child instanceof T.Mesh))continue;
      const geometry=coloredGeometry(child,child.matrixWorld);
      const positions=geometry.getAttribute('position');
      const indices=new Uint16Array(positions.count*4);
      const weights=new Float32Array(positions.count*4);
      const flexible=knees.includes(group)||elbows.includes(group);
      const origin=group.getWorldPosition(new T.Vector3());
      for(let i=0;i<positions.count;i++){
        const parentWeight=flexible?.55*T.MathUtils.smoothstep(positions.getY(i)-origin.y,-.100,.02):0;
        indices[i*4]=boneIndex;
        indices[i*4+1]=parentIndex;
        weights[i*4]=1-parentWeight;
        weights[i*4+1]=parentWeight;
      }
      geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(indices,4));
      geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
      skinParts.push(geometry);
    }
  });
  const geometry=combine(skinParts);
  if(!geometry)throw new Error('Character mesh is missing');
  const actor=new T.SkinnedMesh(geometry,vertexPaint);
  actor.add(bones[0]);
  actor.updateMatrixWorld(true);
  actor.bind(new T.Skeleton(bones));
  geometry.computeBoundingSphere();
  actor.boundingSphere=geometry.boundingSphere?.clone()??new T.Sphere(new T.Vector3(0,1,0),1.2);
  actor.boundingSphere.radius+=.34;
  const bone=(group:T.Group)=>bones[groups.indexOf(group)];
  return {actor,head:bone(head),legs:legs.map(bone),knees:knees.map(bone),arms:arms.map(bone),elbows:elbows.map(bone)};
}

export type CharacterRig = ReturnType<typeof makePersonRig>;
export function person(color:string, skin:string, style=0){
  const root=new T.Group();
  const pants=['#314747','#51423c','#323741','#465850'][style%4];
  const hair=['#2f302b','#4a3330','#4d3b32','#1e2e32'][style%4];
  const uniform=style%4===1?'#303d3c':color;
  const distant=new T.Group();
  pieces(distant,[
    [0,1.25,0,.56,.67,.36,uniform,ball],[0,1.79,0,.45,.48,.40,skin,ball],
    [0,2.01,-.05,.47,.153,.41,hair,ball],[.14,.5,0,.23,.88,.27,pants,lowBall],
    [-.14,.5,0,.23,.88,.27,pants,lowBall],[-.335,1.21,0,.18,.5,.19,uniform,lowBall],
    [.335,1.21,0,.18,.5,.19,uniform,lowBall],
  ]);
  collapse(distant);
  root.add(distant);
  let rig:CharacterRig|undefined;
  return {
    root,
    setDetail(near:boolean){
      distant.visible=!near;
      if(near&&!rig){rig=makePersonRig(color,skin,style);root.add(rig.actor);}
      if(rig)rig.actor.visible=near;
      return near?rig:undefined;
    },
  };
}
export function wildlife(kind:number) {
  const root=new T.Group(); const limbs:T.Group[]=[];
  const tail=kind<2?new T.Group():undefined;
  const c=['#b86c43','#ed9a55','#ffe46d','#e8f4fc','#ac7bff'][kind];
  if(kind<2){
    pieces(root,[
      [0,.51,-.11,kind===0?.59:.42,.53,1.07,c,oval],[0,.55,.33,.43,.48,.57,c,oval],
      [0,.76,.57,kind===0?.51:.42,.43,.45,c,oval],
      [0,.68,.773,kind===0?.27:.19,.166,kind===0?.29:.17,'#e3b68a',oval],
      [0,.716,kind===0?.907:.851,.105,.072,.08,'#303535',oval],
    ]);
    if(tail){
      tail.position.set(0,.59,-.61);
      const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(0,.10,-.12),new T.Vector3(0,.25,-.19),new T.Vector3(.025,kind===0?.35:.41,-.14)]);
      const geometry=new T.TubeGeometry(curve,8,kind===0?.054:.045,5,false);
      const tuft=mesh([0,0,0,1,1,1,kind===0?'#936147':c,geometry]);
      tail.add(tuft);collapse(tail);geometry.dispose();root.add(tail);
    }
    if(kind===0)pieces(root,[[0,.606,.43,.46,.093,.37,'#5b867e',oval],[0,.55,.599,.098,.117,.043,'#e3b65c',oval]]);
    else for(const side of [-1,1])pieces(root,[[side*.137,.744,.65,.041,.164,.183,'#bd743c',oval]]);

    for(const side of [-1,1]) {
      pieces(root,[
        [side*.136,.808,.76,.055,.064,.055,'#332d2a',oval],
        [side*.146,.827,.786,.018,.017,.016,'#f9e4ba',oval],
        [side*.17,kind===0?.775:1.006,.52,kind===0?.145:.18,kind===0?.27:.228,.113,kind===0?'#935b43':c,kind===0?oval:cone],
      ]);
      for(const z of [-.34,.35]) {
        const leg=new T.Group(); leg.position.set(side*.21,.49,z); root.add(leg);
        pieces(leg,[[0,-.18,0,.16,.37,.17,c,oval],[0,-.346,.05,.18,.13,.213,kind===0?'#d9a46d':c,oval]]); limbs.push(leg);
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
    pieces(root,[
      [0,.33,0,.61,.38,.83,c,oval],[0,.54,.32,.26,.47,.31,c,oval],[0,.7,.37,.35,.31,.38,c,oval],
      [0,.644,.574,.205,.095,.275,'#df8550',oval], [0,.38,-.362,.35,.15,.43,c,oval],
      [-.128,.734,.451,.069,.07,.054,'#263131',oval],[.128,.734,.451,.069,.07,.054,'#263131',oval],
    ]);
    for(const side of [-1,1]){
      const wing=new T.Group(); root.add(wing); wing.position.set(side*.2,.42,0);
      pieces(wing,[[side*.31,0,-.03,.72,.12,.47,c,ball]]); limbs.push(wing);
    }
  }
  collapse(root); limbs.forEach(collapse);
  return {root,limbs,tail};
}

export function town(textured=true) {
  const root=new T.Group();
  const batches=new Map<string,T.BufferGeometry[]>();
  const facadeDetails:{x:number;z:number;mesh:T.Mesh}[]=[];
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
      for(const [from,to] of [[-84,-81],[-69,-51],[-39,-21],[-9,-8],[8,9],[21,39],[51,54],[66,68]]){
        const mid=(from+to)/2;
        permanent(x+side*7,.11,mid,2,.22,to-from,'#cbb696');
        permanent(x+side*6.04,.103,mid,.15,.15,to-from,'#e3cdb0');
      }
      permanent(x+side*5.78,.26,0,.25,.29,15.5,'#ae9f7d');
      permanent(x+side*5.78,.96,0,.28,.15,15.5,'#eddbb2');
      permanent(x+side*5.78,.65,0,.11,.11,15.5,'#647d78');
      for(let j=-7;j<=7;j++)permanent(x+side*5.78,.62,j,.095,.59,.095,'#647d78');
      for(let z=-6;z<=6;z+=4)permanent(x+side*5.74,.56,z,.52,1.1,.52,'#f1dfb7');
    }
    for(let z=-82;z<68;z+=5)if(streets.every(j=>Math.abs(z-j)>7)) permanent(x,.125,z,.18,.018,2,'#f5dba7');
  }
  for(const z of streets){
    permanent(14,.05,z,143,.12,10,'#525d72');
    for(const side of [-1,1])for(const [from,to] of [[-57,-52],[-38,-22],[-8,8],[22,38],[52,68],[82,86]]){
      permanent((from+to)/2,.11,z+side*6,to-from,.2,2,'#cbb696');
      permanent((from+to)/2,.095,z+side*5.04,to-from,.14,.16,'#e3cdb0');
    }
    for(let x=-53;x<85;x+=5)if(columns.every(j=>Math.abs(x-j)>7))permanent(x,.13,z,2,.02,.17,'#f5dba7');
    for(const x of columns) for(let i=-3;i<=3;i++) permanent(x+i*1.1,.134,z+4.1,.52,.02,1.25,'#dbdae0');
  }
  districts.forEach(d=>{
    permanent(d.x,.12,d.z,21,.25,22,'#d4c7af');
    if(d.id==='park'){
      permanent(d.x,.29,d.z,18,.31,17,'#83a76c',tube);
      permanent(d.x+.22,.434,d.z,9.6,.16,3.5,'#c8b98e',tube);
      permanent(d.x,.30,d.z+5.7,2.8,.125,8.2,'#d3bf97');
      for(const side of [-1,1]){
        permanent(d.x+side*7.6,.48,d.z+2.2,2.7,.41,1.47,'#a9886d',tube);
        permanent(d.x+side*7.6,.7,d.z+2.2,2.5,.13,1.28,'#526342',tube);
        for(let j=-2;j<=2;j++){
          permanent(d.x+side*7.6+j*.42,.84,d.z+2.17,.54,.4,.64,'#607f50',lowBall);
          permanent(d.x+side*7.6+j*.42,1.04,d.z+1.97,.21,.175,.24,j%2?'#dc937c':'#eed487',ball);
        }
      }
      permanent(d.x,.46,d.z,3.3,.6,3.3,'#f2e0ba',tube);
      permanent(d.x,.78,d.z,2.7,.09,2.7,'#70dcd8',tube);
      permanent(d.x,.77,d.z,3.42,.14,3.42,'#eed7b0',tube);
      permanent(d.x,.85,d.z,2.97,.08,2.97,'#66afac',tube);
      permanent(d.x,1.085,d.z,.54,.52,.54,'#d9c29d',bevel);
      permanent(d.x,1.35,d.z,1.57,.18,1.57,'#f0ddba',bevel);
      permanent(d.x,1.45,d.z,1.34,.05,1.34,'#6eb6ae',tube);
      permanent(d.x,1.62,d.z,.19,.36,.19,'#c7e9e0',tube);
      for(const sx of [-1,1])permanent(d.x+sx*4,1.75,d.z-4,.18,3,.2,'#e46e52');
      permanent(d.x,3.24,d.z-4,8,.2,.2,'#ffc65a');
      for(const sx of [-2,2]) { permanent(d.x+sx,1.28,d.z-4,.12,3.6,.12,'#d4a549'); permanent(d.x+sx,.61,d.z-4,1,.16,.6,'#6a8eff'); }
    } else {
      const smallForms:T.BufferGeometry[]=[];
      facade((...shape)=>{
        const [, , , w,h,depth]=shape;
        if(w*h*depth>.16 || Math.max(w,h,depth)<.09){permanent(...shape);return;}
        const part=mesh(shape);part.updateMatrix();smallForms.push(coloredGeometry(part,part.matrix));
      },d);
      const joined=combine(smallForms);
      if(joined){
        const detail=new T.Mesh(joined,textured?townPaint:vertexPaint);
        root.add(detail);facadeDetails.push({x:d.x,z:d.z,mesh:detail});
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
  neighborhood(permanent);
  riverfront(permanent,textured);
  root.add(makeFoothills(textured));
  streetscape(permanent);
  root.add(makeSigns());
  const random=(i:number)=>{const v=Math.sin(i*91.492+17.1)*43758.54; return v-Math.floor(v);};
  const tree=(x:number,z:number,n:number,moving=false)=>{
    const h=2.8+random(n)*3;
    permanent(x,h*.33,z,.48,h*.68,.48,'#805940',bevel);
    if(moving)for(const side of [-1,1]){
      const branch=mesh([x+side*h*.063,h*.53,z,.18,h*.34,.19,'#76583e',bevel]);
      branch.rotation.z=-side*.48; root.add(branch);
    }
    const crown:Shape=[x,h*.78,z,h*.87,h*.82,h*.85,['#438e69','#5ca66d','#699e64','#7db475'][n%4],n%3===0?cone:ball];
    if(moving){
      const leaf=mesh(crown);root.add(leaf);foliage.push(leaf);
      for(let i=0;i<5;i++){
        const a=i*2.4+n, size=.24+random(n+i*17)*.17;
        permanent(x+Math.cos(a)*h*.20,h*(.67+random(n+i*19)*.23),z+Math.sin(a)*h*.19,h*size,h*.31,h*size,
          ['#64945d','#749d5f','#879c63','#56815a','#a0a977'][i],ball);
      }
    }
    else permanent(...crown);
    permanent(x+.48,h*.63,z+.35,h*.67,h*.54,h*.64,'#77965e',lowBall);
    if(moving){
      permanent(x-.7,h*.73,z-.33,h*.61,h*.56,h*.64,'#659565',ball);
      permanent(x+.24,h*.91,z-.34,h*.66,h*.46,h*.58,'#88ab6e',ball);
    }
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
  for(let i=0;i<24;i++){
    const a=i*Math.PI/12, radius=1+(i%2)*.045;
    const x=61+Math.cos(a)*9*radius, z=-57+Math.sin(a)*7*radius;
    permanent(x,.29,z,1.15,.38+(i%3)*.08,.91,i%2?'#9e9d79':'#b9ac8b',lowBall,a);
  }
  const addBatch=(list:T.BufferGeometry[],mat:T.Material)=> {
    const merged=mergeGeometries(list);
    list.forEach(g=>g.dispose());
    if(merged)root.add(new T.Mesh(merged,mat));
  };
  batches.forEach(list=>addBatch(list,textured?townPaint:vertexPaint));
  const bulbs=material('#fff0b8'); bulbs.emissive.set('#ffce7b');
  addBatch(lampBulbs,bulbs);
  const water=new T.ShaderMaterial({uniforms:{time:{value:0},night:{value:0}},vertexShader:`
    varying vec3 surface;
    void main(){surface=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(surface,1.);}
  `,fragmentShader:`
    varying vec3 surface; uniform float time,night;
    void main(){
      vec2 p=surface.xz;
      float a=sin(p.x*.71+p.y*.54-time*1.2);
      float b=sin(p.x*.25-p.y*1.84+time*.7+a*.5);
      float ripples=sin(p.y*7.8+p.x*.59+2.*a-time*2.);
      vec3 view=normalize(cameraPosition-surface);
      float horizon=pow(1.-max(view.y,0.),3.);
      vec3 color=mix(vec3(.026,.23,.218),vec3(.14,.47,.405),smoothstep(-1.5,1.4,a+b));
      color=mix(color,vec3(.42,.58,.58),horizon*.6);
      float bank=surface.y<0.?smoothstep(6.6,7.9,abs(p.y)):0.;
      float glint=pow(max(0.,dot(reflect(-view,normalize(vec3(a*.058,1.,b*.055))),normalize(vec3(-.49,.56,.64)))),28.);
      float foam=smoothstep(.79,1.,ripples)*(.021+.16*bank);
      color+=vec3(.38,.31,.19)*glint*(1.-night);
      color=mix(color+foam,vec3(.032,.078,.125)+foam*.2,night*.86);
      gl_FragColor=vec4(color,1.);
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
  return {root,water,bulbs,clouds,foliage,spray,facadeDetails};
}

export function disposeWorld(scene:T.Scene) {
  const geometries=new Set<T.BufferGeometry>();
  const mats=new Set<T.Material>();
  scene.traverse(o=>{ if(o instanceof T.SkinnedMesh)o.skeleton.dispose();const m=o as T.Mesh; if(m.geometry)geometries.add(m.geometry); if(m.material) (Array.isArray(m.material)?m.material:[m.material]).forEach(v=>mats.add(v)); });
  geometries.forEach(g=>{if(!sharedGeometries.has(g))g.dispose();});
  const maps=new Set<T.Texture>();
  mats.forEach(m=>{const map=(m as T.MeshBasicMaterial).map;if(map)maps.add(map);if(m!==vertexPaint&&m!==townPaint&&!Array.from(materials.values()).includes(m as T.MeshStandardMaterial))m.dispose();});
  maps.forEach(map=>map.dispose());
}
