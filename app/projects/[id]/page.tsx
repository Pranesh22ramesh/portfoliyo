import { ProjectDetail } from '@/components/city/PortfolioDetail';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/portfolio';
import '../../world.css';

const aliases:Record<string,string>={'certificate-generator':'Certificate_Generator'};
function find(id:string){return projects.find(p=>p.id.toLowerCase()===(aliases[id.toLowerCase()]??id).toLowerCase());}
export function generateStaticParams(){return projects.map(p=>({id:p.id}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){return {title:find((await params).id)?.title??'Project'};}

export default async function Project({params}:{params:Promise<{id:string}>}){
  const p=find((await params).id);
  if(!p)notFound();
  return <main className="dw dw-detail">
    <a href="/#projects">Back to Project Lab</a>
    <h1>{p.title}</h1>
    <ProjectDetail project={p}/>
  </main>;
}
