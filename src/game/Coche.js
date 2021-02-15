class Coche extends THREE.Object3D {
	constructor(manager) {
		super();
		this.nodoCoche = new THREE.Object3D();
		this.createCoche(manager);
		this.add(this.nodoCoche);
	}

	createCoche(manager) {
		var that = this; //Lo cambiamos por problemas al ejecutar con this
		//var nodoCoche = new THREE.Object3D(); 
		var mtlLoader = new THREE.MTLLoader(manager);
		var objLoader = new THREE.OBJLoader(manager);
		var ruta = "../../models/Dodge/CHALLENGER71.mtl";

		mtlLoader.load(ruta, function(materials) {
			materials.preload();
			
			objLoader.setMaterials(materials);
			objLoader.load('../../models/Dodge/CHALLENGER71.obj', function(coche) {
				coche.scale.set(6, 6, 6);
				coche.rotateX(-Math.PI / 2);
				coche.rotateZ(-Math.PI / 2);
				coche.position.y = 0.5; //por la altura de la carretera
				that.nodoCoche.add(coche);
			});
		});
		//para escalar en la colisión
		that.largoCoche = 27;
		
		var geomCajaColision = new THREE.BoxGeometry(27, 20, 10);
		var matCajaColision = new THREE.MeshBasicMaterial({
			color: 0xffffff
		});
		var cajaColision = new THREE.Mesh(geomCajaColision, matCajaColision);
		cajaColision.visible = false;
		that.nodoCoche.add(cajaColision);
		//cajaColision.translateX(20);
	}

	createCoche2(manager) {
		var that = this; //Lo cambiamos por problemas al ejecutar con this
		var mtlLoader = new THREE.MTLLoader(manager);
		var ruta = "../../models/Ferrari/Formula1mesh.mtl";

		mtlLoader.load(ruta, function(materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader(manager);
			objLoader.setMaterials(materials);
			objLoader.load('../../models/Ferrari/Formula1mesh.obj', function(coche) {
				coche.scale.set(0.08, 0.08, 0.08);
				coche.position.y = 0.5; //por la altura de la carretera
				that.nodoCoche.add(coche);
			});
		});
		that.largoCoche = 35;
		var geomCajaColision = new THREE.BoxGeometry(35, 20, 14);
		var matCajaColision = new THREE.MeshBasicMaterial({
			color: 0xffffff
		});
		var cajaColision = new THREE.Mesh(geomCajaColision, matCajaColision);
		cajaColision.visible = false;
		that.nodoCoche.add(cajaColision);
	}

	girarIzquierda() {
		if (this.nodoCoche.position.z >= 21) {} else {
			this.nodoCoche.position.z += 1.3;
			this.nodoCoche.rotation.y += 0.02;
		}
	}
	girarDerecha() {
		if (this.nodoCoche.position.z <= -21) {} else {
			this.nodoCoche.position.z -= 1.3;
			this.nodoCoche.rotation.y -= 0.02;

		}
	}
	enderezar() {
		this.nodoCoche.rotation.y = 0;
	}

	colisionCoche() {
		if (this.nodoCoche.rotation.z <= Math.PI) {
			//Escalamos efecto de choque
			this.nodoCoche.scale.x = 0.2;
			//Aquí cambiamos la posición para que quede pegado al obstaculo
			this.nodoCoche.position.x += -(this.largoCoche / 2) + (this.largoCoche * 0.2) + 4;
		}

	}
}