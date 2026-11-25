import Image from 'next/image';
import { credentials, email, github, linkedin, projectLink, projects, skillGroups } from '@/lib/portfolio';
import type { DistrictId } from '@/lib/city';

export function Portfolio({id}:{id:DistrictId}) {
  switch(id){
    case 'home': return <div className="dw-profile">
      <Image src="/images/pranesh.jpg" alt="Pranesh Ramesh" width={112} height={112}/>
      <div><h3>Pranesh Ramesh</h3><p>I’m a Software Systems student building full stack web and mobile applications. I’m interested in cloud engineering, practical machine learning and cybersecurity.</p>
      <a className="dw-button dw-primary" href="/resume.pdf" download>Download résumé</a></div>
    </div>;
    case 'garage': return <><p>Drive with WASD or the arrow keys. Hold Space to brake, press F to get in or out and E to interact. On touch screens, use the joystick and action buttons.</p><p>Open Settings in the city to change the car’s paint, graphics, lighting or audio.</p></>;
    case 'projects': return <div className="dw-entries">{projects.map(p=>{
      const link=projectLink(p);
      return <article key={p.id}>
        <small>{p.stack}</small><h3>{p.title}</h3><p>{p.problem}</p><p>{p.solution}</p>
        <div className="dw-actions">
          <a className="dw-button dw-primary" href={link.href}>{link.label}</a>
          <a href={'/projects/'+p.id}>Read case study</a>
        </div>
      </article>;
    })}</div>;
    case 'skills': return <div className="dw-entries">{skillGroups.map(g=><article key={g.title}><h3>{g.title}</h3><ul className="dw-tags">{g.skills.map(s=><li key={s}>{s}</li>)}</ul></article>)}</div>;
    case 'university': return <div className="dw-entries"><article><h3>M.Sc. Software Systems</h3><p>Kongu Engineering College, Perundurai</p><p>2023 onward · CGPA <strong>7.18/10</strong></p></article><article><h3>Higher Secondary</h3><p>Bharani Park Matric Higher Secondary School · 2023</p></article></div>;
    case 'experience': return <div className="dw-entries"><article><small>Past internship</small><h3>Full Stack Developer Intern</h3><p>JAC MediaLand ? 2026</p></article><article><small>Past internship</small><h3>Software Developer Intern</h3><p>Twincord</p></article><article><h3>Campus leadership</h3><p>Executive head of the department association and executive member of the Freelancer and ISTE clubs.</p></article></div>;
    case 'achievements': return <><div className="dw-entries">{credentials.map(c=><article key={c.id}><small>{c.issuer}{c.date?' · '+c.date:''}</small><h3>{c.title}</h3><a href={'/credentials/'+c.id}>View credential</a></article>)}</div><p>Third prize at Hackwave 3.0.1, a Kongu Engineering College hackathon, as listed on Pranesh’s public profile.</p></>;
    case 'research': return <div className="dw-entries"><article><h3>API Downtime Analyzer</h3><p>Explored time series anomaly detection with LSTM and autoencoder models for service monitoring.</p><a href="/projects/api_downtime_anlyzes">Read case study</a></article><article><h3>Sign Language Translator</h3><p>Built a gesture recognition prototype using TensorFlow and OpenCV, with Django REST and Streamlit.</p></article><p>Prototype descriptions are documented on the public GitHub profile.</p></div>;
    case 'contact': return <><p>Have a project, internship or collaboration in mind? Get in touch by email or LinkedIn.</p><div className="dw-actions"><a className="dw-button dw-primary" href={'mailto:'+email}>Email Pranesh</a><a href={github}>GitHub</a><a href={linkedin}>LinkedIn</a></div></>;
    case 'park': return <><p>Find Byte, Cache and a surprisingly opinionated rubber duck. Park nearby, get out and walk up to a pet to say hello.</p><p>Off the clock, I play badminton, listen to music, watch movies and explore AI tools.</p></>;
  }
}
