import { advanceTraffic, createTraffic, lightAt, trafficSolid } from '@/lib/traffic';
import { canCompleteMission, missions } from '@/lib/missions';
import { roomBlocked } from '@/lib/rooms';
import { blocked, lookoutHeight, pondLookout } from '@/lib/city';

test('signal phases prevent both directions from getting green at once',()=>{
  for(let t=0;t<40;t+=.17){
    expect(lightAt(t,15,45,'northSouth')==='green'&&lightAt(t,15,45,'eastWest')==='green').toBe(false);
  }
});
test('traffic stops outside the intersection on red and proceeds on green',()=>{
  const car=createTraffic()[0];
  Object.assign(car,{x:16.8,z:52,velocity:5});
  for(let i=0;i<180;i++)advanceTraffic([car],12,1/60,[]);
  expect(car.z).toBeCloseTo(50.1,1);
  expect(car.velocity).toBeCloseTo(0,1);
  for(let i=0;i<80;i++)advanceTraffic([car],2,1/60,[]);
  expect(car.z).toBeLessThan(49);
});
test('traffic yields to a blocking visitor and is solid from the side',()=>{
  const car=createTraffic()[0];
  Object.assign(car,{x:16.8,z:29,velocity:4});
  for(let i=0;i<100;i++)advanceTraffic([car],2,1/60,[{x:16.8,z:22}]);
  expect(car.z).toBeGreaterThanOrEqual(26.94);
  expect(trafficSolid([car],car.x,car.z,1.7)).toBe(true);
  expect(trafficSolid([car],car.x+6,car.z,1.7)).toBe(false);
});
test('mission verification is tied to the destination and room geometry blocks obstacles',()=>{
  expect(canCompleteMission(missions[0],'projects',false)).toBe(true);
  expect(canCompleteMission(missions[0],'projects',true)).toBe(false);
  expect(canCompleteMission(missions[0],'home',false)).toBe(false);
  expect(roomBlocked(0,4.4,.45)).toBe(false);
  expect(roomBlocked(0,-2.25,.45)).toBe(true);
  expect(roomBlocked(6,0,.45)).toBe(true);
});
test('the pond lookout is walkable and blends to the bordering ground',()=>{
  const {x,z,width}=pondLookout;
  expect(lookoutHeight(x,z)).toBeCloseTo(.92);
  expect(lookoutHeight(x+width/2,z)).toBeCloseTo(0);
  expect(lookoutHeight(60,45)).toBe(0);
  expect(blocked(x,z,.42)).toBe(false);
  expect(blocked(x,-65.75,.42)).toBe(true);
});
