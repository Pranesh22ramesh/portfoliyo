import * as T from 'three';

export function skyDome() {
  const material = new T.ShaderMaterial({
    side:T.BackSide,depthWrite:false,
    uniforms:{night:{value:0}},
    vertexShader:`
      varying vec3 direction;
      void main(){
        direction=position;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }
    `,
    fragmentShader:`
      uniform float night;
      varying vec3 direction;
      void main(){
        vec3 ray=normalize(direction);
        float up=max(0.,ray.y);
        vec3 horizon=mix(vec3(.60,.72,.75),vec3(.13,.16,.26),night);
        vec3 zenith=mix(vec3(.12,.36,.55),vec3(.008,.022,.065),night);
        vec3 color=mix(horizon,zenith,smoothstep(-.08,.47,up));
        float sun=max(0.,dot(ray,normalize(vec3(-.51,.51,.65))));
        color+=vec3(.30,.18,.09)*pow(sun,9.)*(1.-night);
        color+=vec3(.76,.62,.40)*smoothstep(.9984,.9991,sun)*(1.-night);
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }
    `,
  });
  const sky = new T.Mesh(new T.SphereGeometry(60,20,12),material);
  sky.renderOrder=-10;
  sky.frustumCulled=false;
  return sky;
}

export function makeContactShadows(count:number) {
  const geometry=new T.PlaneGeometry(2,2);
  const material=new T.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{strength:{value:.31}},
    vertexShader:`
      varying vec2 localPoint;
      void main(){
        localPoint=uv*2.-1.;
        gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);
      }
    `,
    fragmentShader:`
      uniform float strength;
      varying vec2 localPoint;
      void main(){
        float feather=1.-smoothstep(.12,1.,dot(localPoint,localPoint));
        gl_FragColor=vec4(.08,.10,.085,feather*feather*strength);
        #include <colorspace_fragment>
      }
    `,
  });
  const shadows = new T.InstancedMesh(geometry,material,count);
  shadows.frustumCulled=false;
  return shadows;
}

export function headlightPools() {
  const group=new T.Group();
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute([-.26,0,0,.26,0,0,-1.08,0,6,1.08,0,6],3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,0,0,1,0],2));
  geometry.setIndex([0,2,1,1,2,3]);
  const material=new T.ShaderMaterial({
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
    vertexShader:`
      varying vec2 samplePoint;
      void main(){samplePoint=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
    `,
    fragmentShader:`
      varying vec2 samplePoint;
      void main(){
        float spread=1.-smoothstep(.10,.5,abs(samplePoint.x-.5));
        float falloff=samplePoint.y*samplePoint.y;
        gl_FragColor=vec4(.94,.70,.32,spread*falloff*.24);
        #include <colorspace_fragment>
      }
    `
  });
  for(const side of [-1,1]){
    const light=new T.Mesh(geometry,material);
    light.position.set(side*.68,.033,2.13);light.rotation.y=side*.09;
    group.add(light);
  }
  return group;
}
