import { City } from '@/components/city/City';
import { Recruiter } from '@/components/city/Recruiter';
import './world.css';

export default function Home() {
  return <main className="dw">
    <header className="dw-header"><a className="dw-brand" href="/" aria-label="Developer World home"><span>DW</span> Developer World</a><nav aria-label="Main navigation"><a href="#recruiter">Recruiter Mode</a><a className="dw-resume" href="/resume.pdf" download>Resume</a></nav></header>
    <City/>
    <Recruiter/>
    <footer className="dw-footer"><span>Developer World · Pranesh Ramesh</span><a href="#world">Back to the city</a></footer>
  </main>;
}
