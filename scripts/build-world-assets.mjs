import { mkdir, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const directory=new URL('../public/world/',import.meta.url);
await mkdir(directory,{recursive:true});

// Profile stations run rear-to-front. Each station controls the shoulder,
// belt line, sill, upper surface and the small longitudinal crown of the paint.
const stations=[
  [-2.18,.87,.37,.66,.80],[-2.07,1.02,.31,.79,.96],[-1.74,1.16,.31,.94,1.07],
  [-1.44,1.18,.30,.98,1.16],[-.69,1.06,.31,.87,1.11],[.32,1.03,.30,.82,1.04],
  [1.16,1.17,.29,.80,.94],[1.61,1.16,.30,.72,.83],
  [1.95,1.05,.33,.64,.73],[2.17,.89,.37,.55,.65],
];
const canopy=[
  [-1.57,.60,1.04,1.12,1.14],[-1.32,.68,1.08,1.21,1.30],[-.76,.80,1.07,1.54,1.63],
  [-.21,.79,1.07,1.56,1.65],[.22,.74,1.05,1.48,1.58],[.72,.60,1,1.15,1.3],[.89,.535,.99,1.05,1.12],
];

function meshFromStations(profiles,steps,greenhouse=false){
  const positions=[],uv=[],indices=[];
  const rings=profiles.length*steps-steps+1;
  const samples=16;
  for(let i=0;i<rings;i++){
    const a=Math.min(profiles.length-2,Math.floor(i/steps));
    const t=(i-a*steps)/steps;
    const ease=t*t*(3-2*t);
    const values=profiles[a].map((value,j)=>THREE.MathUtils.lerp(value,profiles[a+1][j],j===0?t:ease));
    const [z,w,sill,belt,crown]=values;
    for(let j=0;j<samples;j++){
      const angle=j*Math.PI*2/samples;
      const spread=Math.sin(angle);
      const up=Math.cos(angle);
      const horizontal=Math.sign(spread)*Math.abs(spread)**.71;
      const y=up>=0?belt+(crown-belt)*up**.72:belt-(belt-sill)*Math.abs(up)**.62;
      // The glass tucks inward above the door line, and the painted body broadens
      // toward the fenders. Small rounded shoulders keep silhouettes continuous.
      const x=w*horizontal*(greenhouse?(up>0?1-up*.28:1):(up<0?1+.15*up:1));
      positions.push(x,y,z);
      uv.push(j/samples,i/(rings-1));
      if(i<rings-1){
        const k=(j+1)%samples,c=i*samples+j,d=i*samples+k;
        indices.push(c,c+samples,d,d,c+samples,d+samples);
      }
    }
  }
  const first=positions.length/3;
  for(const ring of [0,rings-1]){
    const [z,,low,,high]=profiles[ring===0?0:profiles.length-1];
    const center=positions.length/3;
    positions.push(0,(low+high)/2,z);uv.push(.5,ring===0?0:1);
    for(let j=0;j<samples;j++){
      const a=ring*samples+j,b=ring*samples+(j+1)%samples;
      indices.push(...(center===first?[center,a,b]:[center,b,a]));
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// GLTFExporter uses FileReader to combine the binary payload in browser builds.
globalThis.FileReader=class {
  async readAsArrayBuffer(blob) {
    this.result=await blob.arrayBuffer();
    this.onloadend?.();
  }
};
const roadster=new THREE.Group();
const paint=new THREE.Mesh(meshFromStations(stations,3), new THREE.MeshStandardMaterial({color:'#c66942',metalness:.37,roughness:.26}));
paint.name='RoadsterPaint';
const windows=new THREE.Mesh(meshFromStations(canopy,3,true),new THREE.MeshStandardMaterial({color:'#65909a',transparent:true,opacity:.53,depthWrite:false,roughness:.19,metalness:.12}));
windows.name='RoadsterGlass';
function roofSkin(glazing){
  const source=glazing.getAttribute('position');
  const positions=[],indices=[],uv=[];
  const ringCount=(canopy.length-1)*3+1;
  let rows=0;
  for(let i=0;i<ringCount;i++){
    const z=source.getZ(i*16);
    if(z<-.96||z>.27)continue;
    for(let col=-3;col<=3;col++){
      const k=i*16+(col+16)%16;
      positions.push(source.getX(k)*1.019,source.getY(k)+.019,z);
      uv.push((col+3)/6,i/ringCount);
      if(rows>0&&col<3){
        const a=(rows-1)*7+col+3,b=a+7;
        indices.push(a,b,a+1,a+1,b,b+1);
      }
    }
    rows++;
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
const roof=new THREE.Mesh(roofSkin(windows.geometry),paint.material);
roof.name='RoadsterRoof';
roadster.add(paint,windows,roof);
const payload=await new GLTFExporter().parseAsync(roadster,{binary:true});
await writeFile(new URL('river-roadster.glb',directory),new Uint8Array(payload));
console.log('River Roadster GLB',payload.byteLength+' bytes');
