'use client';

import { useState, type CSSProperties } from 'react';
import { districts, type District } from '@/lib/city';
import { additionalTraining, awards, credentials, education, email, experience, profile, projects, research, researchProjects, skillGroups } from '@/lib/portfolio';

const keywords:Record<string,string>={
  home:[profile.name,profile.headline,profile.summary,'Pranesh Ramesh cybersecurity resume'].join(' '),
  projects:projects.map(p=>[p.title,p.stack,p.problem,p.solution].join(' ')).join(' '),
  skills:skillGroups.flatMap(g=>[g.title,...g.skills]).join(' '),
  university:'CGPA '+Object.values(education).join(' '),
  experience:experience.flatMap(role=>[role.title,role.status,role.description]).join(' '),
  achievements:[...credentials.flatMap(c=>[c.title,c.issuer,c.date]),...additionalTraining.flatMap(c=>[c.title,c.provider,c.year]),...awards].join(' '),
  research:[research.title,research.description,...researchProjects.flatMap(p=>[p.title,p.stack,p.solution])].join(' '),
  contact:['email GitHub LinkedIn Pranesh Ramesh',profile.name,profile.location,profile.languages,profile.availability,email].join(' '),
  park:'badminton music movies AI tools hobbies interests pets',
};

export function Directory({onSelect}:{onSelect:(d:District)=>void}){
  const [query,setQuery]=useState('');
  const terms=query.toLowerCase().trim().split(/\s+/);
  const matches=districts.filter(d=>terms.every(t=>[d.name,d.topic,keywords[d.id]].join(' ').toLowerCase().includes(t)));
  return <>
    <label className="dw-search">Search portfolio<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try MERN, ForensIQ or IGBC"/></label>
    <ul className="dw-atlas-list" aria-label="Portfolio destinations">
      {matches.map(d=><li key={d.id}>
        <button type="button" style={{'--district':d.color} as CSSProperties} onClick={()=>onSelect(d)}>
          <strong>{d.name}</strong><span>{d.topic}</span>
        </button>
      </li>)}
    </ul>
    {!matches.length&&<p role="status">No matching destinations. Try a company, skill or project name.</p>}
  </>;
}
