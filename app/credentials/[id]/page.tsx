import { CredentialDetail } from '@/components/city/PortfolioDetail';
import { notFound } from 'next/navigation';
import { credentials } from '@/lib/portfolio';
import '../../world.css';

export function generateStaticParams(){return credentials.map(c=>({id:c.id}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;return {title:credentials.find(c=>c.id===id)?.title??'Credential'};}
export default async function Credential({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const c=credentials.find(c=>c.id===id);
  if(!c)notFound();
  return <main className="dw dw-detail">
    <a href="/#achievements">Back to Achievement Museum</a>
    <h1>{c.title}</h1>
    <CredentialDetail credential={c}/>
  </main>;
}
