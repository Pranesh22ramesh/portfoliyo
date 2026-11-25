import * as T from 'three';
import { columns, districts, entrance, streets, type District } from '@/lib/city';
import type { Shape } from './models';

type Place = (...shape:Shape)=>void;
const round = new T.CylinderGeometry(.5,.5,1,10);
const stones = new T.DodecahedronGeometry(.5);
const foliage = new T.IcosahedronGeometry(.5,1);
const dome=new T.SphereGeometry(.5,20,10,0,Math.PI*2,0,Math.PI/2);
const taper = new T.CylinderGeometry(.25,.5,1,7);
const trim='#e8d8b7', iron='#283e42', glass='#385f6a';

function roof() {
  const profile=new T.Shape();
  profile.moveTo(-.5,0); profile.lineTo(.5,0); profile.lineTo(0,1); profile.closePath();
  return new T.ExtrudeGeometry(profile,{depth:1,bevelEnabled:false}).translate(0,0,-.5);
}
const gable=roof();

const buildings = {
  home:{wall:'#d79467',roof:'#904e42',height:4.8,style:'house'},
  garage:{wall:'#d3a24c',roof:'#405356',height:4.3,style:'garage'},
  projects:{wall:'#69858e',roof:'#274e53',height:8.1,style:'lab'},
  skills:{wall:'#baa3bf',roof:'#56465d',height:5.8,style:'shop'},
  university:{wall:'#c9936e',roof:'#9c5d4b',height:7.1,style:'civic'},
  experience:{wall:'#81a6a2',roof:'#396863',height:9.6,style:'office'},
  achievements:{wall:'#daba82',roof:'#876440',height:6.4,style:'civic'},
  research:{wall:'#9bb7b9',roof:'#3f6774',height:7.7,style:'lab'},
  contact:{wall:'#cb7d79',roof:'#805161',height:4.4,style:'house'},
} as const;

