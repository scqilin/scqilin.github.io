
//基本着色器
var baiseVertexShaderSource = "" +
    "attribute vec4 pos;"+
    "void main(){" +
    "gl_Position = pos;" +
    "gl_PointSize = 20.0;" +
    "}";
var baiseFragmentShaderSource = "" +
    "void main(){" +
    "gl_FragColor = vec4(1.0,.0,.0,1.0);" +
    "}";

function iniShaders(gl,vertexShaderSource,fragmentShaderSource) {
    var program = gl.createProgram();
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader,vertexShaderSource);
    gl.shaderSource(fragmentShader,fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
}

function bindAttributeBuffer(ctx,attributeName,data,program,n){
    var buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER,buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER,data,ctx.STATIC_DRAW);

    var posLocation = ctx.getAttribLocation(program,attributeName);
    ctx.vertexAttribPointer(posLocation,n||2,ctx.FLOAT,false,0,0);
    ctx.enableVertexAttribArray(posLocation);
}

// 4X4矩阵相乘
function multiplyMatrix(matrixA,matrixB) {
    var result = new Float32Array(16);
    for (var i = 0; i < 4; i++) {
        result[i] =
            matrixA[i] * matrixB[0] + matrixA[i + 4] * matrixB[1] + matrixA[i + 8] * matrixB[2] + matrixA[i + 12] * matrixB[3];
        result[i + 4] =
            matrixA[i] * matrixB[4] + matrixA[i + 4] * matrixB[5] + matrixA[i + 8] * matrixB[6] + matrixA[i + 12] * matrixB[7];
        result[i + 8] =
            matrixA[i] * matrixB[8] + matrixA[i + 4] * matrixB[9] + matrixA[i + 8] * matrixB[10] + matrixA[i + 12] * matrixB[11];
        result[i + 12] =
            matrixA[i] * matrixB[12] + matrixA[i + 4] * matrixB[13] + matrixA[i + 8] * matrixB[14] + matrixA[i + 12] * matrixB[15];
    }
    return result;
}
//旋转矩阵
function createXZMatrix(angle) {
    var x = Math.PI/180*angle;//弧度
    var sinB = Math.sin(x);
    var cosB = Math.cos(x);
    var xf = new Float32Array([
        cosB,sinB,0.0,0.0,
        -sinB,cosB,0.0,0.0,
        .0,.0,1.0,.0,
        .0,.0,.0,1.0,
    ]);
    return xf;
}
// 创建缩放矩阵
function createSFMatrix(sx, sy) {
    return new Float32Array([
        sx, 0.0, 0.0, 0.0,
        0.0, sy, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}
// 创建平移矩阵
function createPYMatrix(tx, ty) {
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        tx, ty, 0.0, 1.0
    ]);
}

// dot 点积运算
function dot(a,b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// minus 差
function minus(a,b){
    return new Float32Array([
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ]);
}

//  v 类型化数组
function normalize(v){
    var sum = 0;
    for(var i=0;i<v.length; i++){
        sum += v[i] * v[i];
    }
    var vm = Math.sqrt(sum); //返回平方根
    for(var j=0;j<v.length;j++){
        v[j] = v[j] / vm;
    }
}

// cross 叉积
function cross(a,b){
    var nX ,nY,nZ;
    nX = a[1] * b[2] - a[2] * b[1];
    nY = a[2] * b[0] - a[0] * b[2];
    nZ = a[0] * b[1] - a[1] * b[0];

    return new Float32Array([nX,nY,nZ]);
}

// 正射投影矩阵
function getOMX(left,right,bottom,top,near,far){
    return new Float32Array([
        2/(right-left),0,0,0,
        0,2/(top-bottom),0,0,
        0,0,-2/(far-near),0,
        -(right+left)/(right-left),
        -(top+bottom)/(top-bottom),
        -(far+near)/(far-near),
        1
    ]);
}

// 视图矩阵
function getVMatrix(eyeX,eyeY,eyeZ){
    var eye = new Float32Array([eyeX,eyeY,eyeZ]);
    var lookat = new Float32Array([0,0,0]);
    var up = new Float32Array([0,1,0]);

    var z = minus(eye,lookat);
    normalize(z);
    normalize(up);
    var x = cross(up,z);
    normalize(x);

    var y = cross(z,x);

    return new Float32Array([
        x[0],y[0],z[0],0,
        x[1],y[1],z[1],0,
        x[2],y[2],z[2],0,
        -dot(x,eye),-dot(y,eye),-dot(z,eye),1
    ]);

}
