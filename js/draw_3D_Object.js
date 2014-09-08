var elements;
var global;
var showed = false;

function draw_3D_Object (container) {
    elements = initial_setup(container);
    select_type();
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
    //Event handler para girar la mesa

    $(container).bind('move', function (e) {
        object.rotation.y += e.deltaX * 0.005;
        object.rotation.x += e.deltaY * 0.005;
        render();
    })}

function initial_setup (container){

    var width = 600;
    var height = 500;

    // Creamos el objeto a "renderear" y lo agregamos al DOM
    var renderer_canvas = document.getElementById(container);
    var renderer = new THREE.WebGLRenderer({canvas: container,
                                            alpha: true,
                                           });
    renderer.setSize(width,height)

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
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_librero = new THREE.LoadingManager(function onLoad(){
        elements.loaded.librero = true;
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_escritorio = new THREE.LoadingManager(function onLoad(){
        elements.loaded.escritorio = true;
    }, function onProgress (item, loaded, total){
        console.log(item, loaded, total);
    });

    var manager_sofa = new THREE.LoadingManager(function onLoad(){
        elements.loaded.sofa = true;
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
        map: texture_2,
    } );

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
                {child.material = colchon_material;}
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
                {child.material = colchon_material;}
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
                {child.material = colchon_material;}
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
                {child.material = colchon_material;}
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
                {child.material = colchon_material;}
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
                {child.material = colchon_material;}
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
}

function select_type (){
    $("#menu_muebles").val(1);
    radio = document.getElementById("opt1");
    radio.checked = true;

    $( "#menu_muebles" ).change(menu_callback);
    menu_callback();
    $("input[name=tipo]").click(function(){
        val = this.id;
        val = val[3]; // Modo 1 o 2 del mueble
        grupo = $("#menu_muebles").val();
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
    obj_hide = id_object[grupo][h];

    // obj_show es el objeto que debe ser mostrado
    if (showed)
    {showObject(elements[showed],false);}
    showObject(elements[obj_show],true);
    showed = obj_show;

    render();


}

function menu_callback(){
    clearTimeout(elements.timer);
    var canvas_obj = document.getElementById("renderer_canvas");
    var loading_obj = document.getElementById("loading");
    var dim_div = document.getElementById("dim_div");
    var menu_val = document.getElementById("menu_muebles").value;
    var controles = document.getElementById("controles");

    var name;
    var val1;
    var val2;
    var show_dim_controls;

    switch (menu_val){
    case "1":
        name = "mesa";
        val1 = 'Mesa Comedor';
        val2 = 'Mesa Centro';
        show_dim_controls = true;
        break;
    case "2":
        name = "librero";
        val1 = 'Librero';
        val2 = 'Cama';
        show_dim_controls = false;
        break;
    case "3":
        name = "escritorio";
        val1 = 'Escritorio';
        val2 = 'Cama';
        show_dim_controls = false;
        break;
    case "4":
        name = "sofa";
        val1 = 'Sofa';
        val2 = 'Camarote';
        show_dim_controls = false;
        break;
    }
    // Verificamos si los objetos estan cargados
    var loadingScreenTimeout = function loadingScreenTimeout(){
        if (elements.loaded[name] && elements.loaded.texture){
            // Oculta el loading Screen
            loading_obj.style.display = "none";
            canvas_obj.style.display = "";

            //Muestra los controles
            controles.style.display = "";
            if (show_dim_controls)
            {dim_div.style.display = "";}
            else
            {dim_div.style.display = "none";}

            //Muestra el modelo
            show_object_by_id(menu_val,1);

            //Cambia los radio button
            radio = document.getElementById("opt1").checked = true;
            $('label[for=opt1]').html(val1);
            $('label[for=opt2]').html(val2);
        }
        else{
            loading_obj.style.display = "";
            canvas_obj.style.display = "none";
            controles.style.display = "none";
            dim_div.style.display = "none";
            elements.timer = setTimeout(loadingScreenTimeout, 200);
        }
    }

    loadingScreenTimeout();

}
