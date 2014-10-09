var elements;
var global;
var showed = null ;

var modelo = [
    {
        nombre: "Cama",
        id: "cama",
        loaded: false,
        showed: false,
        path: "/obj/librero/librero(cama).obj"
    },

    {
        nombre: "Librero",
        id: "librero",
        loaded: false,
        showed: false,
        path: "/obj/librero/librero(cerrado).obj"
    },

    {
        nombre: "Mesa",
        id: "mesa",
        loaded: false,
        showed: false,
        path: "/obj/librero/librero(mesa).obj"
    },
    {
        nombre: "Escritorio Repisa",
        id: "escritorio2",
        loaded: false,
        showed: false,
        path: false
    }    
];


function draw_3D_Object (container) {
    elements = initial_setup(container);    
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
            value = maxx/nomx;
            $(this).val(maxx);
        }
        if(value < minx/nomx){
            value = minx/nomx;
            $(this).val(minx);
        }

        object.scale.x = value;
        mesa = elements.mesa;
        render();
    });

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
        render();
    });

    $("#controlz").bind("change",function(){
        var value = $(this).val()/nomz;

        if(value > maxz/nomz){
            value = maxz/nomz;
            $(this).val(maxz);
        }
        if(value < minz/nomz){
            value = minz/nomz;
            $(this).val(minz);
        }

        object.scale.y = value;

        mesa = elements.mesa;
        render();
    });

}


function girar(container, object){
    //Event handler para girar la mesa

    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render();
    })};

function initial_setup (container){

    var width = 600;
    var height = 500;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer_canvas = document.getElementById(container);
    var renderer = new THREE.WebGLRenderer({canvas: container,
                                            alpha: true
                                            //antialias: true,
                                           });
    renderer.setSize(width,height);

    // Creamos la camara que va mostrar la escena
    var camera = new THREE.PerspectiveCamera(30, width/height, 0.2, 1000);
    camera.position.z = 200;
    // Creamos la escena que va mostar el objeto
    var scene = new THREE.Scene();
    scene.add(camera);

    // Agregamos iluminacion directa
    var directionalLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Loading managers
    var loaded ={ mesa: false,
                  librero: false,
                  escritorio: false,
                  sofa: false,
                  texture: false
                };

    var manager_texture = new THREE.LoadingManager(function onLoad(){
        elements.loaded.texture = true;
        render();
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_object = new THREE.LoadingManager(function onLoad(){
        elements.loaded = true;
        var firstid  = document.getElementsByName("estado")[0]["value"];
        showed = firstid;
        showObject(elements[firstid],true);
        
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });
  
    //--------------------------------
    // Cargamos la textura
    var texture_1 = new THREE.Texture();
    texture_1.wrapS = THREE.RepeatWrapping;
    texture_1.wrapT = THREE.RepeatWrapping;
    texture_1.repeat.set(1,1);

    var texture_2 = new THREE.Texture();
    texture_2.wrapS = texture_2.wrapT = THREE.RepeatWrapping;
    texture_2.repeat.set(8,4);

    // Material para el colchon
    var colchon_material = new THREE.MeshLambertMaterial( {
        color: 0xf2f2f2,
        emissive: 0x333333,
        map: texture_2
    } );

    var loader_texture = new THREE.ImageLoader(manager_texture);
    loader_texture.load( './img/wood.jpg', function ( image ) {
        texture_1.image = image;
        texture_1.needsUpdate = true;
    } );
    loader_texture.load( './img/tela.jpg', function ( image ) {
        texture_2.image = image;
        texture_2.needsUpdate = true;
    } );

    // Cargamos el modelo
    var loader_object = new THREE.OBJLoader(manager_object);  

    modelo.forEach (load_model);
    var id = "cama";

    function load_model (value, index, arr){
        if(value.path){
            loader_object.load(value.path, function (obj) {
                obj.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.material.map = texture_1;
                    }});
                obj.name = value.nombre;
                obj.showed = value.showed;
                showObject(obj, false);            
                console.log("+++++" + value.id);
                elements[value.id] = obj;
                scene.add(obj);
                girar(container, obj);
                scale(container,obj);
            });        
        }

    } 
  
    return {
        loaded: loaded,
        scene: scene,
        camera: camera,
        renderer: renderer
    };
}

function render () {
    // Render con los nuevos parametros de renderer
    renderer = elements.renderer;
    camera = elements.camera;
    scene = elements.scene;
    renderer.render(scene, camera);
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
    render();    
}


$("input[type=radio]").click(function(){
    myval = this;
    id = myval.value;
    if(showed)
        showObject(elements[showed],false);    
    showObject(elements[id],true);     
    showed = id;  
});



document.getElementsByName("estado")[0].checked = true





