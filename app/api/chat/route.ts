import { email } from '@/lib/portfolio';

const replies = [
  { terms:/resume|résumé|about|profile/i, text:'You can download Pranesh’s [résumé](/resume.pdf) or read his [profile](/#home).' },
  { terms:/skill|stack|react|python/i, text:'The [Skill Workshop](/#skills) covers frontend, mobile, backend, cloud and applied ML.' },
  { terms:/project|work|code/i, text:'See the [Project Lab](/#projects) for selected work and GitHub repositories.' },
  { terms:/intern|job|experience/i, text:'Pranesh held internships at JAC MediaLand and Twincord. See [IT Park](/#experience).' },
  { terms:/course|award|certif/i, text:'The [Achievement Museum](/#achievements) contains certificate images and available issuer links.' },
  { terms:/contact|email/i, text:'Reach Pranesh by [email](mailto:'+email+') or visit the [Post Office](/#contact).' },
];

export async function POST(request:Request) {
  try {
    const body=await request.json();
    const message=Array.isArray(body?.messages)?body.messages[body.messages.length-1]?.content:undefined;
    if(typeof message!=='string'||message.length>2000)return new Response('Invalid message.',{status:400});
    const text=replies.find(entry=>entry.terms.test(message))?.text??'Open [Recruiter Mode](/#recruiter) to search projects, education, experience and credentials.';
    return new Response('data: '+JSON.stringify({type:'content_block_delta',delta:{text}})+'\n\ndata: [DONE]\n\n',
      {headers:{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store'}});
  } catch {
    return new Response('Invalid request.',{status:400});
  }
}
