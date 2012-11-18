
var Promille = {

    CalculatePromille : function(timeSinceLastDrink, alcoholConsumedInGrams, bodyWeight, sex) {
        if (alcoholConsumedInGrams == 0) return 0;
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
    }, 
    TimeUntilSober : function (alcoholConsumedInGrams, bodyWeight, gender, timeOfFirstDrink) {
        var timeUntilSober = 0;
        var A = alcoholConsumedInGrams; 
        var M = bodyWeight;
        var Cm = Promille.getPercentage(gender);
        var TsInHours =  Promille.getDifference(Number(timeOfFirstDrink), now)/1000/60/60;
        console.log("sup");
        timeUntilSober = (A/ (M*Cm) - 0.15* TsInHours-0.2) / 0.15;
        return timeUntilSober;
        
    }

};


$('#promille').live( 'pageinit',function(event){
    alert("hey");
    var dateNow = new Date();
    var consumed = Number (sessionStorage.getItem('alcoholConsumed'));
    var difference = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime());
    var differenceOneHour = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime() + hourToMilliSeconsEnum.ONE);
    var promilleOneHour = Promille.CalculatePromille(differenceOneHour, consumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
    var promille = Promille.CalculatePromille(difference, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));


    var sliderHoursPromille =  $('#sliderHoursUntilSober').slider().val()*3600000;//ms
  
    var diffFirstDrinkAndSliderValue = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), dateNow.getTime()+ sliderHoursPromille);
    var promilleOfSlider = Promille.CalculatePromille(diffFirstDrinkAndSliderValue, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
    $('#sliderHoursUntilSober').change(function() {
        sliderHoursPromille =  $('#sliderHoursUntilSober').slider().val()*3600000;//ms
        diffFirstDrinkAndSliderValue = Promille.getDifference(Number(sessionStorage.getItem('timeOfFirstDrink')), new Date().getTime()+ sliderHoursPromille);
        promilleOfSlider = Promille.CalculatePromille(diffFirstDrinkAndSliderValue, consumed , localStorage.getItem('bodyWeight'), localStorage.getItem('gender'));
        $('#promilleSliderValue').text( "" + promilleOfSlider.toFixed(2)+ " ..%");
    });

    $('#currentPromille').text("" + promille.toFixed(2) + " %.");
    $('#promilleSliderValue').text( "" + promilleOfSlider.toFixed(2)+ " ..%");

    var timeUntilSober =0;
    if (promille>0.2)
        timeUntilSober = Promille.TimeUntilSober(consumed, localStorage.getItem('bodyWeight'), localStorage.getItem('gender'),Number (sessionStorage.getItem('timeOfFirstDrink')));

    $('#soberInHours').text(" " + TimeHelper.convertSecondsToHoursMinutesAndSeconds(timeUntilSober*60*60) );

});



// JavaScript code for the main page
	$('#main').live( 'pageinit',function(event){
        alert("test");
		//Initialize
        sessionStorage.setItem('alcoholConsumed',0);
        sessionStorage.setItem('promille', 0);
        sessionStorage.setItem('beerCount', 0);

        //dette må fikses så det alltid ikke dafulter til dette.
        //localStorage.setItem('gender', genderEnum.MALE);
        localStorage.setItem('bodyWeight', 75);
    
        promille = Number  (sessionStorage.getItem('promille'));



		// UPDATE BUTTON
		$('#boozeButton').click(function() {
            console.log("skjer det noe ");
            alert("hei");
           sessionStorage.setItem('timeOfFirstDrink', new Date().getTime());
            $('#startedDrinking').text("Drinking started at: " + new Date().getDate()  + "/" + new Date().getMonth() + ": " + new Date().getHours()+":"+ new Date().getMinutes());
            $("#boozeButton").button('disable');
		});
    });