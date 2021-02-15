class Desierto extends THREE.Object3D{
	constructor(manager) {
		super();

		this.nodoMovimientoX = new THREE.Object3D();	//Da velocidad en sentido opuesto al coche para simular el movimiento hacia delante

		this.createDesierto(manager);
		this.createCielo(manager);
	}
	createDesierto(manager) {
		var textDesierto = new THREE.TextureLoader(manager).load("../../imgs/desierto.jpeg");
		textDesierto.wrapS = THREE.RepeatWrapping;
		textDesierto.wrapT = THREE.RepeatWrapping;
		textDesierto.anisotropy = 12;
		textDesierto.repeat.set(600, 800);

		var textCarretera = new THREE.TextureLoader(manager).load("../../imgs/carretera2.jpg");
		textCarretera.anisotropy = 12;
		textCarretera.wrapS = THREE.RepeatWrapping;
		textCarretera.repeat.set(600, 1);

		this.desierto = new THREE.Mesh(new THREE.PlaneGeometry(30000, 20000),
			new THREE.MeshBasicMaterial({
				map: textDesierto
			})
		);
		this.desierto.position.x = -14900;
		this.carretera = new THREE.Mesh(new THREE.PlaneGeometry(30000, 50),
			new THREE.MeshBasicMaterial({
				map: textCarretera
			})
		);
		this.carretera.position.x = -14900;
		

		this.desierto.rotation.x = -Math.PI / 2;
		this.carretera.rotation.x = -Math.PI / 2;
		this.carretera.position.y = 0.5;

		
		this.nodoMovimientoX.add(this.desierto);
		this.nodoMovimientoX.add(this.carretera);
		
		this.pintarCactus();
		this.pintarCactus2(manager);

		this.add(this.nodoMovimientoX);
	}

	createCactus() {
		var retorno = new THREE.Object3D();

		this.alturaCactus = Math.random() / 2 + 1.4;

		var segmentosA = Math.random() * 3 + 3;
		var segmentosB = Math.random() * 3 + 3;
		var segmentosRamas = Math.random() * 5 + 3;
		
		var material = new THREE.MeshPhongMaterial({
			color: 0x116930,
			flatShading: true
		});

		var geomCentro = new THREE.SphereGeometry(this.alturaCactus, segmentosA, segmentosB);
		var centro = new THREE.Mesh(geomCentro, material);
		retorno.add(centro);

		var geomDerecha = new THREE.SphereGeometry(this.alturaCactus * 1.2, segmentosRamas, segmentosRamas);
		var derecha = new THREE.Mesh(geomDerecha, material);
		derecha.position.x = this.alturaCactus * 1.2;
		derecha.position.y = this.alturaCactus * 1.2;
		retorno.add(derecha);

		var geomIzquierda = new THREE.SphereGeometry(this.alturaCactus * 1.4, segmentosRamas, segmentosRamas);
		var izquierda = new THREE.Mesh(geomIzquierda, material);
		izquierda.position.x = -this.alturaCactus * 1.4;
		izquierda.position.y = this.alturaCactus * 1.4;
		retorno.add(izquierda);

		return retorno;
	}

	createCactus2(manager) {
		var that = this;
		var retorno = new THREE.Object3D();

		var objLoader = new THREE.OBJLoader(manager);
		objLoader.load('../../models/Cactus/Cactus.obj', function(cactus) {
			cactus.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						color: 0x42BE1A
					});
					child.receiveShadow = true;
					child.castShadow = true;
				}
			});
			retorno.add(cactus);
		});
		return retorno;
	}

	pintarCactus() {
		for (var i = 0; i < 600; i++) {
			var cactus = this.createCactus();
			
			do {
				var randomZ = Math.random() * 800 - 400;
			} while (randomZ < 30 && randomZ > -30)
			cactus.position.x = Math.random() * -20000 + 30;
			cactus.position.z = randomZ;
			cactus.position.y = this.alturaCactus / 2;
			cactus.rotation.y = Math.random() * 6.2;
			this.nodoMovimientoX.add(cactus);
		}
	}

	pintarCactus2(manager) {
		for (var i = 0; i < 200; i++) {
			var cactus = this.createCactus2(manager);
			
			do {
				var randomZ = Math.random() * 600 - 300;
			} while (randomZ < 30 && randomZ > -30)
			cactus.position.x = Math.random() * -20000 + 30;
			cactus.position.z = randomZ;
			cactus.position.y = this.alturaCactus / 2;
			cactus.rotation.y = Math.random() * 6.2;
			this.nodoMovimientoX.add(cactus);
			//this.add(cactus);
		}
	}

	createCielo(manager){
		this.nodoCielo = new THREE.Object3D();

		var skyGeo = new THREE.SphereGeometry(900, 25, 25);
		skyGeo.rotateY(Math.PI /2);

		var textCielo = new THREE.TextureLoader(manager).load("../../imgs/cielo2.jpg");

        var material = new THREE.MeshBasicMaterial({ 
        	map: textCielo
		});

		var sky = new THREE.Mesh(skyGeo, material);
    	sky.material.side = THREE.BackSide;

    	this.fog = new THREE.FogExp2(0xffffff, 0.0011);  //Crea niebla en el horizonte

    	this.nodoCielo.add(sky);
    	this.add(this.nodoCielo);
	}

	getDistanciaRecorrida(){
		return (this.nodoMovimientoX.position.x/10);
	}

	update(){
		this.nodoMovimientoX.position.x += 3;
		this.nodoCielo.rotation.y += 0.0004;
	}
}