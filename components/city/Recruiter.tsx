'use client';

import { useState } from 'react';
import { districts } from '@/lib/city';
import { credentials, projects, skillGroups } from '@/lib/portfolio';
import { Portfolio } from './Portfolio';

const details:Record<string,string> = {
  home:'Pranesh Ramesh software systems full stack cloud mobile machine learning cybersecurity resume',
  projects:projects.map(p=>[p.title,p.stack,p.problem,p.solution].join(' ')).join(' '),
  skills:skillGroups.flatMap(g=>[g.title,...g.skills]).join(' '),
  university:'M.Sc. Software Systems Kongu Engineering College CGPA 7.18 Bharani Park',
  experience:'JAC MediaLand Twincord Full Stack Developer Intern Software Developer Intern',
  achievements:credentials.map(c=>c.title+' '+c.issuer+' '+c.date).join(' ')+' Hackwave paper presentation Adithya awards',
  research:'API Downtime Analyzer LSTM Autoencoder Sign Language Translator TensorFlow OpenCV',
  contact:'email GitHub LinkedIn Pranesh Ramesh',
  park:'badminton music movies AI tools hobbies interests pets',
};
export function Recruiter(){
  const [query,setQuery]=useState('');
  const terms=query.toLowerCase().trim().split(/\s+/);
  const matches=districts.filter(d=>terms.every(t=>(d.name+' '+d.topic+' '+(details[d.id]??'')).toLowerCase().includes(t)));
  return <section id="recruiter" className="dw-recruiter" aria-labelledby="recruiter-title">
    <div className="dw-recruiter-top">
      <div><p className="dw-kicker">Pranesh Ramesh</p><h2 id="recruiter-title">Recruiter Mode</h2><p>Projects, experience and credentials in one place.</p></div>
      <label className="dw-search">Search portfolio<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try React, Cisco or Twincord"/></label>
    </div>
    <nav className="dw-index" aria-label="Portfolio sections">{matches.map(d=><a key={d.id} href={'#'+d.id}>{d.name}</a>)}</nav>
    {!matches.length&&<p role="status">No matching sections. Try a company, skill or project name.</p>}
    <div className="dw-content-grid">{matches.map(d=><section key={d.id} id={d.id} className="dw-content-card" style={{borderTopColor:d.color}}>
      <div className="dw-section-title"><h2>{d.name}</h2><a href={'#'+d.id} aria-label={'Link to '+d.name}>#</a></div>
      <Portfolio id={d.id}/>
    </section>)}</div>
  </section>;
}