export function facade(put:Place,d:Exclude<District,{id:'park'}>) {
  const {x,z}=d;
  const {wall,roof:cap,height:h,style}=buildings[d.id];
  const front=z+6.73;
  const retail=style==='garage'||style==='shop';
  const civic=style==='civic';
  const modern=style==='lab'||style==='office';
  put(x,h/2+.23,z,15.5,h,13.42,wall);
  put(x,.43,z,15.8,.38,13.7,cap);
  put(x,h+.23,z,15.9,.25,13.8,trim);
  put(x,h+.43,z,16.25,.24,14.15,cap);
  if(style==='house'||civic){
    const rise=civic?2:2.5;
    put(x,h+.54,z,15.8,rise,14,cap,gable);
    put(x,h+.53+rise,z,.16,.14,14.3,trim);
    for(const side of [-1,1]){
      put(x+side*5.3,h+.87,z-2.5,.75,1.32,.81,wall);
      put(x+side*5.3,h+1.56,z-2.5,.91,.13,.97,trim);
    }
  } else {
    put(x,h+.64,z,15.6,.25,13.5,wall);
    put(x-4,h+1,z-2,3.4,.65,2.7,cap);
    put(x+2.6,h+.93,z-1.2,1.7,.49,3.2,'#b9c4bb');
  }
  if(d.id==='research'){
    put(x-3.3,h+.88,z+1.7,4.48,.89,4.49,'#456a69',round);
    put(x-3.3,h+1.25,z+1.7,4.66,.29,4.67,'#c3c6aa',round);
    put(x-3.3,h+1.36,z+1.7,4.47,3.82,4.44,'#86a5a2',dome);
    put(x-3.3,h+1.9,z+3.52,.38,.77,.26,'#3b625f');
    put(x+4.8,h+1.47,z+2.85,.14,1.65,.14,'#526c5d',round);
    put(x+5.27,h+2.14,z+2.85,.94,.26,.09,'#d8a567');
  }
  const doorWidth=retail?4.8:2.55;
  put(x,1.59,front,doorWidth+.42,2.78,.26,trim);
  put(x,1.49,front+.16,doorWidth,2.46,.14,iron);
  if(style==='garage'){
    for(let row=0;row<6;row++)put(x,.42+row*.37,front+.25,doorWidth-.17,.28,.045,'#75908d');
  }else{
    for(const side of [-1,1]){
      put(x+side*.49,1.68,front+.25,.82,1.57,.035,glass);
      put(x+side*.19,1.14,front+.29,.07,.22,.06,'#d7ac59');
    }
  }
  for(let step=0;step<3;step++)put(x,.24+step*.055,front+.84-step*.14,doorWidth+.65,.14+step*.105,1.22-step*.31,step%2?trim:'#c5b59b');
  const levels=retail?1:Math.max(1,Math.floor((h-1)/2.1));
  for(let floor=0;floor<levels;floor++){
    const y=1.93+floor*2.13;
    for(const dx of (modern?[-5.6,-3.6,3.6,5.6]:[-5.25,5.25])){
      const w=modern?1.62:retail?2.65:1.72;
      const height=modern?1.49:retail?1.73:1.45;
      put(x+dx,y,front,.26+w,height+.23,.25,trim);
      put(x+dx,y,front+.135,w,height,.075,glass);
      put(x+dx-.19,y+.22,front+.179,w*.62,height*.45,.011,'#517883');
      put(x+dx,y,front+.2,.055,height,.055,trim);
      put(x+dx,y-.21,front+.2,w,.06,.055,trim);
      put(x+dx,y-height/2-.065,front+.19,w+.28,.13,.39,trim);
      if(!modern&&!retail&&!civic){
        for(const side of [-1,1])put(x+dx+side*(w/2+.32),y,front+.105,.31,height,.16,cap);
      }
    }
    for(const side of [-1,1])for(const dz of [-4,0,4]){
      put(x+side*7.76,y,z+dz,.15,1.51,1.67,trim);
      put(x+side*7.85,y,z+dz,.065,1.29,1.42,glass);
    }
  }
  if(style==='office'){
    for(const floor of [1,2]){
      const y=1.1+floor*2.13;
      put(x,y,front+.46,5.15,.19,1.03,'#b8af92');
      put(x,y+.65,front+.95,5.12,.082,.077,iron);
      for(let bar=-4;bar<=4;bar++)put(x+bar*.55,y+.355,front+.95,.052,.60,.053,iron);
      for(const side of [-1,1])put(x+side*2.46,y+.38,front+.56,.078,.60,.075,iron);
    }
  }
  if(style==='lab'){
    for(const side of [-1,1]){
      put(x+side*7.81,h*.42,z+.5,.11,h*.72,.21,'#436c6e');
      for(const dz of [-3,3])put(x+side*7.88,h*.39,z+dz,.13,h*.56,.11,'#739498');
    }
  }
  if(style==='house'){
    for(const side of [-1,1]){
      put(x+side*4.65,1.12,front+.26,1.61,.39,.39,'#a8805e');
      for(let j=-1;j<=1;j++)put(x+side*4.65+j*.39,1.4,front+.29,.44,.34,.47,j===0?'#a0a474':'#788a5c',foliage);
    }
  }
  if(civic){
    put(x,3.32,front+.58,10.8,.31,1.24,trim);
    put(x,3.49,front+.57,11.2,1.12,1.3,cap,gable);
    for(const dx of [-4.6,-3.4,3.4,4.6]){
      put(x+dx,1.78,front+.86,.35,2.95,.35,trim,round);
      put(x+dx,.38,front+.86,.6,.24,.61,trim);
      put(x+dx,3.22,front+.86,.55,.22,.55,trim);
    }
  } else if(retail||style==='house'){
    const width=retail?9.8:5.8;
    put(x,3.03,front+.64,width,.16,1.3,cap);
    for(let i=-3;i<=3;i++)put(x+i*width/7,2.91,front+1.25,width/7,.22,.10,i%2?trim:wall);
  } else {
    put(x,3.27,front+.58,8.2,.24,1.26,cap);
    put(x,3.42,front+.65,8.2,.09,1.19,'#b0c7bd');
    for(const dx of [-6.8,-2.5,2.5,6.8])put(x+dx,(h+3.5)/2,front+.04,.16,h-3.5,.29,cap);
  }
  for(const side of [-1,1]){
    put(x+side*6.35,.46,front+2.05,1.78,.48,.86,cap);
    put(x+side*6.35,.72,front+2.05,1.69,.16,.81,'#354c36');
    for(let j=-1;j<=1;j++){
      put(x+side*6.35+j*.48,.9,front+2.05,.49,.35,.56,'#668760',foliage);
      put(x+side*6.35+j*.49,1.12,front+2.13,.24,.19,.25,side===1?'#e4a183':'#f2c66d',foliage);
    }
  }
}

