import Shader from "./shader.js";
import vertexShaderSrc from "./vertex.js";
import fragmentShaderSrc from "./fragment.js";
import Renderer from "./renderer.js";
import Mesh from "./mesh.js";
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const renderer = new Renderer();
const gl = renderer.webglcontext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

let ligposcu = vec3.fromValues(0,0,0);
let ligposcy = vec3.fromValues(0,0,0);
let ligpospe = vec3.fromValues(0,0,0);

const pencil = new Mesh(gl,"/src/pencil.obj",[1,1,0])
pencil.matamb = vec3.fromValues(0.2, 0.4, 0.3);
pencil.matdif = vec3.fromValues(0.2, 0.4, 0.3);
pencil.matspec = vec3.fromValues(0.3, 0.5, 0.6);
pencil.shine = 0.1;
pencil.transform.setScale([0.15,0.15,0.15]);
pencil.transform.setTranslate([1,0,0]);
pencil.transform.updateMVPMatrix();

const cylinder = new Mesh(gl,"/src/cylinder.obj",[0,0,1])
cylinder.matamb = vec3.fromValues(0.6, 0.1, 0.3);
cylinder.matdif = vec3.fromValues(0.3, 0.2, 0.3);
cylinder.matspec = vec3.fromValues(0.5, 0.1, 0.2);
cylinder.shine = 0.01;
cylinder.transform.setScale([0.15,0.15,0.15]);
cylinder.transform.setTranslate([-1,0,0]);
cylinder.transform.updateMVPMatrix();


const cube = new Mesh(gl,"/src/cube.obj",[1,0,1])
cube.matamb = vec3.fromValues(0.4, 0.4, 0.4);
cube.matdif = vec3.fromValues(0.4, 0.2, 0.3);
cube.matspec = vec3.fromValues(0.3, 0.2, 0.4);
cube.shine = 0.1;
cube.transform.setScale([0.15,0.15,0.15]);
cube.transform.setTranslate([0,0,0]);
cube.transform.updateMVPMatrix();

var meshid = 2;
var mode = 0;
let meshes = [cube, cylinder, pencil];

