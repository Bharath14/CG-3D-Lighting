import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Transform from './transform.js'
export default class Mesh
{
	constructor(gl, filepath, color_,color_form = "default")
	{
		this.vertexPositionData = [];
		this.normalData = [];
		this.vertexIndices = [];
		(async() =>
		{
			const repsonse = await fetch(filepath);
			const objReadAsString = await repsonse.text();
			const meshData = new objLoader.Mesh(objReadAsString);
			this.vertexPositionData = new Float32Array(meshData.vertices);
			this.normalData = new Float32Array(meshData.vertexNormals);
			//console.log(this.normalData);
			this.vertexIndices = new Uint16Array(meshData.indices);
		}) ()
		this.colorcode = color_;
		this.colorform = color_form;
		this.gl = gl;

		this.matamb = vec3.fromValues(1, 0.5, 0.5);
		this.matdif = vec3.fromValues(1, 0.5, 0.5);
		this.matspec = vec3.fromValues(0.5, 0.5, 0.5);
		this.shine = 19;

		/*this.ligamb = vec3.fromValues(0.2, 0.2, 0.2);
		this.ligdif = vec3.fromValues(0.5, 0.5, 0.5);
		this.ligspec = vec3.fromValues(1, 1, 1);*/
		//cube
		this.ligambcu = vec3.fromValues(0.2, 0.2, 0.2);
		this.ligdifcu = vec3.fromValues(0.4, 0.3, 0.8);
		this.ligspeccu = vec3.fromValues(0.3, 0.2, 1);
		this.ligposcu = vec3.fromValues(-0.1,0,0.1);
		this.ligoncu = 1.0;

		//cylinder
		this.ligambcy = vec3.fromValues(0.1, 0.1, 0.3);
		this.ligdifcy = vec3.fromValues(0.1, 0.1, 0.3);
		this.ligspeccy = vec3.fromValues(0.4, 0.5, 0.9);
		this.ligposcy = vec3.fromValues(-1.2, 0, -0.2);
		this.ligoncy = 1.0;

		//pencil
		this.ligambpe = vec3.fromValues(0.2, 0.2, 0.2);
		this.ligdifpe = vec3.fromValues(0.6, 0.5, 0.7);
		this.ligspecpe = vec3.fromValues(0.8, 0.7, 0.5);
		this.ligpospe = vec3.fromValues(1.2, 0.1, 0.1);
		this.ligonpe = 1.0;

		this.ligoncup = 1.0;
		this.ligoncyp = 1.0;
		this.ligonpep = 1.0;
		this.minx =0;
		this.miny =0;
		this.minz =0;
		this.maxx =0;
		this.maxy =0;
		this.maxz =0;
		this.centroid = vec3.fromValues(0,0,0);

		this.gouraudphong = 0.0;
		this.bling = 0.0;

		this.boundingboxpos = [];
		this.buffer = this.gl.createBuffer();
		if (!this.buffer)
		{
			throw new Error("Buffer could not be allocated");
		}
		
		this.transform = new Transform();
	}

	IsLightinCuboid(pos, xmin, xmax, ymin, ymax, zmin, zmax) 
	{
		if ((xmin < pos[0] && pos[0] < xmax) && (ymin < pos[1] && pos[1] < ymax) && (zmin < pos[2] && pos[2] < zmax)) {
			
			return true;
		}
		 else 
		 {
			
			return false;
		}
	}

