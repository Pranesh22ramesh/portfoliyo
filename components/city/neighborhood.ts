import * as T from 'three';
import type { Shape } from './models';

type Place = (...shape:Shape)=>void;
const disc = new T.CylinderGeometry(.5,.5,1,12);
const wood = '#9a644a', iron='#354a48', canvas='#e0bc7a', leaf='#658050';

/** Authored neighborhood props use the same static color batches as the roads. */
export function neighborhood(put:Place){
  const cafeX=30,cafeZ=-61;
  put(cafeX,2.93,cafeZ+5.39,10.5,.09,1.8,'#b97952');
  put(cafeX,2.82,cafeZ+6.17,10.5,.25,.16,'#804e45');
  for(const step of [-4,-2,0,2,4])put(cafeX+step,2.94,cafeZ+5.43,.48,.1,1.78,canvas);
  const parasol=new T.ConeGeometry(.5,1,12);
  for(const [x,z] of [[26.8,-54.4],[31.1,-54.4],[35.3,-54.4]]){
    put(x,.62,z,1.08,.14,1.08,wood,disc);
    put(x,.32,z,.13,.65,.13,iron,disc);
    put(x,.112,z,.55,.09,.55,iron,disc);
    put(x,1.04,z,.07,1.96,.07,iron,disc);
    put(x,1.98,z,2.25,.34,2.25,canvas,parasol);
    put(x,2.17,z,.11,.1,.11,iron,disc);
    for(const side of [-1,1]){
      put(x+side*.79,.45,z,.48,.11,.45,wood);
      put(x+side*1.01,.65,z,.09,.46,.46,wood);
      for(const dz of [-.17,.17])put(x+side*.79,.22,z+dz,.08,.37,.07,iron);
    }
    put(x+.22,.735,z,.13,.12,.13,'#edd6ac',disc);
  }
  parasol.dispose();

  for(const [x,z] of [[8.4,39.6],[34,-53.2],[33,-22],[62,-37],[66,-22]]){
    put(x,.29,z,1.7,.57,.8,'#906646');
    put(x,.57,z,1.66,.08,.79,'#455b38');
    for(let slat=-3;slat<=3;slat++)put(x+slat*.22,.29,z+.405,.046,.48,.039,'#b18457');
    for(const dx of [-.53,0,.53]){
      const leaves=new T.IcosahedronGeometry(.5,0);
      put(x+dx,.72,z,.52,.38,.52,leaf,leaves);
      put(x+dx,.91,z,.21,.16,.22,dx<0?'#d98088':'#ebc275',leaves);
      leaves.dispose();
    }
  }
  for(const [x,z] of [[-23,-21],[7.3,38.2],[35.3,-17.7],[69,-36.8]]){
    put(x,.46,z,.48,.84,.48,'#477466',disc);
    put(x,.89,z,.53,.12,.53,'#304c46',disc);
    put(x,.958,z,.24,.014,.27,'#233c37',disc);
    for(const side of [-1,1])put(x+side*.244,.55,z,.03,.53,.18,'#709785');
  }

  for(const [x,z,count] of [[55,-39,5],[68,-40,5],[-27,-67,5]]){
    put(x+count*.56-.56,.43,z,count*1.12,.095,.102,'#c1a278');
    put(x+count*.56-.56,.75,z,count*1.12,.095,.102,'#b29264');
    for(let i=0;i<count;i++){
      put(x+i*1.12,.55,z,.13,1.08,.14,'#d4b68a');
      put(x+i*1.12,1.11,z,.17,.14,.19,'#ac8d64');
    }
  }

  const tireGeometry=new T.TorusGeometry(.39,.038,6,18);
  const rimGeometry=new T.TorusGeometry(.355,.018,5,18);
  for(const [x,z,color] of [[5,41,'#cd7960'],[-23,-51,'#6d9199'],[51,-27,'#c59a59']] as const){
    const wheelbase=1.14;
    for(const side of [-1,1]){
      put(x+side*wheelbase/2,.58,z,1,1,1,'#252e30',tireGeometry);
      put(x+side*wheelbase/2,.58,z,1,1,1,'#b5bbad',rimGeometry);
      put(x+side*wheelbase/2,.58,z,.032,.032,.064,iron);
    }
    const beam=(x1:number,y1:number,x2:number,y2:number)=>{
      const length=Math.hypot(x2-x1,y2-y1);
      const geometry=new T.BoxGeometry(length,.051,.07).rotateZ(Math.atan2(y2-y1,x2-x1));
      put(x+(x1+x2)/2,(y1+y2)/2,z,1,1,1,color,geometry);
      geometry.dispose();
    };
    beam(-.57,.58,-.19,1.03);beam(-.57,.58,.02,.57);beam(-.19,1.03,.02,.57);
    beam(-.19,1.03,.42,1.04);beam(.02,.57,.42,1.04);beam(.42,1.04,.57,.58);
    put(x-.19,1.09,z,.25,.047,.15,'#493a34');
    put(x+.37,1.13,z,.09,.054,.37,iron);
  }
  tireGeometry.dispose();
  rimGeometry.dispose();
}
