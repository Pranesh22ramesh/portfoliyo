import * as T from 'three';
import { columns, streets } from '@/lib/city';
import { lightAt } from '@/lib/traffic';

export function createSignals(){
  const colors={red:new T.Color('#fa604f'),amber:new T.Color('#f1c56a'),green:new T.Color('#79e6a4')};
  const bulbs=new T.InstancedMesh(new T.CircleGeometry(.084,10),new T.MeshBasicMaterial(),columns.length*streets.length*6);
  const position=new T.Object3D(),off=new T.Color('#354040');
  const intersections=columns.flatMap(x=>streets.map(z=>({x,z})));
  let prior='';
  function update(time:number){
    const phases=intersections.flatMap(({x,z})=>[lightAt(time,x,z,'northSouth'),lightAt(time,x,z,'eastWest')]);
    const key=phases.map(phase=>phase[0]).join('');
    if(key===prior)return;
    prior=key;
    intersections.forEach(({x,z},i)=>{
      for(const axis of [0,1]){
        (['red','amber','green'] as const).forEach((phase,lamp)=>{
          const index=i*6+axis*3+lamp;
          position.position.set(x-7.05+(axis===1?.197:0),2.46-lamp*.173,z-5.2+(axis===0?.197:0));
          position.rotation.y=axis===1?Math.PI/2:0;
          position.updateMatrix();
          bulbs.setMatrixAt(index,position.matrix);
          bulbs.setColorAt(index,phases[i*2+axis]===phase?colors[phase]:off);
        });
      }
    });
    bulbs.instanceMatrix.needsUpdate=true;
    if(bulbs.instanceColor)bulbs.instanceColor.needsUpdate=true;
  }
  update(0);
  return {mesh:bulbs,update};
}
