export const site = 'https://praneshportfolio.vercel.app';
export const github = 'https://github.com/Pranesh22ramesh';
export const linkedin = 'https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/';
export const email = 'praneshrsm@gmail.com';

export type Project = {id:string;title:string;stack:string;problem:string;solution:string;architecture:string;result:string;demo?:string;image?:string};
export const projects:Project[] = [
  { id:'Certificate_Generator', title:'Certificate Generator', stack:'React · Node.js · MongoDB',
    problem:'Issuing internship certificates manually makes it hard to track what was sent and verify a document later.',
    solution:'Manage internship records, issue certificates, export PDFs and provide a QR verification path.',
    architecture:'React interface, Node.js API and MongoDB records, with PDF generation and email delivery.',
    result:'Public source and a hosted sign-in page are available. Access to the portal requires a Twincord account.',demo:'https://certificate-generator-three-omega.vercel.app',image:'/project-images/certificate-generator/sign-in.webp' },
  { id:'Bouquit-shop-Website', title:'Bouquet Shop', stack:'React · Express · MongoDB',
    problem:'A florist needs a catalog customers can browse and an interface for managing orders.',
    solution:'Build a storefront with a shopping cart and order management.',
    architecture:'A React storefront backed by Express and MongoDB.',
    result:'Public source is available for review.' },
  { id:'rice_shop_amount_notebook', title:'Rice Shop Notebook', stack:'React Native · Expo · TypeScript',
    problem:'Paper order and collection records make daily reconciliation cumbersome.',
    solution:'Bring quantity calculations, collections and daily reporting into a mobile workflow.',
    architecture:'An Expo and React Native client with TypeScript.',
    result:'Public source is available for review.' },
  { id:'api_downtime_anlyzes', title:'API Downtime Analyzer', stack:'Python ? time series ML ? REST',
    problem:'Service operators need to identify abnormal API behavior early enough to investigate.',
    solution:'Collect API measurements and surface anomaly scores, monitoring history and risk indicators.',
    architecture:'Python monitoring services, trained model assets and a browser dashboard.',
    result:'Public source, models and tests are available for review.' },
];

export function projectLink(project: Project) {
  return project.demo
    ? { href: project.demo, label: 'Open hosted sign-in' }
    : { href: github + '/' + project.id, label: 'View GitHub repository' };
}

export type Credential = {id:string;title:string;issuer:string;date:string;asset:string;verify?:string;badge?:string};
export const credentials:Credential[] = [
  {id:'ethical-hacking',title:'Ethical Hacking 101',issuer:'Simplilearn SkillUp',date:'October 2025',asset:'/certificates/ethical-hacking-cert.png'},
  {id:'threat-management',title:'Cyber Threat Management',issuer:'Cisco Networking Academy',date:'March 2026',asset:'/certificates/cisco-threat-certificate.webp',badge:'/certificates/cyber-threat-management.png',verify:'https://www.credly.com/badges/efb8a625-4735-49fc-aced-4fff30a6589e'},
  {id:'intro-cybersecurity',title:'Introduction to Cybersecurity',issuer:'Cisco Networking Academy',date:'November 2024',asset:'/certificates/cisco-intro.webp',verify:'https://www.credly.com/go/8CphoeKo'},
  {id:'oracle-apex',title:'Oracle APEX Cloud Developer Certified Professional',issuer:'Oracle',date:'May 2025',asset:'/certificates/oracle-apex.webp'},
  {id:'oracle-java',title:'Java Certified Foundations Associate',issuer:'Oracle',date:'May 2026',asset:'/certificates/oracle-java.webp'},
  {id:'nptel-ai-hr',title:'AI in Human Resource Management',issuer:'NPTEL ? IIT Guwahati',date:'January?April 2026',asset:'/certificates/nptel-ai-hr.webp',verify:'https://nptel.ac.in/noc/E_Certificate/NOC26MG19S115810040004763256'},
  {id:'infosys-javascript',title:'JavaScript',issuer:'Infosys Springboard',date:'April 2024',asset:'/certificates/infosys-javascript.webp'},
];

export const skillGroups = [
  {title:'Frontend & mobile',skills:['React','Next.js','TypeScript','JavaScript','React Native','Expo','HTML','CSS']},
  {title:'Backend & data',skills:['Node.js','Express','Python','Java','Django','MongoDB','SQL','REST APIs']},
  {title:'Cloud & tooling',skills:['AWS EC2','S3','RDS','Docker','Git','GitHub']},
  {title:'Applied ML & testing',skills:['TensorFlow','OpenCV','Streamlit','Selenium','API testing']},
];
