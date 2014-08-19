
var tablero, pata_derecha, pata_izquierda, vara_inferior_derecha;
var vara, a, b, c;
var obj;

function draw_3D_Object (container, obj_name) {
    
    var renderer = make_renderer(container);
    var camera = make_camera(container);

    load_3D_objec(obj_name, function (object) {
	
	//obj = object

	var scene = make_scene(object);

	render(scene, camera, renderer);

	$(container).bind('move', function (e) {

	    object.rotation.y += e.deltaX * 0.005;
	    object.rotation.x += e.deltaY * 0.005;

	    render(scene, camera, renderer);
	})

	grouping_pieces(obj_name, object.children, function (grouped_object) {
	    
	    var input = $('#input');
	    
	    input.change(function () {
		var scale = input.val() / 47.0;

		grouped_object.scale.x = scale;
		var final_long = grouped_object.initial_long * scale;

		var lf = final_long - 2*5.811 - 2*1.778 + 2*0.961;
		var x = lf / 33.464;
		
		grouped_object.childs[2].scale.x = x;

		var y = final_long/2.0 - 5.811 - (31.542/2.0 + 1.778);

		grouped_object.childs[0].position.x = y;
		grouped_object.childs[1].position.x = -y;

		render(scene, camera, renderer);
	    })
	})
    })
}

function make_renderer (container) {
    
    var renderer = new THREE.WebGLRenderer( { alpha: true } );

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    
    container.appendChild(renderer.domElement);

    return renderer;
}

function make_camera (container) {

    var camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, 0.1, 1000);
    camera.position.z = 100;

    return camera;
}

function load_3D_objec (obj_name, callback) {

    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);

    loader.load('./obj/' + obj_name + '.obj', function (object) {

	callback(object);
    })
}

function make_scene (object) {
    
    var scene = new THREE.Scene();

    scene.add(object);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);

    scene.add(directionalLight);

    return scene;
}

function render (scene, camera, renderer) {

    renderer.render(scene, camera);
}

function grouping_pieces (obj_name, objects_list, callback) {
    
    $.getJSON( "./obj/" + obj_name + '.json', function( data ) {


	$.each(data.groups, function (i, group) {

	    var father_name = group.father;
	    
	    var father = find_piece(objects_list, father_name);
	    
	    if(father.name == 'tablero-centro') tablero = father;
	    if(father.name == 'union-frente-derecha') pata_derecha = father;
	    if(father.name == 'union-atras-derecha') pata_izquierda = father;
	    if(father.name == 'vara-superior-izquierda') vara = father;

	    
	    $.each(group.childrens, function (i, child_name) {

		var children = find_piece(objects_list, child_name);

		children.parent = father;
	    })
		})
	    
	    
	    tablero.childs = [];
	
	tablero.initial_long = 46.72;
	tablero.childs = [];

	tablero.childs[0] = pata_derecha;
	tablero.childs[1] = pata_izquierda;
	tablero.childs[2] = vara;
	
	callback(tablero);
	
    })
}

function find_piece (obj_list, obj_name) {
    
    var piece;

    $.grep(obj_list, function (item){
	
	if(item.name == obj_name);
	    piece = item;
    })

    return piece;
}
/*
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
*/
