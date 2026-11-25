import { blocked, distance, parking, spawn, type District, type Point } from './city';

export const keys = ['up', 'down', 'left', 'right', 'brake'] as const;
export type InputKey = typeof keys[number];
export type Inputs = Record<InputKey, boolean>;
export const emptyInput = (): Inputs => ({ up:false, down:false, left:false, right:false, brake:false });
export type Pose = Point & { angle: number };
export function createMotion() {
  return { car: { ...spawn }, player: { ...spawn }, driving: true, velocity: 0, steering: 0, stride: 0, wheels: 0 };
}
export type Motion = ReturnType<typeof createMotion>;
export function teleport(m: Motion, d?: District) {
  Object.assign(m, createMotion());
  if (d) Object.assign(m.car, parking(d));
}
export function enterExit(m: Motion) {
  if (m.driving) {
    if (Math.abs(m.velocity) > 2.4) return 'Brake to a stop before getting out.';
    const exits = [1, -1, 0].map(side => ({
      x:m.car.x + side*Math.cos(m.car.angle)*2.6 - (side ? 0 : Math.sin(m.car.angle)*3.5),
      z:m.car.z - side*Math.sin(m.car.angle)*2.6 - (side ? 0 : Math.cos(m.car.angle)*3.5),
    }));
    const exit = exits.find(p => !blocked(p.x,p.z,.45));
    if (!exit) return 'Move the car to a spot with room to get out.';
    m.player = {...exit, angle:m.car.angle};
    m.velocity = 0;
    m.driving = false;
    return 'On foot';
  }
  if (distance(m.car,m.player) > 4) return 'Walk back to your car to get in.';
  m.driving = true;
  return 'Back in the driver’s seat';
}
function approach(value: number, target: number, rate: number) {
  return value + Math.sign(target-value)*Math.min(Math.abs(target-value),rate);
}
export function step(m: Motion, input: Inputs, dt: number) {
  const throttle = Number(input.up)-Number(input.down);
  const turn = Number(input.left)-Number(input.right);
  const pose = m.driving ? m.car : m.player;
  if (m.driving) {
    const target = throttle > 0 ? 24 : throttle < 0 ? -8 : 0;
    m.velocity = approach(m.velocity,input.brake?0:target,dt*(input.brake?32:throttle?9:4.7));
    m.steering = approach(m.steering,turn,dt*6);
    pose.angle += dt*m.steering*Math.sign(m.velocity)*Math.min(Math.abs(m.velocity)*.23,1.85);
    m.wheels -= m.velocity*dt/.43;
  } else {
    pose.angle += turn*dt*2.8;
    m.velocity = throttle*6;
    m.stride += Math.abs(m.velocity)*dt*2.2;
  }
  const x = pose.x+Math.sin(pose.angle)*m.velocity*dt;
  const z = pose.z+Math.cos(pose.angle)*m.velocity*dt;
  const radius = m.driving?1.7:.45;
  const clear = (a:number,b:number) => !blocked(a,b,radius) && (m.driving || distance({x:a,z:b},m.car)>1.45);
  if (clear(x,z)) { pose.x=x; pose.z=z; }
  else if (m.driving) m.velocity *= -.17;
  else if (clear(x,pose.z)) pose.x=x;
  else if (clear(pose.x,z)) pose.z=z;
}
