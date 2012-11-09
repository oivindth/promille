genderEnum = {
    MALE : "Male",
    FEMALE : "Female"
};

hourToMilliSeconsEnum = {
    ONE : 3600000,
    TWO : 7200000
};


var TimeHelper = {
    convertSecondsToHoursMinutesAndSeconds:function (seconds) {
        var hours = seconds / 3600;
        var remainder = seconds % 3600;
        var minutes = remainder / 60;
        //seconds = remainder % 60;

        return hours.toFixed(0) + " h " + minutes.toFixed(0) + " m ";
    }
};





var Promille = {

    CalculatePromille : function(timeSinceLastDrink, totalAlcoholConsumedInGrams, bodyWeight, sex) {
        if (totalAlcoholConsumedInGrams == 0) return 0;
        var fordelingavAlkohol = totalAlcoholConsumedInGrams / (bodyWeight*Promille.getPercentage(sex));
        return fordelingavAlkohol- (0.15*timeSinceLastDrink);
    },
    getPercentage : function(sex) {
        if (sex === genderEnum.MALE) return 0.7;
        return 0.6;
    },
    getDifference : function(firstDrink, lastDrink) {
        return ( (lastDrink-firstDrink)/(1000*60*60) );
    },
    CalculateGramsOfAlcohol : function (volume, strength) {
        var baseValue = 0.08; // 1% alkohol i 1 cl volum gir 0,08 gram alkohol
        return (baseValue*strength*volume)*100;
    }

};


$(document).bind("mobileinit", function(){
	  $.extend(  $.mobile , {
		  defaultPageTransition: 'none',
	  defaultDialogTransition: 'none'
	  });
	});


$('#liquorDialog').live('pageinit', function(event) {
// utregning av alkohol etc bør gjøres i main? bare lagre alcoholconsumed her i session?
    $('#saveLiquorButton').click(function() {
        var promille = Number  (sessionStorage.getItem('promille'));

        var alcoholConsumed = Number ( sessionStorage.getItem('alcoholConsumed'));
        var timeOfFirstDrink = Number (sessionStorage.getItem('timeOfFirstDrink'));

        var difference = Promille.getDifference(timeOfFirstDrink, new Date().getTime());
        var strength = $('#slider-strengthLiquor').slider().val();
        var size =0.0;
        if ( $('#radio-choice-liquor1').is(':checked') ) size = 0.04;
        if ( $('#radio-choice-liquor2').is(':checked') ) size = 0.08;

        alcoholConsumed+= Promille.CalculateGramsOfAlcohol(size,strength);
        sessionStorage.setItem('alcoholConsumed', alcoholConsumed);

        var lCount = Number(sessionStorage.getItem('liquorCount'));
        lCount++;
        sessionStorage.setItem('liquor', lCount);
        var lCountHistory = Number ( localStorage.getItem('liquorCountHistory'));
        lCountHistory++;
        localStorage.setItem('liquorCountHistory', lCountHistory);

        promille = Promille.CalculatePromille(difference, alcoholConsumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));

        sessionStorage.setItem('promille', promille);
        //$('#promilleTextInput').val("" + promille.toFixed(2) + ".%");
        $.mobile.changePage("main.html");


    });

});


$('#wineDialog').live('pageinit', function(event) {

    $('#saveWineButton').click(function() {
            var promille = Number  (sessionStorage.getItem('promille'));

            var alcoholConsumed = Number ( sessionStorage.getItem('alcoholConsumed'));
            var timeOfFirstDrink = Number (sessionStorage.getItem('timeOfFirstDrink'));

            var difference = Promille.getDifference(timeOfFirstDrink, new Date().getTime());
            var strength = $('#slider-strengthWine').slider().val();
            var size =0.0;
            if ( $('#radio-choice-wine1').is(':checked') ) size = 0.075;
            if ( $('#radio-choice-wine2').is(':checked') ) size = 0.12;



            alcoholConsumed+= Promille.CalculateGramsOfAlcohol(size,strength);
            sessionStorage.setItem('alcoholConsumed', alcoholConsumed);

        var wineCount = Number(sessionStorage.getItem('wineCount'));
        wineCount++;
        sessionStorage.setItem('wine', wineCount);
        var wineCountHistory = Number ( localStorage.getItem('wineCountHistory'));
        wineCountHistory++;
        localStorage.setItem('wineCountHistory', wineCountHistory);
            promille = Promille.CalculatePromille(difference, alcoholConsumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));

            sessionStorage.setItem('promille', promille);
            //$('#promilleTextInput').val("" + promille.toFixed(2) + ".%");
            $.mobile.changePage("main.html");


    });

});

