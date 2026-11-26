export const site = 'https://praneshportfolio.vercel.app';
export const github = 'https://github.com/Pranesh22ramesh';
export const linkedin = 'https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/';
export const email = 'praneshrsm@gmail.com';
export const profile = {
  name:'Pranesh B R',
  headline:'Full Stack Developer · MERN · AI/ML · Cloud & DevOps',
  summary:'I’m a full stack developer and M.Sc. Software Systems student with over two years of experience building web applications, machine learning systems and cloud software. I work with MERN, Python and REST APIs, and have working knowledge of AWS, Docker and CI/CD.',
  location:'Karur, Tamil Nadu, India',
  languages:'Tamil (native) and English (professional proficiency)',
  availability:'Available immediately for on-site roles in Tamil Nadu or remote and hybrid roles across India.',
};
export const education = {
  degree:'M.Sc. Software Systems', college:'Kongu Engineering College, Perundurai', cgpa:'7.12/10', dates:'2023–Present',
  coursework:'Data Structures & Algorithms, Cloud Computing, Machine Learning, Web Technologies, Software Testing and Database Management.',
  school:'Bharani Park Matriculation Higher Secondary School, Karur',
};
export const experience = [
  {title:'IGBC Domain Expert & Sustainability Assessor', status:'Current', description:'Work on sustainability assessment as a domain expert for the Indian Green Building Council (IGBC).'},
  {title:'AI Knowledge Engineer', status:'Current', description:'Also work in AI knowledge engineering.'},
  {title:'Full Stack Developer Intern',status:'Past internship',description:'JAC MediaLand · 2026'},
  {title:'Software Developer Intern',status:'Past internship',description:'Twincord'},
  {title:'Campus leadership',status:'',description:'Executive head of the department association and executive member of the Freelancer and ISTE clubs. Led group projects as project lead.'},
];

export type Project = {id:string;title:string;stack:string;problem:string;solution:string;architecture:string;result:string;repo?:string;demo?:string;image?:string};
export const projects:Project[] = [
  { id:'forensiq', title:'ForensIQ', stack:'React · TypeScript · Node.js · Gemini API',
    problem:'Forensic reviewers need to preserve and review DVR and NVR evidence across different vendor formats.',
    solution:'Built a Smart India Hackathon 2025 MVP covering more than 12 stages, from evidence intake and integrity checks to metadata extraction, recovery, tamper analysis and reporting.',
    architecture:'Uses Gemini 2.5 Flash for video analytics, SHA-256 and MD5 for integrity checks, a chain-of-custody ledger, and synchronized multi-camera timelines. Exports PDF and DOCX reports.',
    result:'The MVP supports eight DVR/NVR vendors, including Hikvision, Dahua, CP Plus, Honeywell, Uniview and TP-Link.' },
  { id:'Certificate_Generator', repo:'Certificate_Generator', title:'Certificate Generator', stack:'MERN · QR verification · Nodemailer · PDF export',
    problem:'Issuing internship certificates manually makes it hard to track what was sent and verify a document later.',
    solution:'Manage intern records and certificate status in a dashboard, issue QR-verifiable certificates and export PDFs.',
    architecture:'React interface, Node.js API and MongoDB records, with PDF generation and automated Nodemailer notifications.',
    result:'The Resume reports about 80% less processing time. The public sign-in leads to a portal that requires a Twincord account.',demo:'https://certificate-generator-three-omega.vercel.app',image:'/project-images/certificate-generator/sign-in.webp' },
  { id:'Bouquit-shop-Website', repo:'Bouquit-shop-Website', title:'Bouquet Shop', stack:'MERN · AI chatbot',
    problem:'A florist needs a catalog customers can browse and an interface for managing orders.',
    solution:'Built a storefront with a catalog, cart, checkout, order tracking, and a GPT-powered customer support chatbot.',
    architecture:'A React storefront backed by Express and MongoDB, with an admin dashboard for inventory, orders and sales reporting.',
    result:'Public source is available for review.' },
  { id:'rice_shop_amount_notebook', repo:'rice_shop_amount_notebook', title:'Rice Amount Calculation App', stack:'React Native · Expo · JWT · SMS',
    problem:'Paper order and collection records make daily reconciliation cumbersome.',
    solution:'Built an iOS and Android app for orders, collections, quantity calculations and daily reports.',
    architecture:'An Expo and React Native client with TypeScript, JWT authentication, SMS one-time passwords and PDF reports.',
    result:'The Resume reports 95% fewer manual calculation errors and more than two hours saved per day on reconciliation.' },
  { id:'api_downtime_anlyzes', repo:'api_downtime_anlyzes', title:'API Downtime Analyzer', stack:'Python · LSTM · Autoencoders · REST',
    problem:'Service operators need to identify abnormal API behavior early enough to investigate.',
    solution:'Collected API measurements and built a dashboard and real-time alerts for anomalies and health trends.',
    architecture:'Python monitoring services use LSTM and autoencoder models to score time-series measurements.',
    result:'The Resume reports about 90% downtime prediction accuracy. The repository contains the source, model assets and tests.' },
  { id:'sign-language-translator', title:'Sign Language Translator', stack:'TensorFlow · OpenCV · Django REST · Streamlit',
    problem:'A live video interface needs to recognize sign gestures and provide immediate feedback.',
    solution:'Built a prototype for real-time sign gesture recognition and facial emotion detection.',
    architecture:'TensorFlow and OpenCV process live video, with a Django REST backend and a Streamlit interface.',
    result:'The prototype recognizes more than 20 gestures in live video.' },
  { id:'explainable-defect-prediction', title:'Explainable Software Defect Prediction', stack:'Python · GraphCodeBERT · SHAP · Google Colab',
    problem:'Defect prediction models need to expose which code features contributed to their predictions.',
    solution:'Developing an M.Sc. final project that compares GraphCodeBERT against CNN and BiLSTM baselines and uses SHAP for explanations.',
    architecture:'Evaluation covers Java, Python and C/C++ code. The PROMISE benchmark supplies more than 7,300 Java modules alongside other datasets.',
    result:'Evaluation is in progress.' },
];

