'use client';

import { useState, type CSSProperties } from 'react';
import { districts, type District } from '@/lib/city';
import { credentials, email, projects, skillGroups } from '@/lib/portfolio';

const keywords:Record<string,string>={
  home:'Pranesh Ramesh software systems full stack development cloud mobile machine learning cybersecurity resume',
  projects:projects.map(p=>[p.title,p.stack,p.problem,p.solution].join(' ')).join(' '),
  skills:skillGroups.flatMap(g=>[g.title,...g.skills]).join(' '),
  university:'M.Sc. Software Systems Kongu Engineering College CGPA 7.18 Bharani Park',
  experience:'JAC MediaLand Twincord Full Stack Developer Intern Software Developer Intern leadership Freelancer ISTE',
  achievements:credentials.map(c=>c.title+' '+c.issuer+' '+c.date).join(' ')+' Hackwave paper presentation Adithya awards',
  research:'API Downtime Analyzer LSTM Autoencoder Sign Language Translator TensorFlow OpenCV',
  contact:'email GitHub LinkedIn Pranesh Ramesh '+email,
  park:'badminton music movies AI tools hobbies interests pets',
};

export function Directory({onSelect}:{onSelect:(d:District)=>void}){
  const [query,setQuery]=useState('');
  const terms=query.toLowerCase().trim().split(/\s+/);
  const matches=districts.filter(d=>terms.every(t=>[d.name,d.topic,keywords[d.id]].join(' ').toLowerCase().includes(t)));
  return <>
    <label className="dw-search">Search portfolio<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try React, Cisco or Twincord"/></label>
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
