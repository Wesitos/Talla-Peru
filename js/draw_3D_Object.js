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
    var maxx = 1.8,
        maxy = 2.5,
        maxz = 0.85;
    var minx = 0.8,
        miny = 1.6,
        minz = 0.6;

    $("#controlx").bind("change",function(){
        var value = $(this).val()/nomx;

        if(value > maxx/nomx){
            value = maxx/nomx
            $(this).val(maxx)
        }
        if(value < minx/nomx){
            value = minx/nomx
            $(this).val(minx)
        }

        object.scale.x = value;
        mesa = elements.mesa;
        render()
    })

    $("#controly").bind("change",function(){
        var value = $(this).val()/nomy;

        if(value > maxy/nomy){
            value = maxy/nomy;
            $(this).val(maxy)
        }
        else
        if(value < miny/nomy){
            value = miny/nomy;
            $(this).val(miny)
        }

        object.scale.z = value;

        mesa = elements.mesa;
        render()
    })

    $("#controlz").bind("change",function(){
        var value = $(this).val()/nomz;

        if(value > maxz/nomz){
            value = maxz/nomz
            $(this).val(maxz)
        }
        if(value < minz/nomz){
            value = minz/nomz
            $(this).val(minz)
        }

        object.scale.y = value;

        mesa = elements.mesa;
        render()
    })

}

function toogleObj(obj1, obj2){
    $("#transform").bind("click", function(){
        if (obj1.visible){
            showObject(obj1, false);
            showObject(obj2, true);
        }
        else{
            showObject(obj1, true);
            showObject(obj2, false);
        }
        render()
    })
}

function girar(container, object){
    // Event handler para girar la mesa

    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render();
    })}

function initial_setup (container){
    //Configuramos la camara y el renderer inicial
    var loaded;

    var width = 600;
    var height = 500;

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
    manager.onLoad = function (){
        showObject(elements.mesa_1, true);
        toogleObj(elements.mesa_1, elements.mesa_2);
        render()
    }

    // Cargamos la textura
    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader(manager);
    loader.load( './img/wood.jpg', function ( image ) {
        texture.image = image;
        texture.needsUpdate = true;
        render();
    } );

    // Cargamos el modelo
    var loader = new THREE.OBJLoader(manager);
    loader.load('./obj/mesa.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }});
        showObject(obj, false);
        elements.mesa_1 = obj;
        scene.add(obj);
        console.log("cargue!");        
        render();
        girar(container, obj);
        scale(container,obj);
    })

    loader.load('./obj/mesa_3.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }});
        showObject(obj, false);
        elements.mesa_2 = obj;
        scene.add(obj);
        console.log("cargue!");        
        render();
        girar(container, obj);
        scale(container,obj);
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

function showObject(obj, show){
    if (show){
        obj.visible = true;
        obj.traverse( function(child){
            if ( child instanceof THREE.Mesh ) {
                child.visible = true;
            }});
    }
    else{
        obj.visible = false;
        obj.traverse(function(child){
            if ( child instanceof THREE.Mesh ) {
                child.visible = false;
            }});
    }
}
