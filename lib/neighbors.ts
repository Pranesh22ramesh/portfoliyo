export const neighbors = [
  {name:'Nila',role:'Security guard',line:'I guard the network and the front door. Somehow the front door still gets more bug reports.',x:8.6,z:41,motion:'stand',color:'#536f77',skin:'#a87153',outfit:7},
  {name:'Maya',role:'Cafe owner',line:'The espresso machine is back up. It needed a hard reset and a good talking-to.',x:34.4,z:-54.1,motion:'stand',color:'#bf8453',skin:'#b97f66',outfit:5},
  {name:'Sanjay',role:'Gardener',line:'You can fix most things with water, sunlight, and removing one dependency.',x:55.3,z:-22.5,motion:'stand',color:'#66896a',skin:'#885943',outfit:6},
  {name:'Anu',role:'Librarian',line:'You can borrow up to five books. Documentation debt is unlimited, apparently.',x:-26.7,z:-50,motion:'stand',color:'#836987',skin:'#c19376',outfit:8},
  {name:'Dev',role:'Photographer',line:'I call this angle the production build. Everything looks better from a safe distance.',x:47.6,z:-25.7,motion:'stand',color:'#ad795c',skin:'#9f694d',outfit:2},
  {name:'Isha',role:'Student',line:'My research method is one coffee, three tabs, and the wrong PDF.',x:-22,z:-40,motion:'walk',color:'#a889bb',skin:'#d3a47e',outfit:4},
  {name:'Ravi',role:'Office employee',line:'I blocked out ten minutes for a quick sync. That was three meetings ago.',x:7.5,z:-20.2,motion:'walk',color:'#69979a',skin:'#815743',outfit:7},
  {name:'Vik',role:'Delivery worker',line:'This parcel is marked urgent, which usually means it has waited three weeks.',x:52.2,z:39.4,motion:'walk',color:'#b97254',skin:'#9b6651',outfit:9},
  {name:'Meera',role:'Shopkeeper',line:'We accept cash, card, and compelling pull request descriptions.',x:-34.5,z:-21,motion:'stand',color:'#968cb6',skin:'#bc8263',outfit:5},
  {name:'Pavi',role:'Park visitor',line:'The duck knows more about debugging than my entire group project.',x:66,z:-36,motion:'sit',color:'#dc947f',skin:'#936849',outfit:3},
  {name:'Kiran',role:'Cyclist',line:'I switched to two wheels after the GPS sent me through a fountain.',x:22,z:22,motion:'walk',color:'#649c9c',skin:'#c19067',outfit:6},
  {name:'Leela',role:'Museum visitor',line:'I came for the awards. I stayed for the air conditioning.',x:22,z:-21.8,motion:'walk',color:'#ad8075',skin:'#8b5f4d',outfit:8},
] as const;

export type Neighbor = typeof neighbors[number];