$('#beerDialog').live('pageinit', function(event) {

    $('#saveBeerButton').click(function() {
        var promille = Number  (sessionStorage.getItem('promille'));

        var alcoholConsumed = Number ( sessionStorage.getItem('alcoholConsumed'));
        var timeOfFirstDrink = Number (sessionStorage.getItem('timeOfFirstDrink'));

        var difference = Promille.getDifference(timeOfFirstDrink, new Date().getTime());

        var strength = $('#slider-strength').slider().val();
        var size =0.0;
        if ( $('#radio-choice-beer1').is(':checked') ) size = 0.33;
        if ( $('#radio-choice-beer2').is(':checked') ) size = 0.4;
        if ( $('#radio-choice-beer3').is(':checked') ) size = 0.5;
        if ( $('#radio-choice-beer4').is(':checked') ) size = 0.6;


        alcoholConsumed+= Promille.CalculateGramsOfAlcohol(size,strength);
        sessionStorage.setItem('alcoholConsumed', alcoholConsumed);

        promille = Promille.CalculatePromille(difference, alcoholConsumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));

        sessionStorage.setItem('promille', promille);
       //$('#promilleTextInput').val("" + promille.toFixed(2) + ".%");
        var beerCount = Number(sessionStorage.getItem('beerCount'));
        beerCount++;
        sessionStorage.setItem('beerCount', beerCount);
        var beerCountHistory = Number ( localStorage.getItem('beerCountHistory'));
        beerCountHistory++;
        localStorage.setItem('beerCountHistory', beerCountHistory);
        $.mobile.changePage("main.html");
    });

});

$('#exitApp').live( 'pageinit',function(event){
    $('#yesButton').click(function() {
        navigator.app.exitApp();
    });
});


$('#history').live( 'pageinit',function(event){
    $('#pBeerCount span').text( Number (localStorage.getItem('beerCountHistory')));
    $('#pWinecount span').text( Number ( localStorage.getItem('wineCountHistory')));
    $('#pDrinksCount span').text( Number ( localStorage.getItem('liquorCountHistory')));
});

$('#bodyWeight').live('pageinit', function() {
    var weight = localStorage.getItem('bodyWeight');
    $('#slider-weight').slider().val(weight).slider('refresh');
    $('#saveWeightButton').click(function() {
        localStorage.setItem('bodyWeight', $('#slider-weight').slider().val() );
        $.mobile.changePage("profile.html");
    });

});

//Gender settings page
$('#gender').live('pageinit', function(event) {
    var gender = localStorage.getItem('gender');
    var boolMale = true;
    if (gender === genderEnum.FEMALE) boolMale = false;
    $('#radio-choice-male').attr("checked",boolMale).checkboxradio("refresh");
    $('#radio-choice-female').attr("checked",!boolMale).checkboxradio("refresh");

    $('#saveGenderButton').click(function() {
        if ($('#radio-choice-male').is(':checked'))
            localStorage.setItem('gender', genderEnum.MALE);
        else localStorage.setItem('gender', genderEnum.FEMALE);
        /*
        $('#radio-choice-male').change(function() {
            localStorage.setItem('gender', "male");
        });
        */
        $.mobile.changePage("profile.html");

    });
});

$('#profile').live( 'pageinit',function(event){
    $('p#pTest').text(localStorage.getItem('gender'));
    $('#pWeight').text(localStorage.getItem('bodyWeight'));
});

$('#planner').live('pageinit', function(event) {

});

$('#promille').live( 'pageinit',function(event){

    var dateNow = new Date();
    var consumed = Number (sessionStorage.getItem('alcoholConsumed'));
    var difference = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime());
    var differenceOneHour = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime() + hourToMilliSeconsEnum.ONE);
    var promilleOneHour = Promille.CalculatePromille(differenceOneHour, consumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
    var promille = Promille.CalculatePromille(difference, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));


    var xhourspromille =  $('#sliderHoursUntilSober').slider().val();
    var ttt = xhourspromille*3600000;
    var diffTest = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime()+ ttt);
    var promillx = Promille.CalculatePromille(diffTest, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
    $('#sliderHoursUntilSober').change(function() {
        xhourspromille =  $('#sliderHoursUntilSober').slider().val();
        ttt = xhourspromille*3600000;
        diffTest = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), new Date().getTime()+ ttt);
        promillx = Promille.CalculatePromille(diffTest, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
        $('#promilleOneHour').text( "" + promillx.toFixed(2)+ " ..%");
    });

    $('#currentPromille').text("" + promille.toFixed(2) + " %.");
    $('#promilleOneHour').text( "" + promillx.toFixed(2)+ " ..%");

    var now = new Date().getTime();
    var tempNow = new Date().getTime();


	var timeUntilSober = 0;
	// Beregne tid til edru uten å iterere. 
	var A = sessionStorage.getItem('alcoholConsumed');
	console.log("A " + A);
	var M = localStorage.getItem('bodyWeight');
	console.log("M " + M);
	var Cm = Promille.getPercentage(localStorage.getItem('gender'));
	console.log("Cm " + Cm);
	var TsInHours =  Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), now)/1000/60/60;
	console.log("TS " + TsInHours);
	
	if (promille > 0.2) {
		  timeUntilSober = (A/ (M*Cm) 	 
		- 0.15* TsInHours-0.2) / 0.15;
	}

    while (promille >0.2) {
        now+= 300000; //increase with 5 minutes
        difference = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), now);
        promille = Promille.CalculatePromille(difference, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
    }

    var msUntilSober = now - tempNow;
    var secondsUntilSober = msUntilSober/1000;

    $('#soberInHours').text(""+ TimeHelper.convertSecondsToHoursMinutesAndSeconds(secondsUntilSober) + "bennys versjon: " + TimeHelper.convertSecondsToHoursMinutesAndSeconds(timeUntilSober*60*60) );

});








