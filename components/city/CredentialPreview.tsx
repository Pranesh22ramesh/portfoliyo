'use client';

import Image from 'next/image';
import { useRef } from 'react';

export function CredentialPreview({asset,title}:{asset:string;title:string}) {
  const frame=useRef<HTMLDivElement>(null);
  function expand(){
    const el=frame.current;
    if(!el?.requestFullscreen){window.open(asset,'_blank','noopener,noreferrer');return;}
    if(document.fullscreenElement===el){void document.exitFullscreen();return;}
    void el.requestFullscreen().catch(()=>window.open(asset,'_blank','noopener,noreferrer'));
  }
  return <>
    <div className="dw-actions"><button className="dw-button" onClick={expand}>Fullscreen preview</button><a href={asset} target="_blank" rel="noreferrer">Open full image</a></div>
    <div ref={frame} className="dw-credential">
      <Image src={asset} alt={title} fill sizes="(max-width: 850px) 100vw, 850px"/>
      <button className="dw-button dw-credential-exit" onClick={expand}>Exit fullscreen</button>
    </div>
  </>;
}
