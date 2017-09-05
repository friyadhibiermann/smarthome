//post data
function GetPost(METHOD,ADDR,QUERY,OPT) {
    var xmlhttp = false, myObj, x;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open(METHOD,"http://"+ADDR+"/"+QUERY);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
			var count = 0 ;
            myObj = JSON.parse(this.responseText);
			if (OPT == "CCTV"){
				for (x in myObj.cctv){
					var prt = myObj.cctv[x].port
					var cctvJum = myObj.jumlah_cctv;
					cctv(cctvJum,prt);
				}
				return false;
			}
			if (OPT == "LOGIN"){
				for (x in myObj.login) {
					var userid = myObj.login[x].user;
					var passwd = myObj.login[x].pass;
					var st = myObj.login[x].stat;
					auth(userid,passwd,st);
				}
				return false;
			}
			if (OPT == "SAKLAR"){
				var sak = document.getElementById("switch");
				var time = document.getElementById("settime");
				var name = document.getElementById("setname");
				var timeset = document.getElementById("setintm");
				sak.innerHTML = "";
				time.innerHTML = "";
				name.innerHTML ="";
				timeset.innerHTML ="";
                for (x in myObj.result) {
                    count = count++;
					gp = myObj.result[x].gpio;
                    nma = myObj.result[x].nma;
                    stat = myObj.result[x].stus;
                    TM = myObj.result[x].time;
					tmr = myObj.result[x].timer ;
                    var res = TM.split("-");
                    var start = res[0];
                    var end = res[1];
                    gp = myObj.result[x].gpio;
                    nma = myObj.result[x].nma;
                    stat = myObj.result[x].stus;
                    saklar(count, gp, nma, start, end, stat, tmr);
                }
			}
			if (OPT == "AUDIO"){
				function player(param){
					var ip = storage.getItem("ipaddress");
					var msc="",vdo="",ID,file="";
					for (x in myObj.audio) {
						ID= myObj.audio[x].id;
						file=myObj.audio[x];
						msc += "<li id='"+ID+"' class='list-item__title stop'><a href='http://"+ip+"/mp3/"+file+"'>"+file+"</a></li>";
					}
					document.getElementById("list").innerHTML = msc;
					init("audio");
					function init(opt){
						   current = 0;
						   audio = $(opt);
						   playlist = $(".playlist");
						   tracks = playlist.find("li a");
						   len = tracks.length - 1;
						   audio[0].volume = .30;
						   audio[0].play();
						   playlist.find("a").click(function(e){
							   e.preventDefault();
							   link = $(this);
							   current = link.parent().index();
							   run(link, audio[0]);
						   });
						   audio[0].addEventListener("ended",function(e){
							   current++;
							   if(current == len){
								   current = 0;
								   link = playlist.find("a")[0];
							   }else{
								   link = playlist.find("a")[current];    
							   }
							   run($(link),audio[0]);
						   });
					}
					function run(link, player){
						   player.src = link.attr("href");
						   par = link.parent();
						   par.addClass("play").siblings().removeClass("stop");
						   audio[0].load();
						   audio[0].play();
					}
				}
				player();
			}
			if (OPT == "VIDEO") {
				function videoplayer(){
					var ip = storage.getItem("ipaddress");
					var vdo="",ID,file="";
					var video;
					var playlist;
					var tracks;
					var current;
					for (x in myObj.video) {
						ID= myObj.video[x].id;
						file=myObj.video[x];
						st=myObj.stat;
						vdo += "<li id='"+ID+"' class='list-item__title stop'><a href='http://"+ip+"/video/"+file+"'>"+file+"</a></li>";
					}
					document.getElementById("videolist").innerHTML = vdo;
					initv();
					function initv(){
					   current = 0;
					   video = $("video");
					   playlist = $(".playlistv");
					   tracks = playlist.find("li a .videolist");
					   len = tracks.length - 1;
					   video[0].volume = .50;
					   video[0].play();
					   playlist.find("a").click(function(e){
						   e.preventDefault();
						   link = $(this);
						   current = link.parent().index();
						   run2(link, video[0]);
					   });
					   video[0].addEventListener("ended",function(e){
						   current++;
						   if(current == len){
							   current = 0;
							   link = playlist.find("a")[0];
						   }else{
							   link = playlist.find("a")[current];    
						   }
						   run2($(link),video[0]);
					   });
					}
					function run2(link, player){
						   player.src = link.attr("href");
						   par = link.parent();
						   par.addClass("play").siblings().removeClass("stop");
						   video[0].load();
						   video[0].play();
					}
				}
				videoplayer();
			}
        }
    };
    xmlhttp.send();
}
var storage = window.localStorage;
//identifikasi akun
function AccountLocal(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var addr = document.getElementById("address").value;
	var name = document.getElementById("servernanme").value;
	if ( user != null || pass != null || addr != null || name != null ){
		storage.setItem("username", user);
		storage.setItem("password", pass);
		storage.setItem("ipaddress", addr);
		storage.setItem("namaserver", name);
	}
	ons.notification.toast({message: "server "+name+" telah di simpan silahkan login", timeout: 2000})
	return false;
}
// login
function auth(userid,passwd,st){
	var ip = storage.getItem("ipaddress");
	var user = storage.getItem("username");
	var pass = storage.getItem("password");
	if ( userid == user && passwd == pass ){
		GetPost("GET",ip,"cgi-bin/smarthome?show=smarthome","CCTV");
		GetPost("GET",ip,"cgi-bin/smarthome?show=smarthome","SAKLAR");
		GetPost("GET",ip,"cgi-bin/smarthome?show=smarthome","AUDIO");
		GetPost("GET",ip,"cgi-bin/smarthome?show=smarthome","VIDEO");
		setlistserver();
	} else {
		ons.notification.alert('maaf , login gagal')
	}
}
function login(){	
	var ip = storage.getItem("ipaddress");
	var addr = document.getElementById("address").value;
	if ( ip != null || addr != null ) {
		GetPost("POST",ip,"cgi-bin/smarthome?login=valid","LOGIN");
		ons.notification.toast({message: "login submited", timeout: 3000})
		closemodel();
	}
}
// saklar 
function saklar(param, gpio, nama, tm1, tm2, stats, timet){
	// get id
	var sak = document.getElementById("switch");
	var time = document.getElementById("settime");
	var name = document.getElementById("setname");
	var timeset = document.getElementById("setintm");
	// var
    var pge ="",i;
	var sett="";
	var pgeset ="";
	var pgetme="";
	// ii
    for (i = 0; i <= param; i++) {
        pge += "<ons-list-item><div id="+gpio+" class=\"left\">" + nama +"</div>";
		if (stats == '0'){
			pge += "<div class=\"center\"><i id=\"ico"+gpio+"\" class=\"fa fa-lightbulb-o fa-2x\" aria-hidden=\"true\"></i></div><div class=\"right\"><ons-switch var='mySwitch' onchange='postData("+gpio+")' id=\"saklar" + gpio + "\"></ons-switch></div>";
		} else {
			pge += "<div class=\"center\"><i id=\"ico"+gpio+"\" class=\"fa fa-lightbulb-o on fa-2x\" aria-hidden=\"true\"></i></div></ons-icon><div class=\"right\"><ons-switch var='mySwitch' onchange='postData("+gpio+")' id=\"saklar" + gpio + "\" checked></ons-switch></div>";
		}
        pge += "</ons-list-item>";
		sett += "	<ons-list-item><div id=\"tm"+gpio+"\" class=\"left\">" + nama +"</div>";
		sett += "	<div class='form-group'>";
		sett += "		<div class='center input-group input-append date'>";
        sett += "        	<input type='text' onchange=\"fromTemplate(" + gpio + ")\" onclick=\"ons.notification.toast({message: 'Start Time " + nama + "', timeout: 2000})\"\" id='time-start" + gpio + "' value='"+tm1+"' class='form-control' />";
        sett += "        		<span class=\"input-group-addon\">";
        sett += "            	<span class=\"glyphicon glyphicon-time\"></span>";
        sett += "        		</span>";
        sett += "      		<input type='text' onchange=\"fromTemplate(" + gpio + ")\" onclick=\"ons.notification.toast({message: 'End Time " + nama + "', timeout: 2000})\"  id='time-end" + gpio + "' value='" + tm2 + "' class='form-control' />";
        sett += "        		<span class=\"input-group-addon\">";
        sett += "             	<span class=\"glyphicon glyphicon-time\"></span>"; 
        sett += "        		</span>";
        sett += "    	</div>";
		sett += "	</div>";
		
		pgeset+="<ons-list-item modifier=\"longdivider\">";
		pgeset+="	<div class=\"left\">";
		pgeset+="		<ons-icon icon=\"md-face\" class=\"list-item__icon\"></ons-icon>";
		pgeset+="	</div>";
		pgeset+="	<div class=\"right\">";
		pgeset+="		<ons-button class=\"small\" onclick=\"changename("+gpio+");\">submit</ons-button>";
		pgeset+="	</div>";
		pgeset+="	<div class=\"center\">";
		pgeset+="		<ons-input id=\"name"+gpio+"\" modifier=\"underbar\" value=\""+nama+"\" placeholder=\"nama saklar\" float></ons-input>";
		pgeset+="	</div>";
		pgeset+="</ons-list-item>";
		
		pgetme+="<ons-list-item modifier=\"longdivider\">";
		pgetme+="	<div class=\"left\">";
		pgetme+="		<ons-icon icon=\"ion-clock\" class=\"list-item__icon\"></ons-icon>";
		pgetme+="	</div>";
		pgetme+="	<div id=\"nametm"+gpio+"\" class=\"center\">";
		pgetme+="Timer "+nama+"";
		pgetme+="	</div>";
		pgetme+="	<div class=\"right\">";
		if (timet = '1'){
			pgetme+="		<ons-switch id=\"swtm"+gpio+"\"  onchange=\"statTime("+gpio+")\" checked></ons-switch>";
		} else{
			pgetme+="		<ons-switch id=\"swtm"+gpio+"\"  onchange=\"statTime("+gpio+")\"></ons-switch>";
		}
    }
		pgetme+="	</div>";
		pgetme+="</ons-list-item>";
    sak.innerHTML = sak.innerHTML + pge;
	time.innerHTML = time.innerHTML + pgetme;
	name.innerHTML = name.innerHTML + pgeset;
	timeset.innerHTML = timeset.innerHTML + sett;
}
// switch on off
function setlistserver(){
	// get local storage
	var srv = document.getElementById("srvlist");
	var user = storage.getItem("username");
	var pass = storage.getItem("password");
	var addr = storage.getItem("ipaddress");
	var srvnme = storage.getItem("namaserver");
	var srvpge="";
		srvpge+="<ons-list-item>";
		srvpge+="	<div class=\"left\">";
		srvpge+="		<ons-icon size=\"40px\" icon='ion-android-desktop'></ons-icon>";
		srvpge+="	</div>";
		srvpge+="	<div class=\"center\">";
		srvpge+="		<span class=\"list-item__title\">"+srvnme+"</span><span class=\"list-item__subtitle\">"+addr+"</span>";
		srvpge+="	</div>";
		srvpge+="	<div class=\"right\">";
		srvpge+="<ons-button class=\"small\" onclick=\"login();\">submit</ons-button>";
		srvpge+="	</div>";
		srvpge+="</ons-list-item>";
	srv.innerHTML = srvpge;
}
function postData(param){
	var ip = storage.getItem("ipaddress");
	var name = document.getElementById(param).innerHTML;
	var element = document.getElementById("ico"+param);
	if (document.getElementById("saklar"+param).checked == false){
		GetPost("POST",ip,"cgi-bin/smarthome?gpio="+param+"&status=off","SAKLAR");
		ons.notification.toast({message: "status "+name+" mati", timeout: 1000});
		element.style.color = 'white';
	} else{
		GetPost("POST",ip,"cgi-bin/smarthome?gpio="+param+"&status=on","SAKLAR");
		ons.notification.toast({message: "status "+name+" nyala", timeout: 1000});
		element.style.color = 'black';
	}
}
// cctv
function ShowCctv(){
	var ip = storage.getItem("ipaddress");
	GetPost("GET",ip,"cgi-bin/smarthome?show=smarthome","CCTV")
}
// show cctv
function cctv(jcctv,port){
	var ip = storage.getItem("ipaddress");
	var cctvPage = document.getElementById("cctv");
	var cctv="";
	cctv +="<div class=\"slideshow-container\">";
	for (i = 0; i < jcctv; i++) {
		var count = i + 1;
		cctv +="	<div class=\"numbertext\">1/1</div>";
		cctv +="	<img src=\"http://"+ip+":"+port+"/?action=stream\" style=\"width:100%\"></img>";
		cctv +="	<div class=\"text\">Caption Text ok</div>";
		cctv +="	</div>";
		cctv +="	<a class=\"prev\" onclick=\"plusSlides(-1)\">&#10094;</a>";
		cctv +="	<a class=\"next\" onclick=\"plusSlides(1)\">&#10095;</a>";
		cctv +="	<div style=\"text-align:center\">";
		cctv +="		<span class=\"dot\" onclick=\"currentSlide("+count+")\"></span>";
		cctv +="		<div class=\"mySlides\">";
		cctv +="	</div>";
		cctv +="</div>";
	}
	function plusSlides(n) {
    showSlides(slideIndex += n);
	}
	function currentSlide(n) {
		showSlides(slideIndex = n);
	}
	function showSlides(n) {
		var i;
		var slides = document.getElementsByClassName("mySlides");
		var dots = document.getElementsByClassName("dot");
		if (n > slides.length) { slideIndex = 1 }
		if (n < 1) { slideIndex = slides.length }
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" active", "");
		}
		slides[slideIndex - 1].style.display = "block";
		dots[slideIndex - 1].className += " active";
	}
	cctvPage.innerHTML = cctv;
}
//modal login
function showModal() {
  var modal = document.querySelector('ons-modal');
  modal.show();
}
//close modal
function closemodel(){
   var modal = document.querySelector('ons-modal');
   modal.hide();
}
function toggleToast() {
    document.querySelector('ons-toast').toggle();
}
// GANTI NAMA SAKLAR
function changename(param){
	var ip = storage.getItem("ipaddress");
	var nama = document.getElementById("name"+param).value;
	var mainname = document.getElementById(param);
	var nametm = document.getElementById("nametm"+param);
	var nametm1 = document.getElementById("tm"+param);
	if ( nama != null ){
		GetPost("POST",ip,"cgi-bin/smarthome?nama="+nama+"&gpio="+param,"SAKLAR");
		mainname.innerHTML = "";
		mainname.innerHTML = mainname.innerHTML + nama;
		nametm.innerHTML = "Timer "+ nama;
		nametm1.innerHTML = nama;
		ons.notification.toast({message: "nama "+nama+" sudah di set", timeout: 1000});
	}
}
// cctv next
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}
function fixcol(){
	var props = document.getElementsByClassName("tm");
	for (var i = 0; i < props.length; i++) {
		props[i].classList.toggle("show");
	}
}
// GANTI STATUS WAKTU
function statTime(param){
	fixcol();
	var nama = document.getElementById(param).innerHTML;
	var addr = storage.getItem("ipaddress");
	if (document.getElementById("swtm"+param).checked == false){
		GetPost("POST",addr,"/cgi-bin/smarthome?gpio="+param+"&timer=0","SAKLAR");
		ons.notification.toast({message: "Timer "+nama+" di non Aktifkan", timeout: 1000});
	} else {
		GetPost("POST",addr,"/cgi-bin/smarthome?gpio="+param+"&timer=1","SAKLAR");
		ons.notification.toast({message: "Timer "+nama+" di Aktifkan", timeout: 1000});
	}
}
//GANTI WAKTU
var fromTemplate = function (id) {
    var dialog = document.getElementById('dialog-3');
    var addr = storage.getItem("ipaddress");
    var tme1 = document.getElementById("time-start" + id).value;
    var tme2 = document.getElementById("time-end" + id).value;
    var INtme = tme1 + "-" + tme2
    GetPost("POST",addr,"/cgi-bin/smarthome?value=" + INtme + "&gpio=" + id,"SAKLAR");
	ons.notification.toast({message: "Set Timer " + INtme, timeout: 3000})
};
// ganti password
function setaccount(){
	var user1 = document.getElementById('usernameset').value;
	var pass1 = document.getElementById('passwordset1').value;
	var pass2 = document.getElementById('passwordset2').value;
	var user = storage.getItem("username");
	var pass = storage.getItem("password");
	var addr = storage.getItem("ipaddress");
	if (pass1 == pass2 && pass1 != null && pass2 != null && user != null){
		GetPost("POST",addr,"/cgi-bin/smarthome?login=set&user="+user1+"&pass="+pass1,"SAKLAR");
		ons.notification.toast({message: "user dirubah jadi "+user1+" dan password"+ pass1, timeout: 5000});
	}
}