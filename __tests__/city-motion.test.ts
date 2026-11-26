import { blocked, districts, entrance, parking, spawn, waterDepth } from '@/lib/city';
import { roadRoute as route } from '@/lib/city-route';
import { createMotion, emptyInput, enterExit, jump, recover, repair, step, teleport } from '@/lib/city-motion';

test('bridges cross the river and the river blocks crossing elsewhere',()=>{
  expect(blocked(15,0,1.7)).toBe(false);
  expect(blocked(0,0,1.7)).toBe(true);
  expect(blocked(districts[0].x,districts[0].z,1.7)).toBe(true);
  for(const location of districts) {
    const p=parking(location);
    expect(blocked(p.x,p.z,1.7)).toBe(false);
    expect(route(spawn,location).slice(-1)[0]).toEqual(entrance(location));
  }
});

test('vehicle impact reduces condition, water stalls it, and recovery restores driving',()=>{
  const m=createMotion(),input=emptyInput();
  m.velocity=18;
  step(m,input,1/60,()=>true);
  expect(m.impact).toBeGreaterThan(8);
  expect(m.health).toBeLessThan(100);
  repair(m);
  expect(m.health).toBe(100);
  expect(waterDepth(0,0)).toBeGreaterThan(1);
  expect(blocked(0,0,1.7,true)).toBe(false);
  Object.assign(m.car,{x:0,z:0});
  input.up=true;
  for(let i=0;i<170;i++)step(m,input,1/60,()=>false);
  expect(m.water).toBeGreaterThan(1);
  expect(m.submerged).toBeGreaterThan(2.8);
  expect(m.velocity).toBeLessThan(1);
  recover(m);
  expect(m.car).toEqual(spawn);
  expect(m.health).toBe(100);
});

test('acceleration, braking, reverse, exit and reset',()=>{
  const m=createMotion(), input=emptyInput();
  input.up=true;
  for(let i=0;i<60;i++)step(m,input,1/60);
  expect(m.car.z).toBeLessThan(spawn.z-3);
  expect(enterExit(m)).toMatch(/Brake/);
  input.up=false; input.brake=true;
  for(let i=0;i<30;i++)step(m,input,1/60);
  expect(enterExit(m)).toBe('On foot');
  expect(m.driving).toBe(false);
  expect(enterExit(m)).toMatch(/driver/);
  input.brake=false; input.down=true;
  for(let i=0;i<30;i++)step(m,input,1/60);
  expect(m.velocity).toBeLessThan(0);
  teleport(m);
  expect(m.car).toEqual(spawn);
});

test('GPS reaches every parking bay while avoiding blocked terrain',()=>{
  for(const target of districts){
    const points=route(spawn,target);
    expect(points.length).toBeGreaterThan(2);
    const bays=points.slice(0,-1);
    expect(bays[bays.length-1]).toEqual(parking(target));
    bays.slice(1).forEach((b,i)=>{
      const a=bays[i];
      const samples=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)*2));
      for(let step=0;step<=samples;step++){
        const t=step/samples;
        expect(blocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,1.7)).toBe(false);
      }
    });
  }
});

test('walking, running and sprinting accelerate, then jumping returns to the ground',()=>{
  const m=createMotion(),input=emptyInput();
  enterExit(m);
  const clear=()=>false;
  input.up=true;input.walk=true;
  for(let i=0;i<60;i++)step(m,input,1/60,clear);
  expect(m.velocity).toBeCloseTo(3.05);
  input.walk=false;
  for(let i=0;i<45;i++)step(m,input,1/60,clear);
  expect(m.velocity).toBeCloseTo(5.75);
  input.sprint=true;
  for(let i=0;i<45;i++)step(m,input,1/60,clear);
  expect(m.velocity).toBeCloseTo(8.6);
  jump(m);
  for(let i=0;i<16;i++)step(m,input,1/60,clear);
  expect(m.height).toBeGreaterThan(.5);
  input.up=false;
  for(let i=0;i<50;i++)step(m,input,1/60,clear);
  expect(m.height).toBe(0);
  expect(m.vertical).toBe(0);
});
