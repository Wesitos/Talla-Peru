var elements;
var global;
var showed = false;

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

    var width = 600;
    var height = 500;

    $(".mueble").val(1);
    radio = document.getElementById("opt1");
    radio.checked = true;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer_canvas = document.getElementById(container);
    var renderer = new THREE.WebGLRenderer({canvas: container,
                                            alpha: true,
                                           });
    renderer.setSize(width,height)

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

    // Loading managers
    is_loaded(false);

    var loaded ={ mesa: false,
                  librero: false,
                  escritorio: false,
                  sofa: false,
                  texture: false,
                };

    var manager_texture = new THREE.LoadingManager(function onLoad(){
        elements.loaded.texture = true;
        render()
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_mesa = new THREE.LoadingManager(function onLoad(){
        elements.loaded.mesa = true;
        is_loaded("mesa");
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_librero = new THREE.LoadingManager(function onLoad(){
        elements.loaded.librero = true;
        is_loaded("librero");
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_escritorio = new THREE.LoadingManager(function onLoad(){
        elements.loaded.escritorio = true;
        is_loaded("escritorio");
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_sofa = new THREE.LoadingManager(function onLoad(){
        elements.loaded.sofa = true;
        is_loaded("sofa");
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    document.getElementById("controles").style.display = "";
    select_type();

    // Cargamos la textura
    var texture_1 = new THREE.Texture();
    var texture_2 = new THREE.Texture();
    var loader_texture = new THREE.ImageLoader(manager_texture);
    loader_texture.load( './img/wood.jpg', function ( image ) {
        texture_1.image = image;
        texture_1.needsUpdate = true;
    } );
    loader_texture.load( './img/tela.jpg', function ( image ) {
        texture_2.image = image;
        texture_2.needsUpdate = true;
    } )

    // Cargamos el modelo
    var loader_mesa = new THREE.OBJLoader(manager_mesa);
    var loader_librero = new THREE.OBJLoader(manager_librero);
    var loader_escritorio = new THREE.OBJLoader(manager_escritorio);
    var loader_sofa = new THREE.OBJLoader(manager_sofa);
    loader_mesa.load('./obj/mesa-comedor.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture_1;
            }});
        obj.name = "mesa_comedor";
        showObject(obj, true);
        showed = "mesa_comedor";
        elements.mesa_comedor = obj;
        scene.add(obj);
        girar(container, obj);
        scale(container,obj);
        render();
    });

    loader_mesa.load('./obj/mesa-centro.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture_1;
            }});
        obj.name = "mesa_centro";
        showObject(obj, false);
        elements.mesa_centro = obj;
        scene.add(obj);

        girar(container, obj);
        scale(container,obj);
    });

    loader_librero.load('./obj/static/cama-librero-reducido.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "cama_librero";
        showObject(obj, false);
        elements.cama_librero = obj;
        scene.add(obj);
        girar(container, obj);
    });

    loader_librero.load('./obj/static/cama-librero-cerrado.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "librero";
        showObject(obj, false);
        elements.librero = obj;
        scene.add(obj);
        girar(container, obj);
    });

    // Cama-escritorio
    loader_escritorio.load('./obj/static/cama-reducido.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "cama";
        showObject(obj, false);
        elements.cama = obj;
        scene.add(obj);
        girar(container, obj);
    })

    loader_escritorio.load('./obj/static/escritorio-reducido.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "escritorio";
        showObject(obj, false);
        elements.escritorio = obj;
        scene.add(obj);
        girar(container, obj);
    })
    
    // Sofa-camarote
    loader_sofa.load('./obj/static/camarote(sofa)-min.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "camarote";
        showObject(obj, false);
        elements.camarote = obj;
        scene.add(obj);
        girar(container, obj);
    })

    loader_sofa.load('./obj/static/sofa(camarote)-min.obj', function (obj) {
        obj.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                if(child.name == "colchon")
                {child.material.map = texture_2;}
                else
                {child.material.map = texture_1;}
            }});
        obj.name = "sofa";
        showObject(obj, false);
        elements.sofa = obj;
        scene.add(obj);
        girar(container, obj);
    })

    return {
        loaded: loaded,
        scene: scene,
        camera: camera,
        renderer: renderer,
    }
}

function render () {
    //Render con los nuevos parametros de renderer
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
}

function select_type (){

    var val1 = 'a';
    var val2 = 'a';
    $( ".mueble" ).change(function() {
        k = this.value;
        var dim_controls = document.getElementById("dim_div");
        dim_controls.style.display = "none";
        switch (k){
        case "1":
            val1 = 'Mesa Comedor';
            val2 = 'Mesa Centro';
            dim_controls.style.display = "";
            break;
        case "2":
            val1 = 'Librero';
            val2 = 'Cama';
            break;
        case "3":
            val1 = 'Escritorio';
            val2 = 'Cama';
            break;
        case "4":
            val1 = 'Sofa';
            val2 = 'Camarote';
            break;
        }
        show_object_by_id(k,1);
        radio = document.getElementById("opt1");
        radio.checked = true;
        $('label[for=opt1]').html(val1);
        $('label[for=opt2]').html(val2);
    });

    $("input[name=tipo]").click(function(){
        val = this.id;
        val = val[3]; // Modo 1 o 2 del mueble
        grupo = $(".mueble").val();
        show_object_by_id(grupo,val);
    })


}

function show_object_by_id(grupo,tipo){
    grupo = parseInt(grupo)-1;
    tipo = parseInt(tipo)-1;
    id_object = [
        ["mesa_comedor", "mesa_centro"],
        ["librero", "cama_librero"],
        ["escritorio", "cama"],
        ["sofa", "camarote"],
    ]
    h = tipo*(-1)+1;
    obj_show = id_object[grupo][tipo];
    //obj_hide = id_object[grupo][h];

    //obj_show es el objeto que debe ser mostrado
    if (showed)
    {showObject(elements[showed],false);}
    showObject(elements[obj_show],true);
    showed = obj_show;

    render();


}

function menu_calback(){}

function is_loaded(name){
    canvas_obj = document.getElementById("canvas");
    loading_obj = document.getElementById("loading");
    //    if ()

    // if(x){
    //     $("canvas").show();
    //     $("#loading").hide();
    // }else{
    //     $("canvas").hide();
    //     $("#loading").show();
    // }
}
