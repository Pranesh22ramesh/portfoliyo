export function startAudio() {
  const ctx=new AudioContext();
  const gain=ctx.createGain(); gain.gain.value=0; gain.connect(ctx.destination);
  const engine=ctx.createOscillator(); engine.type='triangle'; engine.frequency.value=43;
  const engineGain=ctx.createGain(); engineGain.gain.value=.065; engine.connect(engineGain).connect(gain); engine.start();
  const length=ctx.sampleRate*2, buffer=ctx.createBuffer(1,length,ctx.sampleRate), data=buffer.getChannelData(0);
  let sample=0;
  for(let i=0;i<length;i++){sample=sample*.94+(Math.random()*2-1)*.06; data[i]=sample;}
  const air=ctx.createBufferSource(); air.buffer=buffer; air.loop=true;
  const airGain=ctx.createGain(); airGain.gain.value=.05; air.connect(airGain).connect(gain); air.start();
  let lastBird=0;
  void ctx.resume().catch(()=>{});
  return {
    update(speed:number, audible:boolean, driving:boolean, water:boolean) {
      const now=ctx.currentTime;
      gain.gain.setTargetAtTime(audible?.7:0,now,.09);
      engine.frequency.setTargetAtTime(38+speed*1.2,now,.08);
      engineGain.gain.setTargetAtTime(driving?.04+speed*.001:0,now,.11);
      airGain.gain.setTargetAtTime(water?.16:.055,now,.3);
      if(audible&&now-lastBird>8&&speed<35){
        lastBird=now; const bird=ctx.createOscillator(), volume=ctx.createGain();
        bird.frequency.setValueAtTime(1460,now); bird.frequency.exponentialRampToValueAtTime(2240,now+.06);
        bird.frequency.exponentialRampToValueAtTime(1740,now+.16);
        volume.gain.setValueAtTime(0,now); volume.gain.linearRampToValueAtTime(.025,now+.04);
        volume.gain.linearRampToValueAtTime(0,now+.18);
        bird.connect(volume).connect(gain); bird.start(); bird.stop(now+.2);
      }
    },
    destroy(){void ctx.close().catch(()=>{});},
  };
}
