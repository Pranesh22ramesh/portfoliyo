import { blocked, bounds, columns, distance, entrance, parking, streets, type District, type Point } from './city';

const cell=2;
const width=Math.ceil((bounds.right-bounds.left)/cell)+1;
const height=Math.ceil((bounds.bottom-bounds.top)/cell)+1;
const size=width*height;
const clearance=1.7;
const index=(x:number,z:number)=>z*width+x;
const point=(i:number):Point=>({x:bounds.left+(i%width)*cell,z:bounds.top+Math.floor(i/width)*cell});

function clearSegment(a:Point,b:Point,radius=clearance) {
  const samples=Math.max(1,Math.ceil(distance(a,b)/.75));
  for(let i=0;i<=samples;i++){
    const t=i/samples;
    if(blocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,radius))return false;
  }
  return true;
}

let roads:Uint8Array|undefined;
const paths=new Map<string,number[]>();
function roadCells(){
  if(roads)return roads;
  const grid=new Uint8Array(size);
  for(let i=0;i<size;i++){
    const p=point(i);
    if((columns.some(x=>Math.abs(x-p.x)<=4)||streets.some(z=>Math.abs(z-p.z)<=3.5))&&!blocked(p.x,p.z,clearance))grid[i]=1;
  }
  roads=grid;
  return grid;
}
function connector(p:Point,grid:Uint8Array){
  const cx=Math.round((p.x-bounds.left)/cell),cz=Math.round((p.z-bounds.top)/cell);
  let best=-1, score=Infinity;
  for(let z=Math.max(0,cz-10);z<Math.min(height,cz+11);z++){
    for(let x=Math.max(0,cx-10);x<Math.min(width,cx+11);x++){
      const i=index(x,z);
      if(!grid[i])continue;
      const candidate=point(i);
      const cost=distance(p,candidate);
      // A player can be on foot at the entrance where a car does not fit.
      const radius=blocked(p.x,p.z,clearance)?.45:clearance;
      if(cost<score&&clearSegment(p,candidate,radius)){best=i;score=cost;}
    }
  }
  return best;
}
function shortest(start:number,end:number,grid:Uint8Array){
  const key=start+':'+end;
  const known=paths.get(key);
  if(known)return known;
  const prev=new Int32Array(size).fill(-1), g=new Float32Array(size).fill(Infinity);
  const open=[start], present=new Uint8Array(size); present[start]=1;
  const goal=point(end);
  g[start]=0;
  while(open.length){
    let at=0, best=Infinity;
    for(let i=0;i<open.length;i++){
      const test=g[open[i]]+distance(point(open[i]),goal);
      if(test<best){best=test;at=i;}
    }
    const node=open[at];open[at]=open[open.length-1];open.pop();present[node]=0;
    if(node===end){
      const path=[end];
      while(path[path.length-1]!==start)path.push(prev[path[path.length-1]]);
      path.reverse();
      const corners=path.filter((n,i)=>i===0||i===path.length-1||n-path[i-1]!==path[i+1]-n);
      if(paths.size>=96)paths.delete(paths.keys().next().value!);
      paths.set(key,corners);
      return corners;
    }
    const x=node%width;
    for(const step of [-width,width,-1,1]){
      if((step===-1&&x===0)||(step===1&&x===width-1))continue;
      const next=node+step;
      if(!grid[next]||g[node]+cell>=g[next])continue;
      if(!clearSegment(point(node),point(next)))continue;
      g[next]=g[node]+cell;prev[next]=node;
      if(!present[next]){present[next]=1;open.push(next);}
    }
  }
  return [];
}

/** Follow connected road lanes. The final short segment leads from parking to the door. */
export function roadRoute(from:Point,district:District):Point[]{
  const grid=roadCells(), to=parking(district);
  const start=connector(from,grid), end=connector(to,grid);
  if(start<0||end<0)return [];
  const road=shortest(start,end,grid);
  if(!road.length)return [];
  return [from,...road.map(point),to,entrance(district)].filter((p,i,a)=>i===0||distance(p,a[i-1])>.025);
}
