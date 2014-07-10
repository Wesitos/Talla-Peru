function modal () {

	var btnPersonalize = $('.btn-personalize')
	var modal = $('#modal')
	var close = $('#btn-close')
	var edit = $('#edit')
	var pieceFurniture3D = $('#piece-furniture-3D')
	var dimensionsContent = $('#dimensions-content')

	/*btnPersonalize.on('click', function () {
		modal.modal()
	})*/


	
	btnPersonalize.on('click', function () {
		//modal.css('display', 'block')
		modal.toggle("slow")
	})
	
	close.on('click', function () {
		//modal.css('display', 'none')
		modal.toggle("slow")
	})

	edit.on('click', function () {
		pieceFurniture3D.toggle('slow')
		dimensionsContent.toggle('slow')

		if(edit.html() == 'editar')
			edit.html('terminar')
		else
			edit.html('editar')
	})
}