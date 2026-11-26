import { blocked, columns, distance, streets, type Point } from './city';

export type SignalColor='red'|'amber'|'green';
type LaneAxis='northSouth'|'eastWest';
export function lightAt(time:number,x:number,z:number,axis:LaneAxis):SignalColor{
  const phase=((time+x*.009+z*.021)%20+20)%20;
  if(axis==='northSouth')return phase<8?'green':phase<9?'amber':'red';
  return phase>=10&&phase<18?'green':phase>=18&&phase<19?'amber':'red';
}

const routes:readonly (readonly Point[])[]=[
  [{x:16.8,z:46.8},{x:16.8,z:-13.2},{x:46.8,z:-13.2},{x:46.8,z:46.8}],
  [{x:-13.2,z:-47.8},{x:-13.2,z:16.8},{x:-43.2,z:16.8},{x:-43.2,z:-47.8}],
  [{x:13.2,z:-73.2},{x:13.2,z:-16.8},{x:-16.8,z:-16.8},{x:-16.8,z:-73.2}],
  [{x:73.2,z:42.4},{x:73.2,z:-16.8},{x:43.2,z:-16.8},{x:43.2,z:42.4}],
];
const colors=['#86aeba','#d3a474','#bc7e75','#a3a58e','#a0a1bd','#618982'];

export type TrafficCar = Point & { lane:number; next:number; angle:number; velocity:number; wheels:number; color:string; trim:number; waiting:boolean };
export function createTraffic():TrafficCar[]{
  return [0,1,2,3,0,1].map((lane,i)=>{
    const road=routes[lane], start=i<4?road[0]:road[2], next=i<4?1:3, target=road[next];
    const ratio=i===0?.085:i<4?.14:.38;
    return {
      x:start.x+(target.x-start.x)*ratio,z:start.z+(target.z-start.z)*ratio,lane,next,
      angle:Math.atan2(target.x-start.x,target.z-start.z),velocity:4,wheels:0,
      color:colors[i],trim:i%3,waiting:false,
    };
  });
}
function approach(from:number,to:number,amount:number){return from+Math.sign(to-from)*Math.min(Math.abs(to-from),amount);}

function signalDistance(car:TrafficCar,axis:LaneAxis,direction:number,time:number){
  const vertical=axis==='northSouth';
  const road=vertical?columns:streets;
  const cross=vertical?streets:columns;
  const fixed=vertical?car.x:car.z;
  const lane=road.reduce((best,n)=>Math.abs(n-fixed)<Math.abs(best-fixed)?n:best);
  let gap=Infinity;
  for(const center of cross){
    const d=(center-(vertical?car.z:car.x))*direction;
    if(d<5.02||d>25)continue;
    const signal=lightAt(time,vertical?lane:center,vertical?center:lane,axis);
    if(signal==='red'||(signal==='amber'&&d>9))gap=Math.min(gap,Math.max(0,d-5.1));
  }
  return gap;
}

/** Traffic uses curated lanes and a shared signal cycle. Vehicle positions stay physical even while offscreen. */
export function advanceTraffic(cars:TrafficCar[],time:number,dt:number,obstacles:readonly Point[]){
  const relevant=[...cars,...obstacles];
  for(const car of cars){
    const road=routes[car.lane], goal=road[car.next];
    const remaining=distance(car,goal);
    if(remaining<.065){
      car.next=(car.next+1)%road.length;
      continue;
    }
    const dx=(goal.x-car.x)/remaining,dz=(goal.z-car.z)/remaining;
    const vertical=Math.abs(dz)>.5;
    let gap=signalDistance(car,vertical?'northSouth':'eastWest',vertical?Math.sign(dz):Math.sign(dx),time);
    for(const other of relevant){
      if(other===car)continue;
      const relX=other.x-car.x,relZ=other.z-car.z;
      const ahead=relX*dx+relZ*dz, lateral=Math.abs(relX*dz-relZ*dx);
      if(ahead>0&&lateral<2.38)gap=Math.min(gap,Math.max(0,ahead-4.95));
    }
    car.waiting=gap<.25;
    const limit=remaining<5.8?4.25:car.trim===1?8.9:10.5;
    const allowed=Math.min(limit,Math.sqrt(Math.max(0,gap*11)));
    car.velocity=approach(car.velocity,allowed,dt*(allowed<car.velocity?9:3.1));
    const travel=Math.min(remaining,Math.max(0,gap),car.velocity*dt);
    if(!blocked(car.x+dx*travel,car.z+dz*travel,1.12)){
      car.x+=dx*travel;car.z+=dz*travel;
      car.wheels-=travel/.43;
    }else car.velocity=0;
    const target=Math.atan2(dx,dz),delta=Math.atan2(Math.sin(target-car.angle),Math.cos(target-car.angle));
    car.angle+=delta*Math.min(1,dt*5.8);
  }
}
export function trafficSolid(cars:readonly TrafficCar[],x:number,z:number,radius:number){
  return cars.some(car=>{
    const dx=x-car.x,dz=z-car.z;
    const side=dx*Math.cos(car.angle)-dz*Math.sin(car.angle);
    const ahead=dx*Math.sin(car.angle)+dz*Math.cos(car.angle);
    return Math.abs(side)<1.01+radius*.83&&Math.abs(ahead)<2.13+radius*.84;
  });
}
