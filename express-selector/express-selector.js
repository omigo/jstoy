function expressSelector(id) {
	var names = {
		// 常用
		common : [ "中铁快运", "EMS快递", "申通快递", "顺丰速递", "圆通快递", "宅急送", "天天快递" ],
		// 所有
		all : [ "中铁快运", "EMS快递", "申通快递", "顺丰速递", "圆通快递", "宅急送", "天天快递", "中通", "ＥＭＳ", "中城", "韵达", "其他", "中国邮政平邮", "亚风", "长宇", "大田", "长发", "东方汇", "首业", "远长", "发网", "飞远配送", "全峰快递", "四川快捷", "全一快递",
				"广东EMS", "杭州爱彼西", "联邦快递", "顺丰速运", "龙邦速递", "快捷速递", "黑猫宅急便", "港中能达", "优速物流", "联昊通", "城市100", "EMS", "圆通速递", "中通速递", "韵达快运", "百世物流", "德邦物流", "华强物流", "汇通快运", "申通E物流", "邮政国内小包", "新邦物流",
				"全日通快递", "国通快递", "E速宝" ]
	};

	// 产生一个id，如果页面有多个地方要选择快递公司，每个id都不一样
	var selectorId = 'express-selector-' + id;

	generateHTML(); // 生成HTML

	// 单击显示
	$('#' + id).addClass("express-selector-input").click(function() {
		$('#' + selectorId).show()
	});

	// 单击外面，隐藏
	$(document).click(function(evt) {
		target = evt.target
		while (target.nodeName.toLowerCase() != "html") {
			if ($(target).hasClass('express-selector') || $(target).hasClass('express-selector-input')) {
				return;
			}
			target = target.parentNode;
		}
		$('#' + selectorId).hide();
	});

	// 鼠标放上去时改变样式
	$('#' + selectorId + ' table td, ' + '#' + selectorId + ' table th.last').hover(function() {
		$(this).addClass("express-hover")
	}, function() {
		$(this).removeClass("express-hover")
	});

	// 更多 和 常用 切换
	$('#' + selectorId + ' table th.last').click(function() {
		$(this).parent().parent().parent().hide().siblings().show();
	});

	// 选择了某个快递时
	$('#' + selectorId + ' table td').click(function() {
		$('#' + id).val($(this).text());
		$('#' + selectorId + '.express-selector').hide();
	});

	function generateHTML() {
		var html = '<div id="' + selectorId + '" class="express-selector" style="display:none"><div style="clear:both"></div><table class="express-common" ><tr>';
		var colNum = 3;
		for ( var i = 0; i < names.common.length; i++) {
			if (i > 0 && i % colNum == 0) {
				html += "</tr><tr>";
			}
			html += "<td>" + names.common[i] + "</td>";
		}
		var reminder = colNum - names.common.length % colNum - 1;
		for ( var i = 0; i < reminder; i++) {
			html += '<th></th>'
		}
		html += '<th class="last">更多&gt;&gt;</th>';
		html += '</tr></table><table class="express-all" style="display:none"><tr>';
		colNum = 4;
		for ( var i = 0; i < names.all.length; i++) {
			if (i > 0 && i % colNum == 0) {
				html += "</tr><tr>";
			}
			html += "<td>" + names.all[i] + "</td>";
		}
		var reminder = colNum - names.all.length % colNum - 1;
		for ( var i = 0; i < reminder; i++) {
			html += '<th></th>'
		}
		html += '<th class="last">&lt;&lt;常用</th>';
		html += '</tr></table></div>';
		$(html).insertAfter('#' + id);
	}
}

