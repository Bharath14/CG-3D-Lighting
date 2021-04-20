const vertexShaderSrc = `      
        attribute vec3 aPosition; 
        //attribute vec3 aColor;  
        varying vec3 vColor;
        varying vec3 vNormal;
        attribute vec3 aNormal;
        uniform mat4 model;
        uniform mat4 view;
        uniform mat4 projection;
        uniform mat4 modeltranspose;
        
        //material
        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float alpha;
        
        //light
        struct Light {
          vec3 ambient;
          vec3 specular;
          vec3 diffuse;
          vec3 position;
          float on;
        };
        //uniform Light light;
        #define NR_POINT_LIGHTS 3  
        uniform Light lights[NR_POINT_LIGHTS];
        uniform vec3 viewPos;
        varying vec3 viewPosf;
        varying vec3 temp_pos;
        uniform float gouraudphong;
        varying float gouraudphongf;
        void main () 
        {

          gl_Position = projection*view*model*vec4(aPosition,1.0); 
		      gl_PointSize = 5.0;
          gouraudphongf = gouraudphong;
          if(gouraudphong == 0.0)
          {
            temp_pos = vec3(model*vec4(aPosition, 1.0));
            vNormal = mat3(modeltranspose)* aNormal; 
            vec3 result = vec3(0,0,0);
            for(int i =0; i < NR_POINT_LIGHTS; i++)
            {
              if(lights[i].on == 1.0)
              {
                 vec3 amb = lights[i].ambient*ka;
       
                 //diffuse
                 vec3 norm = normalize(vNormal);
                 vec3 lightdir = normalize(lights[i].position - temp_pos);
                 float dif = max(dot(norm, lightdir), 0.0);
                 vec3 diff = lights[i].diffuse * (dif * kd);
       
                 //specular
                 vec3 viewdir = normalize(viewPos - temp_pos);
                 vec3 reflectdir = reflect(-lightdir, norm);  
                 float spec = pow(max(dot(viewdir, reflectdir), 0.0), alpha);
                 vec3 specul = lights[i].specular * (spec * ks);
                 
                 float d = sqrt(dot(lights[i].position- temp_pos,lights[i].position- temp_pos));
                 float attenuation = clamp( 10.0 / (1.0+d+d*d*0.1), 0.0, 1.0); 
                 result += attenuation *(amb + diff + specul);
              }
            }   
            vColor = result;
          }
          else
          {
            //vColor = aColor;
            viewPosf=viewPos;
            temp_pos = vec3(model * vec4(aPosition, 1.0));
            vNormal=mat3(modeltranspose) * aNormal;
          }
        }                          
	  `;

export default vertexShaderSrc;

//varying vec3 vNormal;
// attribute vec3 aNormal;
// vNormal = aNormal;   