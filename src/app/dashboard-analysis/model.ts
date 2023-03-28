import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export class ThreeJSModel  {

    public json_machine_status_color = 
    {
      machine_color:
      {
        //normal_color: 0x0073e6,
        normal_color: 0x2ECC71,
        //abnormal_color: 0xF7DC6F,
        abnormal_color: 0xE74C3C,
        not_in_use_color:0xD0D3D4
      },
      machine_outline_color:
      {
        //normal_color: 0x3498DB,
        normal_color: 0x2ECC71,
        //abnormal_color: 0xF39C12,
        abnormal_color: 0xE74C3C,
        not_in_use_color: 0x626567
      }
    };

    public json_canvas_machine_status_color = 
    {
      machine_color:
      {
        normal_color: "#ECF0F1",
        abnormal_color: "#F7DC6F",
        not_in_use_color: "#D0D3D4"
      },
      machine_outline_color:
      {
        normal_color: "#3498DB",
        abnormal_color: "#F39C12",
        not_in_use_color: "#626567"
      }
    };

    public VIEW_ANGLE = 45;
    public ASPECT = window.innerWidth / window.innerHeight;
    public NEAR = 0.1;
    public FAR = 1000;

    public mesh_scene = new THREE.Scene();
    public CSS_scene = new THREE.Scene();
    public camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    public renderer = new THREE.WebGLRenderer({antialias:true});
    public CSSRenderer = new CSS3DRenderer();
    public controls = new OrbitControls(this.camera, this.renderer.domElement );

    public meshCollector = [];
    public meshTextureCollector = [];
    public meshTextCollector = [];
    public meshMessageBoxCollector = [];
    public font : any;
    public rendererContainer: any;

    initRendererContainer(rendererContainer){
        this.rendererContainer = rendererContainer;
    }

    load3DContent(json_machine_details_data) {
        const promises = [
            this.loadFont(),
            this.initTexture(json_machine_details_data)
        ];

        Promise.all(promises).then(result => {
            this.font = result[0];
            console.log("We received font,", result[0],"!");
            console.log("We received textures,", this.meshTextureCollector,"!");
        }).then(func => {
            this.rerender3DScene();
            this.load3DItems(json_machine_details_data);

            this.meshCollector.forEach(mesh => {
                this.mesh_scene.add(mesh);
            });
            this.meshTextCollector.forEach(meshText => {
                this.mesh_scene.add(meshText);
            });
            this.meshMessageBoxCollector.forEach(meshMessageBox => {
                this.CSS_scene.add(meshMessageBox);
            });
        }).then(func => {
            console.log(this.meshMessageBoxCollector.length);

            this.CSSRenderer.render(this.CSS_scene, this.camera);
            this.CSSRenderer.domElement.style.position = 'absolute';
            this.CSSRenderer.domElement.style.top = 0;

            this.CSSRenderer.clear = true;
            this.CSSRenderer.depthTest = true;

            console.log(this.rendererContainer);
            this.rendererContainer.nativeElement.appendChild( this.CSSRenderer.domElement );
        });
    }

    initTexture(json_machine_details_data) {
        const promises = [];

        json_machine_details_data.forEach(element => {
            promises.push(this.loadTexture(element));
        });

        return Promise.all(promises).then(result => {
            //console.log(result);
            return result;
        });
    }

    loadTexture(element) {
        return new Promise(resolve => {
            var textureURL = '/assets/img/' + element.imagefile;
            var jsonObject = {};
            jsonObject["substationcode"] = element.substationcode;
            jsonObject["texture"] = new THREE.TextureLoader().load(textureURL, resolve);

            //console.log(jsonObject);
            this.meshTextureCollector.push(jsonObject);
            return jsonObject;
        }).catch(err => {
            console.error(err);
        });
    }

    initFont() {
        const promises = [
            this.loadFont()
        ];
        
        return Promise.all(promises).then(result => {
            return result[0];
        });
    }
    
    loadFont() {
        return new Promise(resolve => {
            var fontURL = '../../../assets/threejs/fonts/helvetiker_regular.typeface.json';
            return new THREE.FontLoader().load(fontURL, resolve);
        }).catch(err => {
            console.error(err);
        });
    }

    load3DItems(json_machine_details_data) {
        json_machine_details_data.forEach(element => {
            this.construct3DObject(element);
        });
    }

    construct3DObject(element) {
        var mesh_color = this.applyMeshStatusColor(element);
        var mesh_outline_color = this.applyMeshStatusColor(element);
        var mesh_canvas_color = this.applyMeshStatusColor(element);

        //---------- draw 3D box ----------//
        var geometry = new THREE.BoxBufferGeometry( 
            element.geometrywidth, 
            element.geometryheight, 
            element.geometrydepth);
        
        var texture = this.meshTextureCollector.find(item => item.substationcode === element.substationcode).texture;
        var materialTexture = new THREE.MeshBasicMaterial( { map: texture } );

        var materials = [
            new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
            new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
            (element.substationcode =="MAG01" || element.substationcode =="CTF01" ) ? 
                materialTexture : 
                new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
            new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
            new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
            new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } )
        ];

        //--------- set position and texture ---------//
        var mesh = new THREE.Mesh( geometry, materials );
        mesh.position.x = (element.geometrywidth / 2) + parseInt(element.positionz);
        mesh.position.y = (element.geometryheight / 2) + 0.1;
        mesh.position.z = (element.geometrydepth / 2) + parseInt(element.positionx);

        mesh.rotation.x = element.rotationx;
        mesh.rotation.y = element.rotationy;
        mesh.rotation.z = element.rotationz;

        //--------- set position and texture ---------//
        var mesh = new THREE.Mesh( geometry, materials );
        mesh.position.x = (element.geometrywidth / 2) + parseInt(element.positionz);
        mesh.position.y = (element.geometryheight / 2) + 0.1;
        mesh.position.z = (element.geometrydepth / 2) + parseInt(element.positionx);

        mesh.rotation.x = element.rotationx;
        mesh.rotation.y = element.rotationy;
        mesh.rotation.z = element.rotationz;

        //--------- draw edge ---------//
        var edges = new THREE.EdgesGeometry( mesh.geometry );
        var line = new THREE.LineBasicMaterial
        ( 
            { 
                color: mesh_outline_color,
                linewidth: 10
            } 
        );

        var wireframe = new THREE.LineSegments( edges, line );
        mesh.add(wireframe);

        this.meshCollector.push(mesh);

        //--------- Create 3D Text ---------//
        const color = 0xFFFFFF;
        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            //opacity: 0.4,
            side: THREE.DoubleSide
        } );

        var message = element.substationname;
		var shapes = this.font.generateShapes( message, 8 );
		var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );

        //--------- set position and texture ---------//
        const text = new THREE.Mesh( geometry, matLite );
        text.position.x = ((element.geometrywidth / 2) + parseInt(element.positionz));
        text.position.y = ((element.geometryheight / 2) + 0.1);
        text.position.z = ((element.geometrydepth / 2) + parseInt(element.positionx)) + 50;

        text.rotation.x = - Math.PI / 2;

        if (element.substationcode =="MAG01" || element.substationcode =="CTF01" )
            this.meshTextCollector.push(text);

        //--------- construct 3D Messagebox ---------//
        if (element.anomaly_results == "1")
            this.construct3DMessagebox(element);
    }

    construct3DMessagebox(element) {
        var element_test = <HTMLDivElement>document.createElement('div');
        element_test.innerHTML = 'Number of Alarms exceeds normal threshold.';
        //element_test.innerHTML = this.content;
        element_test.className = 'messagebox';
        element_test.style.width = '150px';
        element_test.style.height = '50px';
        //element_test.style.background = 'rgb(241, 196, 15 ,0.50)';
        element_test.style.background = 'rgb(64, 6, 2 ,0.50)';
        //element_test.style.backgroundImage = 'linear-gradient(to bottom right, #F1C40F, #1C2833)';
        element_test.style.boxShadow='0px 0px 12px rgba(255, 15, 0 ,0.75)';
        element_test.style.border='2px solid rgba(134, 29, 22 ,0.25)';
        element_test.style.color='rgba(255,255,255,0.75)';
        element_test.style.textShadow='0 0 10px rgba(255, 15, 0 ,0.75)';
        element_test.style.fontSize='10px';
        element_test.style.fontFamily='"Orbitron", sans-serif';
        element_test.style.padding='5px';

        var object = new THREE.Object3D();

        var element3d = new CSS3DObject(element_test);
        element3d.position.x = ((element.geometrywidth / 2) + parseInt(element.positionz)) + 50;
        element3d.position.y = ((element.geometryheight / 2) + 0.1);
        element3d.position.z = ((element.geometrydepth / 2) + parseInt(element.positionx)) - 75;

        object.css3dObject = element3d;
        object.add(element3d);

        this.meshMessageBoxCollector.push(element3d);
    }









    rerender3DScene() {
        // scene and camera
        this.CSS_scene = new THREE.Scene();
        this.mesh_scene = new THREE.Scene();

        this.mesh_scene.background = new THREE.Color(0x1C2833);
    
        //this.camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
        //this.camera.position.set( 1000* 0.6, 800, 1000 * 0.9 );
        //this.camera.lookAt( 350 * 0.9, 50 * 4.0, 150 * 1.5 );

        this.camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
        //this.camera.position.set( 1000 * 1.2, 800 * 1.5, 1000 * 1.5 );
        //this.camera.lookAt( 800, -300, 0 );

        //---------- use this ----------//
        this.camera.position.set( 1000 * 2.0, 800 * 1.5, 1000 * 1.5 );
        this.camera.lookAt( 750, -100, 0 );

        //this.camera.lookAt( 350 * 2.0, 50 * -2.0, 150 * -2.5 ); 
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set( 300, -600, -500  );
        this.controls.update();

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.CSSRenderer.setSize( window.innerWidth - 350, window.innerHeight - 80 );
        this.renderer.setSize(window.innerWidth - 350, window.innerHeight - 80);
    }

    applyMeshStatusColor(element){
        if (element.substationstatuscode == 'false')
            return this.json_machine_status_color.machine_color.not_in_use_color;
        else if (element.anomaly_results == "0")
            return this.json_machine_status_color.machine_color.normal_color;
        else 
            return this.json_machine_status_color.machine_color.abnormal_color;
    }

    afterViewInit(rendererContainer) {

        this.CSSRenderer.setSize(window.innerWidth  - 350, window.innerHeight- 80 );
        this.CSSRenderer.domElement.style.position = 'absolute';
        this.CSSRenderer.domElement.style.zIndex = -1;
        this.CSSRenderer.domElement.style.top = 0;

        //this.CSSRenderer.clear = true;
        //this.CSSRenderer.depthTest = true;
        rendererContainer.nativeElement.appendChild( this.CSSRenderer.domElement );

        this.renderer.setSize(window.innerWidth - 350, window.innerHeight - 80);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        //this.renderer.domElement.style.zIndex = 10;
        rendererContainer.nativeElement.appendChild(this.renderer.domElement);

        console.log(this.meshMessageBoxCollector.length);
        //this.CSSRenderer = new CSS3DRenderer(this.CSS_scene);
        
        this.animate();
    }

    animate() {

        this.CSSRenderer = new CSS3DRenderer(this.CSS_scene, this.camera);
        this.CSSRenderer.setSize(window.innerWidth - 350, window.innerHeight - 80 );

        this.renderer.render(this.mesh_scene, this.camera);
        this.renderer.setSize(window.innerWidth - 350, window.innerHeight - 80);
        this.renderer.setPixelRatio( window.devicePixelRatio );
    
        window.requestAnimationFrame(() => this.animate());
    }
  
}