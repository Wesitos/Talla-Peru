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


    elements = initial_setup(container);

    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;
    mesa = elements.mesa;
    console.log("hoka")

    console.log("bye")


}

function girar(container){
    console.log("girar");
    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;



    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render(scene, camera, renderer);
    })

}

function initial_setup (container){
    //Configuramos la camara y el renderer inicial
    var loaded;

    var width = window.innerWidth/2;
    var height = window.innerWidth/2;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setSize(1000,1000)
    container.appendChild(renderer.domElement);

    //Creamos la camara que va mostrar la escena
    var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.z = 200;
    camera.position.x = 30;
    camera.position.y = 20;
    //Creamos la escena que va mostar el objeto
    var scene = new THREE.Scene();

    scene.add(camera);


    /*Agregamos sth */
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);

    global = loader;

    manager.onProgress = function (item,loaded,total){

        console.log( item, loaded, total );

    }


    loader.load('./obj/mesa-split.obj', function (object) {
        //loaded = object;
        scene.add(object);
        console.log("cargue!");
        render(scene, camera, renderer);
    })


    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render(scene, camera, renderer);
    });

    return {
        scene : scene,
        mesa : loaded,
        camera : camera,
        renderer : renderer,
    }
}

function render (scene, camera, renderer) {
    //Render con los nuevos parametros de renderer
    renderer.render(scene, camera);
}
