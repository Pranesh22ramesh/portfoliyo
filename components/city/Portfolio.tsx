import Image from 'next/image';
import type { MouseEvent } from 'react';
import { additionalTraining, awards, credentials, education, email, experience, github, linkedin, profile, projectLink, projects, research, researchProjects, skillGroups } from '@/lib/portfolio';
import type { DistrictId } from '@/lib/city';

type DetailKind='project'|'credential';
export function Portfolio({id,onDetail}:{id:DistrictId;onDetail?:(kind:DetailKind,id:string)=>void}) {
  function detail(e:MouseEvent<HTMLAnchorElement>,kind:DetailKind,key:string){
    if(!onDetail||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();onDetail(kind,key);
  }
  switch(id){
    case 'home': return <div className="dw-profile">
      <Image src="/images/pranesh.jpg" alt={profile.name} width={112} height={112}/>
      <div><h3>{profile.name}</h3><p><strong>{profile.headline}</strong></p><p>{profile.summary}</p>
      <a className="dw-button dw-primary" href="/resume.pdf" download>Download Resume</a></div>
    </div>;
    case 'garage': return <><p>Drive with WASD or the arrow keys. Hold Space to brake and press F to get in or out. On foot, hold X to walk, Shift to sprint and tap Space to jump. E interacts and P opens the field phone. On touch screens, use the joystick and action buttons.</p><p>Open Settings in the city to change the car’s paint, graphics, lighting or audio.</p></>;
    case 'projects': return <div className="dw-entries">{projects.map(p=>{
      const link=projectLink(p);
      return <article key={p.id}>
        <small>{p.stack}</small><h3>{p.title}</h3><p>{p.problem}</p><p>{p.solution}</p>
        <div className="dw-actions">
          {link&&<a className="dw-button dw-primary" href={link.href}>{link.label}</a>}
          <a href={'/projects/'+p.id} onClick={onDetail?e=>detail(e,'project',p.id):undefined}>Read case study</a>
        </div>
      </article>;
    })}</div>;
    case 'skills': return <div className="dw-entries">{skillGroups.map(g=><article key={g.title}><h3>{g.title}</h3><ul className="dw-tags">{g.skills.map(s=><li key={s}>{s}</li>)}</ul></article>)}</div>;
    case 'university': return <div className="dw-entries"><article><h3>{education.degree}</h3><p>{education.college}</p><p>{education.dates} · CGPA <strong>{education.cgpa}</strong></p><p>{education.coursework}</p></article><article><h3>Higher Secondary Certificate</h3><p>{education.school} · 2023</p></article></div>;
    case 'experience': return <div className="dw-entries">{experience.map(role=><article key={role.title}>{role.status&&<small>{role.status}</small>}<h3>{role.title}</h3><p>{role.description}</p></article>)}</div>;
    case 'achievements': return <><div className="dw-entries">{credentials.map(c=><article key={c.id}><small>{c.issuer}{c.date?' · '+c.date:''}</small><h3>{c.title}</h3><a href={'/credentials/'+c.id} onClick={onDetail?e=>detail(e,'credential',c.id):undefined}>View credential</a></article>)}</div><div className="dw-awards">
      <h3>Achievements</h3>
      <ul>{awards.map(award=><li key={award}>{award}</li>)}</ul>
      <h3>Additional training</h3>
      <ul>{additionalTraining.map(course=><li key={course.title}>{course.title} · {course.provider} · {course.year}</li>)}</ul>
    </div></>;
    case 'research': return <div className="dw-entries">
      <article><small>Research manuscript</small><h3>{research.title}</h3><p>{research.description}</p><a href={research.repo}>View GitHub repository</a></article>
      {researchProjects.map(p=><article key={p.id}>
        <h3>{p.title}</h3><p>{p.solution}</p><a href={'/projects/'+p.id} onClick={onDetail?e=>detail(e,'project',p.id):undefined}>Read case study</a>
      </article>)}
    </div>;
    case 'contact': return <><p>{profile.location}. {profile.availability}</p><p>{profile.languages}.</p><div className="dw-actions"><a className="dw-button dw-primary" href={'mailto:'+email}>Email Pranesh</a><a href={github}>GitHub</a><a href={linkedin}>LinkedIn</a></div><p className="dw-email-address">{email}</p></>;
    case 'park': return <><p>Find Byte, Cache and a surprisingly opinionated rubber duck. Park nearby, get out and walk up to a pet to say hello.</p><p>Off the clock, I play badminton, listen to music, watch movies and explore AI tools.</p></>;
  }
}
