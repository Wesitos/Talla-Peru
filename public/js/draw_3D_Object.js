//var tablero, pata_derecha, pata_izquierda, vara_inferior_derecha;
//var vara, a, b, c;
//var obj;

//var width = 400,
//    height = 350;

/*$(container).bind('move', function (e) {

  object.rotation.y += e.deltaX * 0.005;
  object.rotation.x += e.deltaY * 0.005;

  render(scene, camera, renderer);
  });*/

var elements;
var global;

function draw_3D_Object (container) {

    var mesa;
    var renderer,camera,scene;

    // Creamos la escena y todos sus elementos
    elements = initial_setup(container);

    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;
    mesa = elements.mesa;
}

function scale(container, object){

    $("#controlx").bind("change",function(){
        var value = $(this).val();
        console.log(object.scale.x);
        object.scale.x = value;
        mesa = elements.mesa;
        render()
    })

    $("#controly").bind("change",function(){
        var value = $(this).val();
        console.log(object.scale.y);
        object.scale.y = value;
        mesa = elements.mesa;
        render()
    })

    $("#controlz").bind("change",function(){
        var value = $(this).val();
        console.log(object.scale.z);
        object.scale.z = value;
        mesa = elements.mesa;
        render()
    })
}

function girar(container, object){
    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;

    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render(scene, camera, renderer);
    })}

function initial_setup (container){
    //Configuramos la camara y el renderer inicial
    var loaded;

    var width = window.innerWidth/2;
    var height = window.innerWidth/2;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setSize(800,800)
    container.appendChild(renderer.domElement);

    //Creamos la camara que va mostrar la escena
    var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.z = 200;
    camera.position.x = 30;
    camera.position.y = 20;
    //Creamos la escena que va mostar el objeto
    var scene = new THREE.Scene();

    scene.add(camera);

    // Agregamos iluminacion
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    /*Agregamos sth */
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);

    manager.onProgress = function (item,loaded,total)
    { console.log( item, loaded, total ); }

    loader.load('./obj/mesa-split.obj', function (object) {
        //loaded = object;
        scene.add(object);
        console.log("cargue!");
        render();
        girar(container, object);
        scale(container,object);
    })

    return {
        scene : scene,
        mesa : loaded,
        camera : camera,
        renderer : renderer,
    }
}

function render () {
    //Render con los nuevos parametros de renderer
    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;

    renderer.render(scene, camera);
}
