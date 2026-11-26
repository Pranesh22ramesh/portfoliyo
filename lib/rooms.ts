export type RoomId='garage'|'research';
export const roomLabels:Record<RoomId,string>={garage:'Garage showroom',research:'Research gallery'};
const obstacles=[
  {x:-4.35,z:-.2,w:.92,d:4.6},
  {x:4.35,z:-.2,w:.92,d:4.6},
  {x:0,z:-2.25,w:2.25,d:2.15},
];
export function roomBlocked(x:number,z:number,radius:number){
  if(Math.abs(x)>5.55-radius||Math.abs(z)>6.35-radius)return true;
  return obstacles.some(o=>Math.abs(x-o.x)<o.w+radius&&Math.abs(z-o.z)<o.d+radius);
}
