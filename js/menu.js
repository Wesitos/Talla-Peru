function menu () {
	var menu_icon = $('.js-menu__icon')
	var menu__options = $('.menu__options')

	menu_icon.on('click', function () {
		menuContent.toggle("slow")
	})
}