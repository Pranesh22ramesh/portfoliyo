import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projectLink, projects } from '@/lib/portfolio';
import '../../world.css';

const aliases:Record<string,string>={'certificate-generator':'Certificate_Generator'};
function find(id:string){return projects.find(p=>p.id.toLowerCase()===(aliases[id.toLowerCase()]??id).toLowerCase());}
export function generateStaticParams(){return projects.map(p=>({id:p.id}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){return {title:find((await params).id)?.title??'Project'};}

export default async function Project({params}:{params:Promise<{id:string}>}){
  const p=find((await params).id);
  if(!p)notFound();
  const link=projectLink(p);
  return <main className="dw dw-detail">
    <a href="/#projects">Back to Project Lab</a>
    <h1>{p.title}</h1><p>{p.stack}</p>
    {p.image&&<figure className="dw-project-image"><Image src={p.image} alt="Twincord certificate portal sign-in screen" width={1000} height={644}/><figcaption>Public sign-in screen for the certificate portal</figcaption></figure>}
    <div className="dw-entries">{[ ['Problem',p.problem],['Solution',p.solution],['Architecture',p.architecture],['Evidence',p.result] ].map(([label,content])=><article key={label}><h2>{label}</h2><p>{content}</p></article>)}</div>
    <a className="dw-button dw-primary" href={link.href}>{link.label}</a>
  </main>;
}
