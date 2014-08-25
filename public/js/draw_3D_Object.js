var elements;
var global;

var patader = new THREE.Object3D();

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
    
    var nomx = 1,
        nomy = 2,
        nomz = 0.75;
    var maxx = 2.5,
        maxy = 2.2,
        maxz = 0.8;
    var minx = 1.7,
        miny = 0.8,
        minz = 0.6;

    $("#controlx").bind("change",function(){
        var value = $(this).val()/nomx;
        object.scale.x = value;
        console.log("x "+ value)
        mesa = elements.mesa;
        render()
    })

    $("#controly").bind("change",function(){
        var value = $(this).val()/nomy;
        console.log("y "+ value)
        if(value < maxx){
            //$(this).val(maxx)               
            console.log("error")
            //$("#controlx").val(maxx)
        }

        object.scale.z = value;
        mesa = elements.mesa;
        render()
    })

    $("#controlz").bind("change",function(){
        var value = $(this).val()/nomx;
        object.scale.y = value;
        console.log("z "+ value)
        mesa = elements.mesa;
        render()
    })
}

function girar(container, object){
    // Event handler para girar la mesa
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

    var width = 500;
    var height = 400;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(width,height)
    container.appendChild(renderer.domElement);

    //Creamos la camara que va mostrar la escena
    var camera = new THREE.PerspectiveCamera(30, width/height, 0.2, 1000);
    camera.position.z = 200;        
    //Creamos la escena que va mostar el objeto
    var scene = new THREE.Scene();
    scene.add(camera);

    // Agregamos iluminacion directa
    var directionalLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    /*Agregamos sth */
    var manager = new THREE.LoadingManager();
    global = loader;
    manager.onProgress = function (item, loaded, total){
        console.log(item, loaded, total);
    }

    // Cargamos la textura
    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader(manager);
    loader.load( './img/wood.jpg', function ( image ) {
        texture.image = image;
        texture.needsUpdate = true;
    } );

    // Cargamos el modelo
    var loader = new THREE.OBJLoader(manager);
    loader.load('./obj/mesa.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }});
        elements.mesa = obj;
        scene.add(obj);
        console.log("cargue!");        
        render();
        girar(container, obj);
        scale(container,obj);
//        agrupar();
    })


    return {
        scene : scene,
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

function agrupa_objetos(obj, json_url){
    var lista_groups = [];
    var json_obj = JSON.parse($.ajax({
        type: 'GET',
        url: json_url,
        dataType: 'json',
        async: false
    }).responseText);

    var groups = json_obj.groups
    for (var i=0; i < groups.length; i++){
        group = groups[i];
        grp = new THREE.Object3D();
        grp.name = group.parent;
        for (var j=0; j < group.length; i++){
            obj.traverse(function(child){
                if (child instanceof THREE.Mesh){
                    if (group.children.indexOf(child.name)!= -1){
                        grp.add(child);
                    }
                }
            });
        }
        lista_groups.concat(grp)
    }
    return lista_groups
}


function agrupar(){
    var mesas = elements.mesa;
    var partes = mesas.children; 
    lista = ["pata-derecha-frente-top",
              "pata-derecha-frente-mid",
              "pata-derecha-frente-bottom",
              "pata-derecha-atras-top",
              "pata-derecha-atras-mid",
              "pata-derecha-atras-bottom",
              "vara-inferior-derecha",
              "vara-superior-derecha"]    
    
    console.log(partes.length);
    for (i=0;i<partes.length;i++){
        nom = partes[i]['name'];
        if (lista.indexOf(nom) != -1 ){
            patader.add(partes[i])
        }
    }
/*    $.each(partes,function(i,x){
        nom = x.name
        
        if (lista.indexOf(nom) != -1 ){
            console.log(nom)
            patader.add(x)            
        } 
    })*/
}
