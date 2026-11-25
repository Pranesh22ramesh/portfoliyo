import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadRoadster(signal:AbortSignal) {
  const file=await fetch('/world/river-roadster.glb',{signal});
  if(!file.ok)throw new Error('Roadster mesh unavailable');
  const {scene}=await new GLTFLoader().parseAsync(await file.arrayBuffer(),'/world/');
  const body=scene.getObjectByName('RoadsterPaint');
  const glass=scene.getObjectByName('RoadsterGlass');
  const roof=scene.getObjectByName('RoadsterRoof');
  if(!(body instanceof T.Mesh)||!(glass instanceof T.Mesh)||!(roof instanceof T.Mesh))throw new Error('Roadster meshes missing');
  (body.material as T.Material).dispose();
  (glass.material as T.Material).dispose();
  return {body:body.geometry,glass:glass.geometry,roof:roof.geometry};
}

/** Small original lighting atlas for reflections on the hero car. */
export function roadsterReflections() {
  const width=128,height=64,data=new Uint8Array(width*height*4);
  for(let y=0;y<height;y++){
    const v=y/(height-1);
    for(let x=0;x<width;x++){
      const u=x/(width-1);
      const offset=(y*width+x)*4;
      const roof=v>.5;
      const stripe=Math.exp(-((u-.28)**2)*35-((v-.72)**2)*130);
      const band=Math.exp(-((v-.54)**2)*180);
      data[offset]=Math.min(255,(roof?124:53)+74*stripe+30*band);
      data[offset+1]=Math.min(255,(roof?167:70)+52*stripe+27*band);
      data[offset+2]=Math.min(255,(roof?193:65)+32*stripe+31*band);
      data[offset+3]=255;
    }
  }
  const atlas=new T.DataTexture(data,width,height,T.RGBAFormat);
  atlas.colorSpace=T.SRGBColorSpace;
  atlas.mapping=T.EquirectangularReflectionMapping;
  atlas.magFilter=T.LinearFilter;
  atlas.minFilter=T.LinearFilter;
  atlas.needsUpdate=true;
  return atlas;
}

export function paintMicroNormal() {
  const size=32, data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const offset=(y*size+x)*4;
      const u=2*Math.PI*x/size,v=2*Math.PI*y/size;
      const du=Math.sin(u*3+Math.cos(v*4))*8;
      const dv=Math.cos(v*4+Math.sin(u*3))*8;
      data[offset]=128+du;data[offset+1]=128+dv;data[offset+2]=254;data[offset+3]=255;
    }
  }
  const normal=new T.DataTexture(data,size,size,T.RGBAFormat);
  normal.wrapS=normal.wrapT=T.RepeatWrapping;
  normal.magFilter=T.LinearFilter;
  normal.minFilter=T.LinearMipmapLinearFilter;
  normal.generateMipmaps=true;
  normal.needsUpdate=true;
  return normal;
}
