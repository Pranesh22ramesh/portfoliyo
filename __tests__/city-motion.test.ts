import { blocked, districts, entrance, parking, route, spawn } from '@/lib/city';
import { createMotion, emptyInput, enterExit, step, teleport } from '@/lib/city-motion';

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