export function projectLink(project: Project) {
  return project.demo
    ? { href: project.demo, label: 'Open hosted sign-in' }
    : project.repo ? { href: github + '/' + project.repo, label: 'View GitHub repository' } : undefined;
}

export const research = {
  title:'Multi-Version Package Risk Aggregation with Heterogeneous Ensemble Learning for Malicious npm and PyPI Package Detection',
  description:'IEEE-format research manuscript on detecting malicious packages using Random Forest and XGBoost ensembles and risk signals aggregated across package versions.',
  repo:github+'/npm-and-PyPi-scanner',
};
export const researchProjects = projects.filter(p=>['api_downtime_anlyzes','sign-language-translator','explainable-defect-prediction'].includes(p.id));

export type Credential = {id:string;title:string;issuer:string;date:string;asset:string;verify?:string;badge?:string};
export const credentials:Credential[] = [
  {id:'ethical-hacking',title:'Ethical Hacking 101',issuer:'Simplilearn SkillUp',date:'October 2025',asset:'/certificates/ethical-hacking-cert.png'},
  {id:'threat-management',title:'Cyber Threat Management',issuer:'Cisco Networking Academy',date:'March 2026',asset:'/certificates/cisco-threat-certificate.webp',badge:'/certificates/cyber-threat-management.png',verify:'https://www.credly.com/badges/efb8a625-4735-49fc-aced-4fff30a6589e'},
  {id:'intro-cybersecurity',title:'Introduction to Cybersecurity',issuer:'Cisco Networking Academy',date:'November 2024',asset:'/certificates/cisco-intro.webp',verify:'https://www.credly.com/go/8CphoeKo'},
  {id:'oracle-apex',title:'Oracle APEX Cloud Developer Certified Professional',issuer:'Oracle',date:'May 2025',asset:'/certificates/oracle-apex.webp'},
  {id:'oracle-java',title:'Java Certified Foundations Associate',issuer:'Oracle',date:'May 2026',asset:'/certificates/oracle-java.webp'},
  {id:'nptel-ai-hr',title:'AI in Human Resource Management',issuer:'NPTEL · IIT Guwahati',date:'January–April 2026',asset:'/certificates/nptel-ai-hr.webp',verify:'https://nptel.ac.in/noc/E_Certificate/NOC26MG19S115810040004763256'},
  {id:'infosys-javascript',title:'JavaScript',issuer:'Infosys Springboard',date:'April 2024',asset:'/certificates/infosys-javascript.webp'},
];

export const skillGroups = [
  {title:'Languages',skills:['Python','JavaScript (ES6+)','TypeScript','Java','C','C++','PHP']},
  {title:'Frontend & mobile',skills:['React','Next.js','React Native','Expo','Tailwind CSS','Bootstrap','HTML5','CSS3']},
  {title:'Backend & APIs',skills:['Node.js','Express','Django','REST APIs','JWT authentication']},
  {title:'Databases',skills:['MongoDB','MySQL','Firebase']},
  {title:'Cloud & DevOps',skills:['AWS EC2','S3','RDS','Docker','Jenkins','GitHub Actions','CI/CD']},
  {title:'AI & machine learning',skills:['TensorFlow','OpenCV','LSTM','Autoencoders','Random Forest','XGBoost','GraphCodeBERT','SHAP','Gemini API','Streamlit']},
  {title:'Testing & security',skills:['Selenium (Java and Python)','API testing','Postman','Wireshark','Ethical hacking']},
  {title:'Tools & methods',skills:['Git','GitHub','VS Code','Figma','Jira','Oracle APEX','Agile/Scrum']},
];
export const additionalTraining = [
  {title:'Testing Tools, Selenium and API Testing',provider:'NASSCOM FutureSkills',year:'2024'},
  {title:'Data Structures Using Java',provider:'Online certification',year:'2023'},
];
export const awards = [
  'Third place at Hackwave 3.0.1, a Kongu Engineering College hackathon with more than 50 teams.',
  'Participated in Smart India Hackathon 2025 with ForensIQ for the NTRO problem statement.',
  'Presented an AI/ML project to industry experts and received recognition for its practical application.',
  'Second place in paper presentation, Adithya Institute of Technology (2024).',
];