export function streetscape(put:Place) {
  for(const d of districts){
    const spot=entrance(d);
    for(const side of [-1,1]){
      put(spot.x+side*1.8,.295,spot.z+3.4,.08,.022,3.9,'#f4dfaa');
      put(spot.x+side*1.47,.296,spot.z+5.34,.75,.022,.08,'#f4dfaa');
    }
    for(let j=0;j<5;j++)put(spot.x+2.2,.252,spot.z-1.2+j*.43,2.55,.035,.37,j%2?'#d6bda0':'#cab092');
  }
  for(const x of columns)for(const z of streets){
    for(const [dx,dz] of [[-6.9,-6.2],[6.9,6.2]]){
      put(x+dx,.22,z+dz,1.3,.16,1.25,'#d7ac76');
      for(let j=-1;j<=1;j++)put(x+dx+j*.32,.308,z+dz,.13,.018,.91,'#b48657');
    }
  }
  for(const z of [-7.8,7.8])for(let i=0;i<42;i++){
    const x=-55+i*3.4;
    if(columns.some(c=>Math.abs(c-x)<7.5))continue;
    put(x,-.22,z,3.24,.47,.93,i%2?'#9c9c86':'#b1a993',stones);
    if(i%3===0)for(const j of [-1,0,1])put(x+j*.15,.22,z*1.07,.12,.45+Math.abs(j)*.17,.12,'#608957',taper,j);
  }
  for(const [x,z] of [[-6,40],[35,-38],[69,-24],[-34,-49]]){
    put(x,.44,z,.55,.69,.52,'#456960',round);
    put(x,.84,z,.62,.13,.61,'#344b49',round);
    put(x,.91,z,.25,.023,.31,'#172c2b');
  }
  for(const side of [-1,1]){
    put(60+side*2.01,.67,-21.53,.13,1.26,.15,'#395f51');
    put(60+side*2.01,1.33,-21.53,.19,.14,.19,'#d4b077');
  }
  put(60,1.50,-21.50,4.92,.72,.11,'#2b4238');
  const shelterX=38,shelterZ=20;
  put(shelterX,.57,shelterZ,4.7,.17,.71,'#ad7451');
  put(shelterX,2.56,shelterZ,5.12,.22,2.03,'#355e59');
  put(shelterX,1.36,shelterZ-.86,4.62,2.18,.09,'#7daca9');
  for(const side of [-1,1])put(shelterX+side*2.33,1.34,shelterZ,.16,2.51,.16,iron);
  put(12,-1.18,-8,257,.72,227,'#849b75');
  for(const [x,z,w,h] of [[103,-32,24,6],[112,-12,30,9],[97,23,28,7],[-67,-57,29,7],[-72,-14,35,9],[-66,29,26,6],[88,-88,37,10],[72,-94,39,12],[-17,-98,49,13]]){
    put(x,-1,z,w,h,w*.74,'#6f916e',stones);
    put(x+4,-1,z+6,w*.74,h*.75,w*.6,'#749873',stones);
  }
}

export function makeSigns(){
  const canvas=document.createElement('canvas');
  canvas.width=512;canvas.height=640;
  const pen=canvas.getContext('2d');
  const group=new T.Group();
  if(!pen)return group;
  const names=['RIVER HOUSE','MOTOR GARAGE','PROJECT LAB','SKILL WORKSHOP','UNIVERSITY','IT PARK','MUSEUM','RESEARCH CENTER','POST OFFICE','FUN PARK'];
  const atlas=new T.CanvasTexture(canvas);
  atlas.colorSpace=T.SRGBColorSpace;
  atlas.anisotropy=2;
  const ink=new T.MeshBasicMaterial({map:atlas,toneMapped:false});
  districts.forEach((d,i)=>{
    const y=i*64;
    pen.fillStyle='#213d41';pen.fillRect(0,y,512,64);
    pen.fillStyle='#bd9862';pen.fillRect(8,y+7,496,50);
    pen.fillStyle='#213d41';pen.fillRect(13,y+11,486,42);
    pen.fillStyle='#fff0c9';pen.font='bold 27px system-ui';pen.textAlign='center';pen.textBaseline='middle';
    pen.fillText(names[i],256,y+32);
    const geo=new T.PlaneGeometry(i===3||i===7?5.4:4.8,.64);
    const uv=geo.attributes.uv;
    for(let j=0;j<uv.count;j++)uv.setY(j,1-(i+(uv.getY(j)?0.025:.975))/10);
    const sign=new T.Mesh(geo,ink);
    sign.position.set(d.x, i===9?1.5:i===4||i===6?5.06:3.88,d.z+(i===9?8.7:7.88));
    group.add(sign);
  });
  atlas.needsUpdate=true;
  return group;
}
