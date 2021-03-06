import { vec3, mat4, quat} from 'https://cdn.skypack.dev/gl-matrix';
function TransposeMatrix(a) {
    var out = mat4.create();
    if (out === a) {
        let a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        let a12 = a[6],
            a13 = a[7];
        let a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    return out;
}

function inverseMatrix(a) {
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    let det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
        return null;
    }
    det = 1.0 / det;
    var out = mat4.create();
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
}
export default class Transform
{
	constructor()
	{
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 0.5, 0.5, 0.5);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.mvpMatrix = this.modelTransformMatrix;
		this.viewMatrix = mat4.create();
		this.ProjectionMatrix = mat4.create();
		mat4.lookAt(this.viewMatrix, vec3.fromValues(0,0,1), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
		mat4.perspective(this.ProjectionMatrix, 90, 1, 0.01, 100);
		this.updateMVPMatrix();
	}

	getMVPMatrix()
	{
		return this.modelTransformMatrix;
	}
	getworldinverse()
	{
		return TransposeMatrix(inverseMatrix(this.modelTransformMatrix));
	}
    rotation()
    {
        var dir = vec3.fromValues(0,0,0);
        dir = vec3.normalize(dir, this.rotationAxis) ;
        var angle =  this.rotationAngle;
        var x = dir[0]*Math.sin(angle/2);
        var y = dir[1]*Math.sin(angle/2);
        var z = dir[2]*Math.sin(angle/2);
        var w = Math.cos(angle/2);
        var q = quat.fromValues(x,y,z,w);
        var matrix = mat4.create();
        mat4.fromQuat(matrix, q);
        return matrix;
    }
	updateMVPMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
		
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		
		//mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);

        mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotation());

        //console.log(this.modelTransformMatrix);

		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}
	
	setProjectionMatrix(projectionmat)
	{
		this.ProjectionMatrix = projectionmat;
	}

	getviewMatrix()
	{
		return this.viewMatrix;
	}

	getProjectionMatrix()
	{
		return this.ProjectionMatrix;
	}

	setviewMatrix(view)
	{
		this.viewMatrix = view;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}
}