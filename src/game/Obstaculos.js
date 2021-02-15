class Obstaculos extends THREE.Object3D {
	constructor(dificultad) {
		super();

		this.nodoMovimientoX = new THREE.Object3D();	//Nodo que le da movimiento a los obstaculos

		this.collidableMeshList = [];

		this.createSemaforo();
		this.pintarObstaculo(dificultad);
		this.add(this.nodoMovimientoX);

		

	}

	createSemaforo() {
		var that = this;
		var mtlLoader = new THREE.MTLLoader();
		var ruta = "../../models/TrafficLight/trafficlight.mtl";

		mtlLoader.load(ruta, function(materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load('../../models/TrafficLight/trafficlight.obj', function(coche) {
				//coche.scale.set(1.5, 1.5, 1.5);
				//coche.rotateX(-Math.PI / 2);
				//coche.rotateZ(-Math.PI / 2);
				coche.position.y = 0.5; //por la altura de la carretera
				coche.position.x = -340;
				coche.position.z = -24;
				coche.rotation.y = Math.PI / 2;

				that.nodoMovimientoX.add(coche);
			});
		});
		//return nodoCoche;
	}

	createObstaculo() {
		var retorno = new THREE.Object3D();

		var geometry = new THREE.BoxGeometry(5, 15, 20);
		var textValla = new THREE.TextureLoader().load("../../imgs/valla.jpg");
		var valla = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			map: textValla
		}));

		retorno.add(valla);
		return retorno;
	}

	pintarObstaculo(dificultad) {
		if (dificultad == 0){
			for (var i = 0; i < 125; i++) {
				var obstaculo = this.createObstaculo();
				obstaculo.position.x = -240 * (i + 3);
				var randomZ = Math.random() * 30 - 15;
				obstaculo.position.z = randomZ;
				//obstaculo.rotation.y = Math.random() * 6.2;
				this.nodoMovimientoX.add(obstaculo);
				this.collidableMeshList.push(obstaculo);
			}
		} else if (dificultad == 1){
			for (var i = 0; i < 150; i++) {
				var obstaculo = this.createObstaculo();
				obstaculo.position.x = -200 * (i + 3);
				var randomZ = Math.random() * 30 - 15;
				obstaculo.position.z = randomZ;
				//obstaculo.rotation.y = Math.random() * 6.2;
				this.nodoMovimientoX.add(obstaculo);
				this.collidableMeshList.push(obstaculo);
			}
		}
		
	}

	update(){
		this.nodoMovimientoX.position.x += 3;
	}

}