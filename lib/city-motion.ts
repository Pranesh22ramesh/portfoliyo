import { blocked, distance, parking, spawn, waterDepth, type District, type Point } from './city';

export const keys = ['up', 'down', 'left', 'right', 'brake', 'sprint', 'walk'] as const;
export type InputKey = typeof keys[number];
export type Inputs = Record<InputKey, boolean>;
export const emptyInput = (): Inputs => ({ up:false, down:false, left:false, right:false, brake:false, sprint:false, walk:false });
export type Pose = Point & { angle: number };
export function createMotion() {
  return { car: { ...spawn }, player: { ...spawn }, driving: true, velocity: 0, steering: 0, stride: 0, wheels: 0, height:0, vertical:0, jumpHeld:false, turnRate:0, health:100, impact:0, water:0, submerged:0 };
}
export type Motion = ReturnType<typeof createMotion>;
export function teleport(m: Motion, d?: District) {
  Object.assign(m, createMotion());
  if (d) Object.assign(m.car, parking(d));
}
export function enterExit(m: Motion,solid:Solid=blocked) {
  if (m.driving) {
    if (Math.abs(m.velocity) > 2.4) return 'Brake to a stop before getting out.';
    const exits = [1, -1, 0].map(side => ({
      x:m.car.x + side*Math.cos(m.car.angle)*2.6 - (side ? 0 : Math.sin(m.car.angle)*3.5),
      z:m.car.z - side*Math.sin(m.car.angle)*2.6 - (side ? 0 : Math.cos(m.car.angle)*3.5),
    }));
    const exit = exits.find(p => !solid(p.x,p.z,.45));
    if (!exit) return 'Move the car to a spot with room to get out.';
    m.player = {...exit, angle:m.car.angle};
    m.velocity = 0;
    m.driving = false;
    return 'On foot';
  }
  if(m.height>.04)return 'Land before getting into the car.';
  if (distance(m.car,m.player) > 4) return 'Walk back to your car to get in.';
  m.driving = true;
  m.velocity=0;
  return 'Back in the driver’s seat';
}
function approach(value: number, target: number, rate: number) {
  return value + Math.sign(target-value)*Math.min(Math.abs(target-value),rate);
}
export type Solid = (x:number,z:number,radius:number)=>boolean;

export function jump(m:Motion){
  if(!m.driving&&m.height===0&&m.vertical===0)m.vertical=5.65;
}
export function repair(m:Motion){m.health=100;m.impact=0;m.submerged=0;m.water=0;}
export function recover(m:Motion){teleport(m);}

export function step(m: Motion, input: Inputs, dt: number, solid:Solid=blocked) {
  const throttle = Number(input.up)-Number(input.down);
  const turn = Number(input.left)-Number(input.right);
  const pose = m.driving ? m.car : m.player;
  if (m.driving) {
    m.impact=0;
    const depth=waterDepth(pose.x,pose.z);
    m.water=depth;
    m.submerged=depth>.62?m.submerged+dt:0;
    const target = depth>.62||m.health<=0?0:throttle > 0 ? 24 : throttle < 0 ? -8 : 0;
    m.velocity = approach(m.velocity,input.brake?0:target,dt*(input.brake?32:throttle?9:4.7));
    m.velocity*=Math.max(0,1-depth*dt*1.6);
    m.steering = approach(m.steering,turn,dt*6);
    pose.angle += dt*m.steering*Math.sign(m.velocity)*Math.min(Math.abs(m.velocity)*.23,1.85);
    m.wheels -= m.velocity*dt/.43;
  } else {
    const pace=input.sprint&&throttle>0?8.6:input.walk?3.05:5.75;
    const grounded=m.height===0&&m.vertical===0;
    const rate=grounded?21:7;
    m.velocity=approach(m.velocity,throttle*pace,dt*(throttle?rate:rate*1.35));
    m.turnRate=approach(m.turnRate,turn*(input.sprint?2.25:2.8),dt*17);
    pose.angle+=m.turnRate*dt;
    if(input.brake&&!m.jumpHeld)jump(m);
    m.vertical-=16.6*dt;
    m.height+=m.vertical*dt;
    if(m.height<=0){m.height=0;m.vertical=0;}
    m.stride+=Math.abs(m.velocity)*dt*(pace>6?1.94:2.32);
  }
  const x = pose.x+Math.sin(pose.angle)*m.velocity*dt;
  const z = pose.z+Math.cos(pose.angle)*m.velocity*dt;
  const radius = m.driving?1.7:.45;
  m.jumpHeld=input.brake;
  const clear = (a:number,b:number) => !solid(a,b,radius) && (m.driving || distance({x:a,z:b},m.car)>1.45);
  if (clear(x,z)) { pose.x=x; pose.z=z; }
  else if (m.driving) {
    const speed=Math.abs(m.velocity);
    m.impact=speed;
    if(speed>3.5)m.health=Math.max(0,m.health-Math.max(1,(speed-3.5)**1.3*.68));
    m.velocity *= -.17;
  }
  else if (clear(x,pose.z)) pose.x=x;
  else if (clear(pose.x,z)) pose.z=z;
  else m.velocity=0;
}
