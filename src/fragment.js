const fragmentShaderSrc = `      
		precision mediump float;   
		varying vec3 vColor; 
    //uniform vec3 reverselight;
    //varying vec3 vNormal;   
    struct Light {
      vec3 ambient;
      vec3 specular;
      vec3 diffuse;
      vec3 position;
      float on;
    };
    
    uniform vec3 kaf;
    uniform vec3 kdf;
    uniform vec3 ksf;
    uniform float alphaf;

    #define NR_POINT_LIGHTSf 3  
    uniform Light lightsf[NR_POINT_LIGHTSf];
    varying vec3 viewPosf;
    varying vec3 vNormal;  
    varying vec3 temp_pos;
    varying float gouraudphongf;
    uniform float bling;
        void main () 
        {            
         //vec3 normal = normalize(vNormal);
         //float light = dot(normal, vec3(0,0,1)); 
         if(gouraudphongf == 1.0)
         {
          vec3 result = vec3(0.0,0.0,0.0);
          for(int i =0; i < NR_POINT_LIGHTSf; i++)
          {
            if(lightsf[i].on == 1.0)
            {
               vec3 amb = lightsf[i].ambient*kaf;
     
               //diffuse
               vec3 norm = normalize(vNormal);
               vec3 lightdir = normalize(lightsf[i].position - temp_pos);
               float dif = max(dot(norm, lightdir), 0.0);
               vec3 diff = lightsf[i].diffuse * (dif * kdf);
     
               //specular
               vec3 viewdir = normalize(viewPosf - temp_pos);
               float spec;
               if(bling==1.0)
               {
                vec3 hwdir = normalize(lightdir + viewdir);  
                spec = pow(max(dot(vNormal, hwdir), 0.0), alphaf);
               }
               else{
                vec3 reflectdir = reflect(-lightdir, norm);  
                spec = pow(max(dot(viewdir, reflectdir), 0.0), alphaf);
               }
               
               vec3 specul = lightsf[i].specular * (spec * ksf);
               
               float d = sqrt(dot(lightsf[i].position- temp_pos,lightsf[i].position- temp_pos));
               float attenuation = clamp( 10.0 / (1.0+d+d*d*0.1), 0.0, 1.0); 
               result += attenuation *(amb + diff + specul);
            }
            gl_FragColor = vec4(result,1.0);
          }
         }
         else
         {
            gl_FragColor = vec4(vColor,1.0);
         } 
         //gl_FragColor.rgb *= light;
         
        }                            
	  `;

export default fragmentShaderSrc;
//float light = dot(normal, reverselight); 
// gl_FragColor.rgb *= light;