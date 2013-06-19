/*选择城市*/
selectStartPlace();

/*选择城市*/
function selectStartPlace(){
	$("html").click(function(e){
		if(!$("#provinces").is(':hidden')){
			$("#provinces").hide();
		}
	});
	$("#provinces").click(function(e){
		return false;
	});
	$("#provinces .tab-list").delegate("#provinces li.tab","click",function(){
		var n = $(this).attr("index");
		$("#provinces .tab-box").hide();
		$("#provinces .tab-box:eq("+n+")").show();
		$("#provinces .tab").removeClass("select");
		$("#provinces .select-tab").animate({left:n*70-1+"px"},200,function(){$("#provinces .tab:eq("+n+")").addClass("select");});
		return false;
	});

	$("#provinces .place-list").delegate("#provinces li","click",function(){
		var n = $(this).attr("index");
		$("#provinces .province-box2").animate({left:-280*n+10+"px"});
		return false;
	});

	$("#provinces.location-box").delegate("#provinces a.province","click",function(){        //点击 省份 下的各省份 发生的事件
		$("#provinces a.select").removeClass("select");
		$(this).addClass("select");
		var provinceId = $(this).attr("code");
		if(provinceId=="11"||provinceId=="12"||provinceId=="31"||provinceId=="50"){         //点击 四个直辖市的情况
			var startPlaceInput = $("#cityName_input");
			var startPlace = $("#cityId_input");
			startPlaceInput.val($(this).html()+"-"+$(this).html()+"市");
			startPlaceInput.css("color", "#333333");
			//startPlace.val(provinceId+"0000");
			startPlace.val("");

			$.ajax({
				type:"POST",
				contentType:"application/x-www-form-urlencoded;charset=utf-8",
			    //url:"/order/unlogin/price.do?action=getCounty",
                url:"/network/www/searchapi.do?method=getcounty",
			    data:"city=" + $(this).attr("code"),
				success:function(responseText){
					$("#provinces .tab-box:eq(3)").html('');
					var res = $.parseJSON(responseText);
					if(res.length>0){
						for(var i=0;i<res.length;i++){
							$("#provinces .tab-box:eq(3)").append("<a class='place county' href='#' code='"+res[i].number+"'>"+res[i].name+"</a>");
						}
						$("#provinces .li-county").click();
					}else{
						$("#provinces").hide();
					}
				}
			});
			return false;
		}

		$("#provinces .li-city").click();
		$("#cityName_input").css("color", "#333333");
		$("#cityName_input").val($(this).html());
		$("#cityId_input").val("");
		var cityJson = area.city;
		$("#provinces .tab-box:eq(2)").html('');
		$("#provinces .tab-box:eq(3)").html('');
		for(var i=0;i<cityJson.length;i++){
			if(cityJson[i].code.substring(0,2) == provinceId){
				$("#provinces .tab-box:eq(2)").append("<a class='place city' href='#' code='"+cityJson[i].code+"'>"+cityJson[i].name+"</a>");
			}
		}
		return false;
	});

	$("#provinces.location-box").delegate("#provinces a.city","click",function(){     //点击 常用 下省市 事件
		$("#provinces a.select").removeClass("select");
		$(this).addClass("select");
		var startPlaceInput = $("#cityName_input");
		var startPlace = $("#cityId_input");
		var provinceJson = area.province;
		for(var i=0;i<provinceJson.length;i++){
			if(provinceJson[i].code.substring(0,2) == $(this).attr("code").substring(0,2)){
				startPlaceInput.val(provinceJson[i].name+"-"+$(this).html());
				break;
			}
		}
		startPlaceInput.css("color", "#333333");
		startPlace.val($(this).attr("code"));
		//startPlace.val("");
/*
		$.ajax({
			type:"POST",
			//contentType:"application/x-www-form-urlencoded;charset=utf-8",
		    //url:"/order/unlogin/price.do?action=getCounty",
            url:"country.js",
		    data:"city=" + $(this).attr("code"),
			success:callback
		});

		return false;
*/
var  responseText = '[{"name":"镜湖区","number":"340202"},{"name":"南陵县","number":"340223"},{"name":"三山区","number":"340208"},{"name":"无为县","number":"340225"},{"name":"繁昌县","number":"340222"},{"name":"弋江区","number":"340203"},{"name":"芜湖县","number":"340221"},{"name":"鸠江区","number":"340207"}]';
callback(responseText);

		function callback(responseText){
				$("#provinces .tab-box:eq(3)").html('');   //先清空县区
				var res = $.parseJSON(responseText);
				if(res.length>0){
					for(var i=0;i<res.length;i++){
						$("#provinces .tab-box:eq(3)").append("<a class='place county' href='#' code='"+res[i].number+"'>"+res[i].name+"</a>");
					}
					$("#provinces .li-county").click();
				}else{
					$("#provinces").hide();
				}
			}
	});

	$("#provinces.location-box").delegate("#provinces a.county","click",function(){
		$("#provinces a.select").removeClass("select");
		$(this).addClass("select");
		var startPlaceInput = $("#cityName_input");
		var startPlace = $("#cityId_input");
		var provinceJson = area.province;
		var startPlaceName="";
		for(var i=0;i<provinceJson.length;i++){
			if(provinceJson[i].code.substring(0,2) == $(this).attr("code").substring(0,2)){
				startPlaceName=provinceJson[i].name;
				break;
			}
		}
		var cityJson = area.city;
		for(var i=0;i<cityJson.length;i++){
			var provinceId=$(this).attr("code").substring(0,2);
			if(provinceId=="11"||provinceId=="12"||provinceId=="31"||provinceId=="50"){      //如果是四个直辖市
				if(cityJson[i].code.substring(0,2) == $(this).attr("code").substring(0,2)){
					startPlaceInput.val(startPlaceName+"-"+$(this).html()+"-"+$(this).html());          /*startPlaceName+"-"+cityJson[i].name+"-"+$(this).html()*/
					break;
				}
			}else{
				if(cityJson[i].code.substring(0,4) == $(this).attr("code").substring(0,4)){
					startPlaceInput.val(startPlaceName+"-"+cityJson[i].name+"-"+$(this).html());
					break;
				}
			}
		}
		startPlaceInput.css("color", "#333333");
		startPlace.val($(this).attr("code"));
		$("#provinces").hide();

		return false;
	});

	$("#cityId_inputSelect").click(function(e){
		e.stopPropagation();
		if($("#provinces").css("display")!="none"){
		$("#provinces").hide();
		}else{
		$("#provinces").show();
		}
	});
}

