# es6 three.js 开发

## 单例模式

```javascript
import * as THREE from "three"
let { innerWidth: WIDTH, innerHeight: HEIGHT } = window
let { scene, camera, renderer } = consts, state = new State()
let b1, b2, b3, b4;

let div_WebGL = document.createElement('div')
div_WebGL.id = 'webgl-output'
document.body.appendChild(div_WebGL)
let container = document.getElementById('webgl-output')

class DrBaseScene {
    static getInstance(){
        if(!DrBaseScene.instance){
            DrBaseScene.instance = new DrBaseScene()
        }
        return DrBaseScene.instance
    }   
    constructor() {
        this.animate = this.animate.bind(this) //绑定this的指向
        this.init()
    }
    init() {
        this.setScene()
        this.setGUI()
        this.setCamera()
        this.addAxis()
        this.iniPlane()
        this.setLights()
        this.setRender()
        this.orbitControls()
        this.animate()
        this.windowResize()
    }
    setRender() {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        });
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor(0x220022, 1);
        container.appendChild(renderer.domElement);
    }
    animate() {
        requestAnimationFrame(this.animate);
        this.render(); //需要绑定this的指向
    }
    car(z) {       
        b2.position.z = z
    }
}

// 单例调用
let f1 = DrBaseScene.getInstance()
f1.car(10)

let f2 = DrBaseScene.getInstance()
f2.car(0)

let f3= DrBaseScene.getInstance()
f3.car(-10)
```