var  anglecu = 0.0;
var anglecy = 0.0;
var anglepe = 0.0;
var  axis = vec3.fromValues(0, 0, 1);
var lastPos = [0, 0, 0];
window.onload = () => {
    //console.log("hello")
    window.addEventListener("keydown",function(event){
        switch(true)
        {
            case event.key == "m":
                //console.log("m");
                mode = 1;
                break;
            case event.key == "3":
                meshid = 3;
                break;
            case event.key == "4":
                meshid = 4;
                break;
            case event.key == "5":
                meshid = 5;
                break;
            case event.key == "2":
                meshid = 2;   
                break;
            case event.key == "+":
                if (mode == 1)
                {
                    if(meshid == 3)
                    {
                        var cuscale = cube.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        cube.transform.setScale([cuscale[0]*2, cuscale[1]*2, cuscale[2]*2]);
                        cube.transform.updateMVPMatrix();
                    }
                    if(meshid == 5)
                    {
                        var pescale = pencil.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        pencil.transform.setScale([pescale[0]*2, pescale[1]*2, pescale[2]*2]);
                        pencil.transform.updateMVPMatrix();
                    }
                    if(meshid == 4)
                    {
                        var cyscale = cylinder.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        cylinder.transform.setScale([cyscale[0]*2, cyscale[1]*2, cyscale[2]*2]);
                        cylinder.transform.updateMVPMatrix();
                    }
                } 
                break;
            case event.key == "-":
                if (mode == 1)
                {
                    if(meshid == 3)
                    {
                        var cuscale = cube.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        cube.transform.setScale([cuscale[0]*0.5, cuscale[1]*0.5, cuscale[2]*0.5]);
                       // console.log(, cube.ligposcu);
                        if(cube.ligoncup == 0.0)
                        {
                            cube.transform.setScale([cuscale[0], cuscale[1], cuscale[2]]);
                            //console.log(cube.maxbx, cube.ligoncu);
                        }
                        cube.transform.updateMVPMatrix();
                    }
                    if(meshid == 5)
                    {
                        var pescale = pencil.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        pencil.transform.setScale([pescale[0]*0.5, pescale[1]*0.5, pescale[2]*0.5]);
                        if(pencil.ligonpep == 0.0)
                        {
                            pencil.transform.setScale([pescale[0], pescale[1], pescale[2]]);
                        }
                        pencil.transform.updateMVPMatrix();
                    }
                    if(meshid == 4)
                    {
                        var cyscale = cylinder.transform.getScale();
                        //console.log(cuscale[2]+0.1);
                        cylinder.transform.setScale([cyscale[0]*0.5, cyscale[1]*0.5, cyscale[2]*0.5]);
                        if(cylinder.ligoncyp == 0.0)
                        {
                            cylinder.transform.setScale([cyscale[0], cyscale[1], cyscale[2]]);
                        }
                        cylinder.transform.updateMVPMatrix();
                    }
                } 
                break;                        
            case event.key == "s":
                mode = 2;
                if(meshid == 3)
                {
                    var x = cube.gouraudphong;
                    if(x==1.0)
                    {
                        cube.gouraudphong = 0.0;
                    }
                    else if(x==0.0)
                    {
                        cube.gouraudphong = 1.0;
                    }
                }
                if(meshid == 4)
                {
                    var x = cylinder.gouraudphong;
                    if(x==1.0)
                    {
                        cylinder.gouraudphong = 0.0;
                    }
                    else if(x==0.0)
                    {
                        cylinder.gouraudphong = 1.0;
                    }
                }
                if(meshid == 5)
                {
                    var x = pencil.gouraudphong;
                    if(x==1.0)
                    {
                        pencil.gouraudphong = 0.0;
                    }
                    else if(x==0.0)
                    {
                        pencil.gouraudphong = 1.0;
                    }
                }
                break;
            case event.key == "i":
                mode = 3;
                meshes.forEach(m =>{
                    m.gouraudphong = 1.0;
                    m.bling = 1.0;
                })
                break;
            case event.key == "0":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        meshes.forEach(m =>{
                            m.ligoncu = 0.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                    if(meshid == 4)
                    {
                        meshes.forEach(m =>{
                            m.ligoncy = 0.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                    if(meshid == 5)
                    {
                        meshes.forEach(m =>{
                            m.ligonpe = 0.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                }
                break;
            case event.key == "1":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        meshes.forEach(m =>{
                            m.ligoncu = 1.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                    if(meshid == 4)
                    {
                        meshes.forEach(m =>{
                            m.ligoncy = 1.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                    if(meshid == 5)
                    {
                        meshes.forEach(m =>{
                            m.ligonpe = 1.0;
                            m.gouraudphong = 1.0;
                        })
                    }
                }
                break;
            case event.key == "x":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                            meshes.forEach(m =>{
                                m.ligposcu = vec3.fromValues(temp[0]+0.1, temp[1], temp[2]);
                            })
                        }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0]+0.1, temp[1], temp[2]);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0]+0.1, temp[1], temp[2]);
                        })
                    }
                    }
                }
                break;
            case event.key == "c":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcu = vec3.fromValues(temp[0]-0.1, temp[1], temp[2]);
                        })
                    }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0]-0.1, temp[1], temp[2]);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0]-0.1, temp[1], temp[2]);
                        })
                    }
                    }
                }
                break;
            case event.key == "y":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcu = vec3.fromValues(temp[0], temp[1]+0.1, temp[2]);
                        })
                    }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0]-0.1, temp[1]+0.1, temp[2]);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0]-0.1, temp[1]+0.1, temp[2]);
                        })
                    }
                    }
                }
                break;
            case event.key == "u":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcu = vec3.fromValues(temp[0], temp[1]-0.1, temp[2]);
                        })
                    }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0], temp[1]-0.1, temp[2]);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0], temp[1]-0.1, temp[2]);
                        })
                    }
                    }
                }
                break;
            case event.key == "z":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcu = vec3.fromValues(temp[0], temp[1], temp[2]+0.1);
                        })
                    }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0], temp[1], temp[2]+0.1);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0], temp[1], temp[2]+0.1);
                        })
                    }
                    }
                }
                break;
            case event.key == "a":
                if(mode == 3)
                {
                    if(meshid == 3)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cube.ligposcu;
                        if(cube.ligoncu == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcu = vec3.fromValues(temp[0], temp[1], temp[2]-0.1);
                        })
                    }
                    }
                    if(meshid == 4)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = cylinder.ligposcy;
                        if(cylinder.ligoncy == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligposcy = vec3.fromValues(temp[0], temp[1], temp[2]-0.1);
                        })
                    }
                    }
                    if(meshid == 5)
                    {
                        let temp = vec3.fromValues(0,0,0);
                        temp = pencil.ligpospe;
                        if(pencil.ligonpe == 1.0)
                        {
                        meshes.forEach(m =>{
                            m.ligpospe = vec3.fromValues(temp[0], temp[1], temp[2]-0.1);
                        })
                    }
                    }
                }
                break;
            case event.key == "d":
                mode=0;
               // const pencil = new Mesh(gl,"/src/pencil.obj",[1,1,0])
                pencil.matamb = vec3.fromValues(0.2, 0.4, 0.3);
                pencil.matdif = vec3.fromValues(0.2, 0.4, 0.3);
                pencil.matspec = vec3.fromValues(0.3, 0.5, 0.6);
                pencil.shine = 0.1;
                pencil.transform.setScale([0.15,0.15,0.15]);
                pencil.transform.setTranslate([1,0,0]);
                pencil.transform.updateMVPMatrix();

                //const cylinder = new Mesh(gl,"/src/cylinder.obj",[0,0,1])
                cylinder.matamb = vec3.fromValues(0.6, 0.1, 0.3);
                cylinder.matdif = vec3.fromValues(0.3, 0.2, 0.3);
                cylinder.matspec = vec3.fromValues(0.5, 0.1, 0.2);
                cylinder.shine = 0.01;
                cylinder.transform.setScale([0.15,0.15,0.15]);
                cylinder.transform.setTranslate([-1,0,0]);
                cylinder.transform.updateMVPMatrix();


                //const cube = new Mesh(gl,"/src/cube.obj",[1,0,1])
                cube.matamb = vec3.fromValues(0.4, 0.4, 0.4);
                cube.matdif = vec3.fromValues(0.4, 0.2, 0.3);
                cube.matspec = vec3.fromValues(0.3, 0.2, 0.4);
                cube.shine = 0.1;
                cube.transform.setScale([0.15,0.15,0.15]);
                cube.transform.setTranslate([0,0,0]);
                cube.transform.updateMVPMatrix();

                meshes.forEach(m=>{
                    m.ligposcu = vec3.fromValues(-0.1,0,0.1);
                    m.ligposcy = vec3.fromValues(-1.2, 0, -0.2);
                    m.ligpospe = vec3.fromValues(1.2, 0.1, 0.1);

                    m.ligoncu = 1.0;
                    m.ligoncy = 1.0;
                    m.ligonpe = 1.0;

                    m.transform.setRotate([0,0,1], 0);
                    m.transform.updateMVPMatrix()
                })
                break;
        }

    });
    let userinteracting = false;
    var tracking = false;
   // var canvas = renderer.getcanvas();
    function trackballView( x,  y ) {
        var d, a;
        var v = [];
        v= renderer.mouseToClipCoord(x,y);
        //v[0] = x;
        //v[1] = y;
    
        d = v[0]*v[0] + v[1]*v[1];
        if (d < 1.0)
          v[2] = Math.sqrt(1.0 - d);
        else {
          v[2] = 0.0;
          a = 1.0 /  Math.sqrt(d);
          v[0] *= a;
          v[1] *= a;
        }
        return v;
    }
    var mouseX;
    var mouseY;
    renderer.getcanvas().addEventListener("mousedown", function(event){
        if(event.button == 2)
        {
            if (mode == 1)
            {
                //console.log("name");
                mouseX = event.clientX;
                mouseY = event.clientY;
                userinteracting = true;

            }
        }
        if(event.button == 0)
        {
            if(mode == 1)
            {
                mouseX = event.clientX;
                mouseY = event.clientY;
                tracking = true;
                lastPos = trackballView(mouseX, mouseY);
            }
        }
    });
    renderer.getcanvas().addEventListener("mousemove", function(event){
    if(userinteracting == true)
    {
        if(mode == 1)
        {
            if(meshid == 3)
            {
                let dragX = event.clientX;
                let dragY = event.clientY;
                var dx = dragX - mouseX;
                var dy = dragY - mouseY;
                const clipCoordinates = renderer.mouseToClipCoord(dragX, dragY);
                cube.transform.setTranslate(vec3.fromValues(clipCoordinates[0], clipCoordinates[1], 0));
                cube.transform.updateMVPMatrix();
                ligposcu = cube.ligposcu;
                cube.ligposcu = vec3.fromValues(ligposcu[0]+clipCoordinates[0], ligposcu[1]+clipCoordinates[1], ligposcu[2]);
                cylinder.ligposcu = vec3.fromValues(ligposcu[0]+clipCoordinates[0], ligposcu[1]+clipCoordinates[1], ligposcu[2]);
                pencil.ligposcu = vec3.fromValues(ligposcu[0]+clipCoordinates[0], ligposcu[1]+clipCoordinates[1], ligposcu[2]);
                
            }
            if(meshid == 4)
            {
                let dragX = event.clientX;
                let dragY = event.clientY;
                const clipCoordinates = renderer.mouseToClipCoord(dragX, dragY);
                cylinder.transform.setTranslate(vec3.fromValues(clipCoordinates[0], clipCoordinates[1], 0));
                cylinder.transform.updateMVPMatrix()
                //cylinder.transform.updateMVPMatrix();
                ligposcy = cylinder.ligposcy;
                cube.ligposcy = vec3.fromValues(ligposcy[0]+clipCoordinates[0], ligposcy[1]+clipCoordinates[1], ligposcy[2]);
                cylinder.ligposcy = vec3.fromValues(ligposcy[0]+clipCoordinates[0], ligposcy[1]+clipCoordinates[1], ligposcy[2]);
                pencil.ligposcy = vec3.fromValues(ligposcy[0]+clipCoordinates[0], ligposcy[1]+clipCoordinates[1], ligposcy[2]);
                
            }
            if(meshid == 5)
            {
                let dragX = event.clientX;
                let dragY = event.clientY;
                const clipCoordinates = renderer.mouseToClipCoord(dragX, dragY);
                pencil.transform.setTranslate(vec3.fromValues(clipCoordinates[0], clipCoordinates[1], 0));
                pencil.transform.updateMVPMatrix()
                //cube.transform.updateMVPMatrix();
                ligpospe = pencil.ligpospe;
                cube.ligpospe = vec3.fromValues(ligpospe[0]+clipCoordinates[0], ligpospe[1]+clipCoordinates[1], ligpospe[2]);
                cylinder.ligpospe = vec3.fromValues(ligpospe[0]+clipCoordinates[0], ligpospe[1]+clipCoordinates[1], ligpospe[2]);
                pencil.ligpospe = vec3.fromValues(ligpospe[0]+clipCoordinates[0], ligpospe[1]+clipCoordinates[1], ligpospe[2]);
                
            }
        }
    }
    else if(tracking == true)
    {
        var x = event.clientX
        var y = event.clientY;
        var dx, dy, dz;
    
        var curPos = trackballView(x, y);
          dx = curPos[0] - lastPos[0];
          dy = curPos[1] - lastPos[1];
          dz = curPos[2] - lastPos[2];
    
          if (dx || dy || dz) {
               axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
               axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
               axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];
          }
            if(meshid == 3)
            {
                anglecu = anglecu+(1* (Math.PI)/180);;
                cube.transform.setRotate(axis, anglecu);
                cube.transform.updateMVPMatrix();
            }
            if(meshid == 4)
            {
                //console.log("cylinder");
                anglecy = anglecy+(1* (Math.PI)/180);
                cylinder.transform.setRotate(axis, anglecy);
                cylinder.transform.updateMVPMatrix();
            }
            if(meshid == 5)
            {
                anglepe = anglepe+(1* (Math.PI)/180);
                pencil.transform.setRotate(axis, anglepe);
                pencil.transform.updateMVPMatrix();
            }
       // animate();
    }   
    });
    renderer.getcanvas().addEventListener("mouseup", function(event){
        if(event.button == 2)
        {
            if(mode == 1)
            {
                userinteracting = false;
            }
        }
        if(event.button == 0)
        {
            if(mode == 1)
            {
                console.log("mouseup");
                tracking = false;
            }
        }
    });
   // animate();

    function animate() 
        {
            renderer.clear();
            pencil.draw(shader);
           cylinder.draw(shader);
            cube.draw(shader);
            window.requestAnimationFrame(animate);
        }
    animate();
    shader.delete();
}