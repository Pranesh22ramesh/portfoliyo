import { City } from '@/components/city/City';
import { Portfolio } from '@/components/city/Portfolio';
import { districts } from '@/lib/city';
import './world.css';

export default function Home() {
  return <main className="dw dw-game" data-release={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}>
    <City/>
    <noscript>
      <section className="dw-static-portfolio" aria-labelledby="static-portfolio-title">
        <h1 id="static-portfolio-title">Developer World</h1>
        <p>Enable JavaScript to drive. Open a destination to browse the portfolio here.</p>
        <a className="dw-button dw-primary" href="/resume.pdf" download>Download Resume</a>
        <div className="dw-static-list">{districts.map(d=><details key={d.id} id={d.id}>
          <summary>{d.name} <small>{d.topic}</small></summary>
          <div className="dw-static-detail"><Portfolio id={d.id}/></div>
        </details>)}</div>
      </section>
    </noscript>
  </main>;
}
