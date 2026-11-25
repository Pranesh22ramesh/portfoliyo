import { CredentialPreview } from '@/components/city/CredentialPreview';
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
    <h1>{c.title}</h1><p>{c.issuer}{c.date?' · '+c.date:''}</p>
    <div className="dw-actions">{c.verify&&<a href={c.verify}>Verify credential</a>}{c.badge&&<a href={c.badge} target="_blank" rel="noreferrer">Open issuer badge image</a>}</div>
    <CredentialPreview asset={c.asset} title={c.title+' credential issued by '+c.issuer}/>
  </main>;
}