	boundingbox()
	{
		var minx = Infinity;
		var miny = Infinity;
		var minz = Infinity;
		var maxx = -Infinity;
		var maxy = -Infinity;
		var maxz = -Infinity;
		
		let array = Array.from(this.vertexPositionData);
		let xarray = [];
		let yarray = [];
		let zarray = [];
		for( var i =0; i<array.length; i=i+3)
		{
			xarray.push(array[i]);
			yarray.push(array[i+1]);
			zarray.push(array[i+2]);
		}
		minx = Math.min(minx, Math.min(...xarray));
		maxx = Math.max(maxx, Math.max(...xarray));
		miny = Math.min(miny, Math.min(...yarray));
		maxy = Math.max(maxy, Math.max(...yarray));
		minz = Math.min(miny, Math.min(...zarray));
		maxz = Math.max(maxz, Math.max(...zarray));

		this.centroid = vec3.fromValues((this.minx+this.maxx)/2,(this.miny+this.maxy)/2,(this.minz+this.maxz)/2)

		this.minx = minx;
		this.maxx = maxx;
		this.miny = miny;
		this.maxy = maxy;
		this.minz = minz;
		this.maxz = maxz;

		var out1 = vec3.create();
		var out2 = vec3.create();
		var out3 = vec3.create();
		var out4 = vec3.create();
		var out5 = vec3.create();
		var out6 = vec3.create();
		var out7 = vec3.create();
		var out8 = vec3.create(); 

		vec3.transformMat4(out1,(vec3.fromValues(this.minx, this.miny, this.minz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out2,(vec3.fromValues(this.minx, this.maxy, this.minz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out3,(vec3.fromValues(this.minx, this.miny, this.maxz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out4,(vec3.fromValues(this.minx, this.maxy, this.maxz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out5,(vec3.fromValues(this.maxx, this.miny, this.minz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out6,(vec3.fromValues(this.maxx, this.maxy, this.minz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out7,(vec3.fromValues(this.maxx, this.miny, this.maxz)),(this.transform.getMVPMatrix()));
		vec3.transformMat4(out8,(vec3.fromValues(this.maxx, this.maxy, this.maxz)),(this.transform.getMVPMatrix()));

		//console.log(out3);
		var boundingboxpos = []
		boundingboxpos.push(out1);
		boundingboxpos.push(out2);
		boundingboxpos.push(out3);
		boundingboxpos.push(out4);
		boundingboxpos.push(out5);
		boundingboxpos.push(out6);
		boundingboxpos.push(out7);
		boundingboxpos.push(out8);
		//console.log(boundingboxpos);
		let arrayb = Array.from(boundingboxpos);
		let xarrayb = [];
		let yarrayb = [];
		let zarrayb = [];
		for( var i =0; i<arrayb.length; i=i+1)
		{
			xarrayb.push(arrayb[i][0]);
			yarrayb.push(arrayb[i][1]);
			zarrayb.push(arrayb[i][2]);
		}
		//console.log(Math.min(...xarrayb));
		var minbx = Infinity;
		var minby = Infinity;
		var minbz = Infinity;
		var maxbx = -Infinity;
		var maxby = -Infinity;
		var maxbz = -Infinity;

		minbx = 1.25* Math.min(...xarrayb);
		maxbx = 1.25* Math.max(...xarrayb);
		minby = 1.25* Math.min(...yarrayb);
		maxby = 1.25* Math.max(...yarrayb);
		minbz = 1.25* Math.min(...zarrayb);
		maxbz = 1.25* Math.max(...zarrayb);

		if((this.IsLightinCuboid(this.ligposcu, minbx, maxbx, minby, maxby, minbz, maxbz))==false)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligoncup = 0.0;
			
		}
		if((this.IsLightinCuboid(this.ligposcu, minbx, maxbx, minby, maxby, minbz, maxbz))==true)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligoncup = 1.0;
			
		}
		if((this.IsLightinCuboid(this.ligposcy, minbx, maxbx, minby, maxby, minbz, maxbz))==false)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligoncyp = 0.0;
			
		}

		if((this.IsLightinCuboid(this.ligposcy, minbx, maxbx, minby, maxby, minbz, maxbz))==true)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligoncyp = 1.0;
			
		}
		if((this.IsLightinCuboid(this.ligpospe, minbx, maxbx, minby, maxby, minbz, maxbz))==false)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligonpep = 0.0;
			
		}
		if((this.IsLightinCuboid(this.ligpospe, minbx, maxbx, minby, maxby, minbz, maxbz))==true)
		{
			//console.log("cube");
			//console.log(minbz);
			this.ligonpep = 1.0;
			
		}
	}
	draw(shader)
	{
		this.color = [];
		if(this.colorform == "default")
		{
			for(var i =0;i<this.vertexPositionData.length/3;i++) 
			{
				this.color = this.color.concat(this.colorcode);
			}
		}
		else
		{
			for(var i =0;i<this.vertexPositionData.length/3;i++) 
			{
				this.color = this.color.concat([0,0,0]);
			}
		}
		this.boundingbox();
		//console.log("print");
		//console.log((this.transform.getMVPMatrix)*(vec4.fromValues(this.minx, this.miny, this.minz, 1.0)));
		var viewPosition = shader.uniform("viewPos");
        shader.setUniform3f(viewPosition, 0,0,1);

		var ligoncupp = 0.0;
		var ligoncypp = 0.0;
		var ligonpepp = 0.0;

		if(this.ligoncu && this.ligoncup)
		{
			ligoncupp = 1.0;
		}
		if(this.ligoncy && this.ligoncyp)
		{
			ligoncypp = 1.0;
		}
		if(this.ligonpe && this.ligonpep)
		{
			ligonpepp = 1.0;
		}
		else{
			ligoncupp = 0.0;
		    ligoncypp = 0.0;
		    ligonpepp = 0.0;
		}
		//Gouraud;
		var ka = shader.uniform("ka");
        var kd = shader.uniform("kd");
        var ks = shader.uniform("ks");
        var alpha = shader.uniform("alpha");
        shader.setUniform3fv(ka, this.matamb);
        shader.setUniform3fv(kd, this.matdif);
        shader.setUniform3fv(ks, this.matspec);
        shader.setFloat(alpha, this.shine);

		var gouraudphong = shader.uniform("gouraudphong");
		shader.setFloat(gouraudphong, this.gouraudphong);

		//console.log("ligoncu", this.ligoncu);
        var ambientcu = shader.uniform("lights[0].ambient");
        var diffusecu = shader.uniform("lights[0].diffuse");
        var specularcu = shader.uniform("lights[0].specular");
        var positioncu = shader.uniform("lights[0].position");
		var ligoncu = shader.uniform("lights[0].on");
		shader.setFloat(ligoncu, this.ligoncu);
        shader.setUniform3fv(ambientcu, this.ligambcu);
        shader.setUniform3fv(diffusecu, this.ligdifcu); 
        shader.setUniform3fv(specularcu, this.ligspeccu);
        shader.setUniform3fv(positioncu, this.ligposcu);

		//console.log("ligoncy", this.ligoncy);
		var ambientcy = shader.uniform("lights[1].ambient");
        var diffusecy = shader.uniform("lights[1].diffuse");
        var specularcy = shader.uniform("lights[1].specular");
        var positioncy = shader.uniform("lights[1].position");
		var ligoncy = shader.uniform("lights[1].on");
		shader.setFloat(ligoncy, this.ligoncy);
        shader.setUniform3fv(ambientcy, this.ligambcy);
        shader.setUniform3fv(diffusecy, this.ligdifcy); 
        shader.setUniform3fv(specularcy, this.ligspeccy);
        shader.setUniform3fv(positioncy, this.ligposcy);

		//console.log("ligonpe", this.ligonpe);
		var ambientpe = shader.uniform("lights[2].ambient");
        var diffusepe = shader.uniform("lights[2].diffuse");
        var specularpe = shader.uniform("lights[2].specular");
        var positionpe = shader.uniform("lights[2].position");
		var ligonpe = shader.uniform("lights[2].on");
		shader.setFloat(ligonpe, this.ligonpe);
        shader.setUniform3fv(ambientpe, this.ligambpe);
        shader.setUniform3fv(diffusepe, this.ligdifpe); 
        shader.setUniform3fv(specularpe, this.ligspecpe);
        shader.setUniform3fv(positionpe, this.ligpospe);

		//Phong
		var ka = shader.uniform("kaf");
        var kd = shader.uniform("kdf");
        var ks = shader.uniform("ksf");
        var alpha = shader.uniform("alphaf");
        shader.setUniform3fv(ka, this.matamb);
        shader.setUniform3fv(kd, this.matdif);
        shader.setUniform3fv(ks, this.matspec);
        shader.setFloat(alpha, this.shine);

		var bling = shader.uniform("bling");
		shader.setFloat(bling, this.bling);		

		//console.log("ligoncu", this.ligoncu);
        var ambientcu = shader.uniform("lightsf[0].ambient");
        var diffusecu = shader.uniform("lightsf[0].diffuse");
        var specularcu = shader.uniform("lightsf[0].specular");
        var positioncu = shader.uniform("lightsf[0].position");
		var ligoncu = shader.uniform("lightsf[0].on");
		shader.setFloat(ligoncu, this.ligoncu);
        shader.setUniform3fv(ambientcu, this.ligambcu);
        shader.setUniform3fv(diffusecu, this.ligdifcu); 
        shader.setUniform3fv(specularcu, this.ligspeccu);
        shader.setUniform3fv(positioncu, this.ligposcu);

		//console.log("ligoncy", this.ligoncy);
		var ambientcy = shader.uniform("lightsf[1].ambient");
        var diffusecy = shader.uniform("lightsf[1].diffuse");
        var specularcy = shader.uniform("lightsf[1].specular");
        var positioncy = shader.uniform("lightsf[1].position");
		var ligoncy = shader.uniform("lightsf[1].on");
		shader.setFloat(ligoncy, this.ligoncy);
        shader.setUniform3fv(ambientcy, this.ligambcy);
        shader.setUniform3fv(diffusecy, this.ligdifcy); 
        shader.setUniform3fv(specularcy, this.ligspeccy);
        shader.setUniform3fv(positioncy, this.ligposcy);

		//console.log("ligonpe", this.ligonpe);
		var ambientpe = shader.uniform("lightsf[2].ambient");
        var diffusepe = shader.uniform("lightsf[2].diffuse");
        var specularpe = shader.uniform("lightsf[2].specular");
        var positionpe = shader.uniform("lightsf[2].position");
		var ligonpe = shader.uniform("lightsf[2].on");
		shader.setFloat(ligonpe, this.ligonpe);
        shader.setUniform3fv(ambientpe, this.ligambpe);
        shader.setUniform3fv(diffusepe, this.ligdifpe); 
        shader.setUniform3fv(specularpe, this.ligspecpe);
        shader.setUniform3fv(positionpe, this.ligpospe);

		const uModelTransformMatrix = shader.uniform("model");	
		shader.setUniform4f(uModelTransformMatrix, this.transform.getMVPMatrix());
		
		const modeltranspose = shader.uniform("modeltranspose");	
		shader.setUniform4f(modeltranspose, this.transform.getworldinverse());

		const elementPerVertex = 3;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.DYNAMIC_DRAW);


		//const reverseLightDirectionLocation = [0.5, 0.7, 1];
		//const reverseLightDirectionLocation = shader.uniform("reverselight");
		//this.gl.uniform3fv(reverseLightDirectionLocation, [0.5, 0.7, 1]);
		//shader.uniform(reverselight, reverseLightDirectionLocation);

		const uModelViewMatrix = shader.uniform("view");
		shader.setUniform4f(uModelViewMatrix, this.transform.viewMatrix);
        
		const uProjectionMatrix = shader.uniform("projection");
		shader.setUniform4f(uProjectionMatrix, this.transform.ProjectionMatrix);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 0, 0);

		const normalbuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalbuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normalData, this.gl.STATIC_DRAW);

		const aNormal = shader.attribute("aNormal");
		this.gl.enableVertexAttribArray(aNormal);
		this.gl.vertexAttribPointer(aNormal, elementPerVertex, this.gl.FLOAT, false, 0, 0);
		
		/*this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.color), this.gl.STATIC_DRAW);

        const aColor = shader.attribute("aColor");
        this.gl.enableVertexAttribArray(aColor);
        this.gl.vertexAttribPointer(aColor, elementPerVertex, this.gl.FLOAT, false, 0, 0);*/

		const indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.DYNAMIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexBuffer);
	}
}