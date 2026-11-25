import Image from 'next/image';
import { projectLink, type Project, type Credential } from '@/lib/portfolio';
import { CredentialPreview } from './CredentialPreview';

export function ProjectDetail({project:p}:{project:Project}){
  const link=projectLink(p);
  return <>
    <p>{p.stack}</p>
    {p.image&&<figure className="dw-project-image"><Image src={p.image} alt="Twincord certificate portal sign-in screen" width={1000} height={644}/><figcaption>Public sign-in screen for the certificate portal</figcaption></figure>}
    <div className="dw-entries">{[['Problem',p.problem],['Solution',p.solution],['Architecture',p.architecture],['Evidence',p.result]].map(([label,content])=><article key={label}><h3>{label}</h3><p>{content}</p></article>)}</div>
    <div className="dw-actions"><a className="dw-button dw-primary" href={link.href}>{link.label}</a></div>
  </>;
}

export function CredentialDetail({credential:c}:{credential:Credential}){
  return <>
    <p>{c.issuer}{c.date?' · '+c.date:''}</p>
    <div className="dw-actions">{c.verify&&<a href={c.verify}>Verify credential</a>}{c.badge&&<a href={c.badge} target="_blank" rel="noreferrer">Open issuer badge image</a>}</div>
    <CredentialPreview asset={c.asset} title={c.title+' credential issued by '+c.issuer}/>
  </>;
}
