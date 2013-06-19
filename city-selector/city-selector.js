function citySelector(id) {
	// gen code

	// 开始时，选中 常用tab页
	$('#city-header-common').addClass("header-high-light");

	// 鼠标放上去，显示手形
	$('#city-selector li').hover(function() {
		$(this).addClass('mouseover');
	}, function() {
		$(this).removeClass('mouseover');
	});

	// 单击时显示，离开时隐藏
	$('#' + id).click(function() {
		$('#city-selector').show();
	});
	$("#city-selector").mouseleave(function() {
		$(this).hide();
	});

	// 单击切换 常用/省份/城市/县区
	$('#city-header li').click(function() {
		$(this).addClass("header-high-light").siblings().removeClass("header-high-light");
		$('#' + 'city-' + this.id.replace('city-header-', '')).show().siblings().hide();
	});

	// 选定某个省

}