 /**
  * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
  */

class MyScene extends THREE.Scene {
 	constructor(myCanvas) {
 		super();

 		this.renderer = this.createRenderer(myCanvas);
 		this.createLights();
 		this.createCamera();

 		this.applicationMode = MyScene.NO_ACTION; //No queremos que el modelo se mueva por ahora
 		this.model = this.createModel();	//El modelo contiene coche, desierto y obstáculos
 		this.add(this.model);	//Lo añadimos a la escena
 	}

 	

 	createCamera() {
 		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
 		this.camera.position.set(82, 20, -10);
 		var look = new THREE.Vector3(-160, 0, 0); //orientación
 		this.camera.lookAt(look);
 		this.add(this.camera);

 		this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement);
 		this.cameraControl.rotateSpeed = 5;
 		this.cameraControl.zoomSpeed = -2;
 		this.cameraControl.panSpeed = 0.5;
 		this.cameraControl.target = look;
 	}

 	createModel() {
 		var model = new THREE.Object3D();
 		//este manager hace que salga la pantalla de carga hasta que se carguen los objetos
 		this.manager = new THREE.LoadingManager();

 		this.coche = new Coche(this.manager);
 		model.add(this.coche);

 		this.desierto = new Desierto(this.manager);
 		model.add(this.desierto);

 		return model;
 	}

 	createSounds() {
 		var that = this;
 		var listener = new THREE.AudioListener();
 		this.camera.add(listener);

 		that.sound = new THREE.Audio(listener);
 		that.sound2 = new THREE.Audio(listener);

 		//Cargamos el sonido del coche y el del choque
 		var audioLoader = new THREE.AudioLoader();
 		audioLoader.load('../../sounds/F1Alonso.mp3', function(buffer) {
 			that.sound.setBuffer(buffer);
 			that.sound.setLoop(true);
 			that.sound.setVolume(0.1);
 			that.sound.play();
 		});
 		var audioLoader2 = new THREE.AudioLoader();
 		audioLoader.load('../../sounds/crash.mp3', function(buffer) {
 			that.sound2.setBuffer(buffer);
 			that.sound2.setLoop(false);
 			that.sound2.setVolume(0.5);
 			//este no le hacemos play hasta que choque
 		});
 	}

 	createLights() {
 		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
 		this.add(ambientLight);

 		this.spotLight = new THREE.SpotLight(0xffffff, 0.8);
 		this.spotLight.position.set(-80, 60, 0);
 		this.add(this.spotLight);
 	}

 	createRenderer(myCanvas) {
 		var renderer = new THREE.WebGLRenderer();
 		renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
 		renderer.setSize(window.innerWidth, window.innerHeight);
 		$(myCanvas).append(renderer.domElement);

 		return renderer;
 	}

 	getCamera() {
 		return this.camera;
 	}

 	iniciarJuego(dificultad){
 		this.createSounds();
		document.getElementById("marcador").style.display = "block";
		if (dificultad == 1){	//avanzado añadimos más obstáculos
			this.obstaculos = new Obstaculos(1);
 			this.model.add(this.obstaculos);
		} else if(dificultad == 0){//principiante, añadimos menos
			this.obstaculos = new Obstaculos(0);
 			this.model.add(this.obstaculos);
		}
 		this.applicationMode = MyScene.PLAY;
 	}

 	setCameraAspect(ratio) {
 		this.camera.aspect = ratio;
 		this.camera.updateProjectionMatrix();
 	}

 	onWindowResize() {
 		this.setCameraAspect(window.innerWidth / window.innerHeight);
 		this.renderer.setSize(window.innerWidth, window.innerHeight);
 	}

 	onKeyDown() {
 		var that = this;
 		document.onkeydown = function(code) {
 			switch (code.keyCode) {
 				case 37:
 				//Si está en estado de pausa o acabado no seguimos moviendo el coche
 					if (that.applicationMode != MyScene.FINISHED && that.applicationMode != MyScene.NO_ACTION){
	 					that.coche.girarIzquierda();
 					}
 					break;
 				case 39:
 					if (that.applicationMode != MyScene.FINISHED && that.applicationMode != MyScene.NO_ACTION){
	 					that.coche.girarDerecha();
 					}
 					break;
 				case 32:
 					if (that.applicationMode != MyScene.FINISHED){
 						if (document.getElementById("menu_pausa").style.display == ""){
	 						that.applicationMode = MyScene.NO_ACTION;
	 						that.sound.pause();
	 						document.getElementById("menu_pausa").style.display = "block";
	 					} else {
	 						document.getElementById("menu_pausa").style.display = "";
	 						that.applicationMode = MyScene.PLAY;	
	 						that.sound.play();
	 					}
 					}
 				break;
 			}
 		}
 	}

 	onKeyUp() {
 		var that = this;
 		document.onkeyup = function(code) {
 			switch (code.keyCode) {
 				case 37:
 					that.coche.enderezar();
 					break;
 				case 39:
 					that.coche.enderezar();
 					break;
 			}
 		}
 	}

 	detectarColision() {
 		//Aquí detectamos si la caja del coche colisiona con las vallas
 		var origen = this.coche.nodoCoche.position.clone();
 		for (var numVertice = 0; numVertice < this.coche.nodoCoche.children[0].geometry.vertices.length; numVertice++) {
 			var verticeLocal = this.coche.nodoCoche.children[0].geometry.vertices[numVertice].clone();
 			var verticeGlobal = verticeLocal.applyMatrix4(this.coche.nodoCoche.children[0].matrix);
 			var vecDireccion = verticeGlobal.sub(this.coche.nodoCoche.children[0].position);

 			var ray = new THREE.Raycaster(origen, vecDireccion.clone().normalize());
 			var resultado = ray.intersectObjects(this.obstaculos.nodoMovimientoX.children, true); //true para colisiones
 			if (resultado.length > 0 && resultado[0].distance < vecDireccion.length()) {
 				this.applicationMode = MyScene.CRASH;
 			}
 		}
 	}

 	//Actualiza puntuación del marcador
 	actualizarMarcador(){
 		document.getElementById("marcador").innerHTML = this.desierto.getDistanciaRecorrida();
 	}

 	restart(){
 		this.applicationMode = MyScene.NO_ACTION;
 		this.model = this.createModel();
 		//Borramos el modelo anterior y cargamos el nuevo
 		this.remove(this.children[3]);
 		this.add(this.model);

 		document.getElementById("volver").style.display = "none";
 		document.getElementById("marcador").style.display = "none";

 	}

 	update() {
 		this.manager.onProgress = function ( item, loaded, total ) {
			document.getElementById("loading").style.display = "block";
			//console.log( item, loaded, total );
		};
		this.manager.onLoad = function ( item, loaded, total ) {
			document.getElementById("pantalla_menu").style.display = "inline-block";
			document.getElementById("loading").style.display = "none";
		};
 		//no queremos que se mueva la cámara
 		//this.cameraControl.update();

 		this.renderer.render(this, this.getCamera());
 		requestAnimationFrame(() => this.update());

 		// Se actualiza el resto del modelo
 		if (this.applicationMode == MyScene.PLAY) {
 			document.getElementById("pantalla_menu").style.display = "none";
 			
 			this.desierto.update();
 			this.obstaculos.update();
 			this.detectarColision();
 			this.actualizarMarcador();
 			//Si acaba la carretera acaba el juego
 			if (this.desierto.getDistanciaRecorrida() >= 3000)
 				this.applicationMode == MyScene.CRASH;
 		}
 		if (this.applicationMode == MyScene.CRASH) {
 			document.getElementById("volver").style.display = "block";

 			this.coche.colisionCoche();
 			this.sound.stop();
 			this.sound2.play();
 			this.applicationMode = 3;
 		}
 		if (this.applicationMode == MyScene.NO_ACTION) {}
 		if (this.applicationMode == MyScene.FINISHED) {}
 	}
}
//Variables globales de estado
 MyScene.NO_ACTION = 0;
 MyScene.PLAY = 1;
 MyScene.CRASH = 2;
 MyScene.FINISHED = 3;

 /// La función main
 $(function() {
 	// Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
 	var scene = new MyScene("#WebGL-output");

 	// Se añaden los listener de la aplicación
 	window.addEventListener("resize", () => scene.onWindowResize());
 	window.addEventListener("keydown", () => scene.onKeyDown());
 	window.addEventListener("keyup", () => scene.onKeyUp());
 	document.getElementById("principiante").addEventListener("click", () => scene.iniciarJuego(0));
 	document.getElementById("avanzado").addEventListener("click", () => scene.iniciarJuego(1));
 	document.getElementById("volver").addEventListener("click", () => scene.restart());

 	scene.update();
 });
/*
function sleep(ms) {
  var start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
  return;
}*/