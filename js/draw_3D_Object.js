
function draw_3D_Object (container, obj_name) {
	
	var renderer = make_renderer(container)
	var camera = make_camera(container)

	load_3D_objec(obj_name, function (object) {
		
		var scene = make_scene(object)

		render(scene, camera, renderer)

		$(container).bind('move', function (e) {

			object.rotation.y += e.deltaX * 0.005
			object.rotation.x += e.deltaY * 0.005

			render(scene, camera, renderer)
		})

		grouping_pieces(obj_name, object.children, function (grouped_object) {
			
			var input = $('#input')
			
			input.change(function () {

				var scale = input.val() / 47.0
				
				new_scale(grouped_object, scale)

				render(scene, camera, renderer)
			})
		})
	})
}

function make_renderer (container) {
	
	var renderer = new THREE.WebGLRenderer( { alpha: true } )

	renderer.setSize(container.offsetWidth, container.offsetHeight)
	
	container.appendChild(renderer.domElement)

	return renderer
}

function make_camera (container) {

	var camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, 0.1, 1000)
	camera.position.z = 100

	return camera
}

function load_3D_objec (obj_name, callback) {

	var manager = new THREE.LoadingManager()
	var loader = new THREE.OBJLoader(manager)

	loader.load('./obj/' + obj_name + '.obj', function (object) {

		callback(object)
	})
}

function make_scene (object) {
	
	var scene = new THREE.Scene()

	scene.add(object)

	var directionalLight = new THREE.DirectionalLight(0xffeedd)
	directionalLight.position.set(0, 0, 1)

	scene.add(directionalLight)

	return scene
}

function render (scene, camera, renderer) {

	renderer.render(scene, camera)
}

function grouping_pieces (obj_name, objects_list, callback) {
	
	$.getJSON( "./obj/" + obj_name + '.json', function( data ) {

		var tablero, pata_derecha, pata_izquierda

		$.each(data.groups, function (i, group) {

			var father_name = group.father.name
			
			var father = find_piece(objects_list, father_name)
			
			if(father.name == 'tablero-centro')
				tablero = father
			if(father.name == 'union-frente-derecha')
				pata_derecha = father
			if(father.name == 'union-atras-derecha')
				pata_izquierda = father

			$.each(group.childrens, function (i, child) {

				var children = find_piece(objects_list, child.name)
				children.parent = father
			})
		})

		tablero.childs = []
		pata_derecha.initial_position = 18.53587
		tablero.childs[0] = pata_derecha
		pata_izquierda.initial_position = -18.53587
		tablero.childs[1] = pata_izquierda

		callback(tablero)
	})
}

function find_piece (obj_list, obj_name) {
	
	var piece

	$.grep(obj_list, function (item){
		
		if(item.name == obj_name)
			piece = item
	})

	return piece
}

function new_scale (object, new_scale) {

	object.scale.x = new_scale

	$.each( object.childs, function (i, child) {
		new_position(child, new_scale)
	})
}

function new_position (object, new_scale) {
	
	var initial_position = object.initial_position
	var final_position = initial_position * new_scale

	object.position.x = final_position - initial_position
}
