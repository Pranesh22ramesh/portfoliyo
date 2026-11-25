export const districts = [
  { id: 'home', name: 'Home', topic: 'Profile & resume', color: '#ff765e', x: -30, z: 30, host: 'City Guide', line: 'Welcome! The car is yours. The parking tickets are fictional.' },
  { id: 'garage', name: 'Garage', topic: 'Driving & paint shop', color: '#ffc65a', x: 0, z: 30, host: 'Mechanic', line: 'Have you tried turning it off and on again?' },
  { id: 'projects', name: 'Project Lab', topic: 'Selected work', color: '#6a8eff', x: 30, z: 30, host: 'Software Developer', line: 'My code has no bugs. It just has unexpected features.' },
  { id: 'skills', name: 'Skill Workshop', topic: 'Technical toolkit', color: '#b296ff', x: -30, z: -30, host: 'Security Mentor', line: 'The strongest password is the one you didn’t name password.' },
  { id: 'university', name: 'University', topic: 'Education', color: '#ff9873', x: -30, z: -60, host: 'Professor', line: 'My office hours are O(n), but the queue grows exponentially.' },
  { id: 'experience', name: 'IT Park', topic: 'Internships', color: '#65cebb', x: 0, z: -30, host: 'Recruiter', line: 'Five years of experience? For an internship? Let me fix that job post.' },
  { id: 'achievements', name: 'Achievement Museum', topic: 'Certificates & awards', color: '#ffc65a', x: 30, z: -30, host: 'Museum Keeper', line: 'Please do not tap the glass. That’s our only production environment.' },
  { id: 'research', name: 'Research Center', topic: 'Applied ML prototypes', color: '#73d3fa', x: 0, z: -60, host: 'Scientist', line: 'All models are wrong. Mine is currently compiling.' },
  { id: 'contact', name: 'Post Office', topic: 'Contact & links', color: '#ff96b3', x: 60, z: 30, host: 'Postman', line: 'I deliver packets too. The stamps cost extra.' },
  { id: 'park', name: 'Fun Park', topic: 'Pets & secrets', color: '#82d580', x: 60, z: -30, host: 'Sleepy Programmer', line: 'I asked AI to fix my code. Now we both need help.' },
] as const;

export type District = typeof districts[number];
export type DistrictId = District['id'];
export type Point = { x: number; z: number };
export const columns = [-45, -15, 15, 45, 75];
export const streets = [-75, -45, -15, 15, 45, 60];
export const spawn = { x: 15, z: 49, angle: Math.PI };
export const bounds = { left: -57, right: 86, top: -84, bottom: 68 };
export const parkedCars = [
  {x:27,z:44,color:'#71a6d9'}, {x:-35,z:43,color:'#ecb463'},
  {x:53,z:-46,color:'#ed8894'}, {x:68,z:45,color:'#b7a3e4'},
  {x:-37,z:-44,color:'#52a992'}, {x:9,z:-42,color:'#d6ddbb'},
];
export const shop={x:30,z:-61};
export const secret={x:36,z:-67,name:'The Debugger’s Bench',line:'Build passed on the first try. This bench commemorates the occasion.'};
export const pets = [
  { x: 55, z: -32, name: 'Byte the dog', line: 'Byte fetched a byte. It was a very short stick.' },
  { x: 68, z: -26, name: 'Cache the cat', line: 'Cache ignores you until you clear your cache.' },
  { x: 71, z: -55, name: 'The Rubber Duck', line: 'You explained your bug aloud. The duck found the off-by-one error.' },
] as const;
export function entrance(d: District): Point { return { x: d.x + 5, z: d.z + 10 }; }
export function parking(d: District) { return { x: d.x + 4, z: d.z + 14, angle: Math.PI / 2 }; }
export function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.z - b.z); }
export function blocked(x: number, z: number, r: number) {
  if (x-r < bounds.left || x+r > bounds.right || z-r < bounds.top || z+r > bounds.bottom) return true;
  if (Math.abs(z) < 7+r && !columns.some(c => Math.abs(c-x) < 5.6-r)) return true;
  if (((x-61)/9)**2 + ((z+57)/7)**2 < (1+r/7)**2) return true;
  if(Math.abs(x-shop.x)<6.6+r&&Math.abs(z-shop.z)<4.1+r)return true;
  if(parkedCars.some(p=>Math.abs(x-p.x)<2.15+r&&Math.abs(z-p.z)<1.2+r))return true;
  return districts.some(d => d.id !== 'park' && Math.abs(x-d.x)<8+r && Math.abs(z-d.z)<7+r);
}
export const stamps = [
  ['projects','Project Explorer'], ['skills','Skill Hunter'], ['research','Research Detective'], ['achievements','Achievement Collector'],
] as const;