// JavaScript code for the main page
	$('#main').live( 'pageinit',function(event){
		//Initialize
        sessionStorage.setItem('alcoholConsumed',0);
        sessionStorage.setItem('promille', 0);
        sessionStorage.setItem('beerCount', 0);
        sessionStorage.setItem('timeOfFirstDrink', new Date().getTime());
		console.log(sessionStorage.getItem('timeOfFirstDrink')/1000/60/60);

        localStorage.setItem('gender', genderEnum.MALE);
        localStorage.setItem('bodyWeight', 75);




        promille = Number  (sessionStorage.getItem('promille'));
		// UPDATE BUTTON
		$('#boozeButton').click(function() {
           sessionStorage.setItem('timeOfFirstDrink', new Date().getTime());
            $('#startedDrinking').text("Drinking started at: " + new Date().getDate()  + "/" + new Date().getMonth() + ": " + new Date().getHours()+":"+ new Date().getMinutes());
            $("#boozeButton").button('disable');
		});
/*
        $('#beernavbar').click(function() {
            $(this).attr('data-icon','myapp-beer-white');
            $(this).children().children().next().removeClass('ui-icon-myapp-beer').addClass('ui-icon-myapp-beer-white');

            $('#bacnavbar').attr('data-icon','myapp-bac');
            $('#bacnavbar').children().children().next().removeClass('ui-icon-myapp-bac-white').addClass('ui-icon-myapp-bac');
            $('#plannernavbar').attr('data-icon','myapp-planner');
            $('#plannernavbar').children().children().next().removeClass('ui-icon-myapp-planner-white').addClass('ui-icon-myapp-planner');
            $('#profilenavbar').attr('data-icon','myapp-profile');
            $('#profilenavbar').children().children().next().removeClass('ui-icon-myapp-profile-white').addClass('ui-icon-myapp-profile');
        });

        $('#bacnavbar').click(function() {

            $(this).attr('data-icon','myapp-bac-white');
            $(this).children().children().next().removeClass('ui-icon-myapp-bac').addClass('ui-icon-myapp-bac-white');

            $('#beernavbar').attr('data-icon','myapp-beer');
            $('#beernavbar').children().children().next().removeClass('ui-icon-myapp-beer-white').addClass('ui-icon-myapp-beer');
            $('#plannernavbar').attr('data-icon','myapp-planner');
            $('#plannernavbar').children().children().next().removeClass('ui-icon-myapp-planner-white').addClass('ui-icon-myapp-planner');
            $('#profilenavbar').attr('data-icon','myapp-profile');
            $('#profilenavbar').children().children().next().removeClass('ui-icon-myapp-profile-white').addClass('ui-icon-myapp-profile');

        });
        $('#plannernavbar').click(function() {

            $(this).attr('data-icon','myapp-planner-white');
            $(this).children().children().next().removeClass('ui-icon-myapp-planner').addClass('ui-icon-myapp-planner-white');

            $('#beernavbar').attr('data-icon','myapp-beer');
            $('#beernavbar').children().children().next().removeClass('ui-icon-myapp-beer-white').addClass('ui-icon-myapp-beer');
            $('#bacnavbar').attr('data-icon','myapp-bac');
            $('#bacnavbar').children().children().next().removeClass('ui-icon-myapp-bac-white').addClass('ui-icon-myapp-bac');
            $('#profilenavbar').attr('data-icon','myapp-profile');
            $('#profilenavbar').children().children().next().removeClass('ui-icon-myapp-profile-white').addClass('ui-icon-myapp-profile');

        });

        $('#profilenavbar').click(function() {

            $(this).attr('data-icon','myapp-profile-white');
            $(this).children().children().next().removeClass('ui-icon-myapp-profile').addClass('ui-icon-myapp-profile-white');

            $('#beernavbar').attr('data-icon','myapp-beer');
            $('#beernavbar').children().children().next().removeClass('ui-icon-myapp-beer-white').addClass('ui-icon-myapp-beer');
            $('#bacnavbar').attr('data-icon','myapp-bac');
            $('#bacnavbar').children().children().next().removeClass('ui-icon-myapp-bac-white').addClass('ui-icon-myapp-bac');
            $('#plannernavbar').attr('data-icon','myapp-planner');
            $('#plannernavbar').children().children().next().removeClass('ui-icon-myapp-planner-white').addClass('ui-icon-myapp-planner');
        });

*/

    });

function functionname()
{

}