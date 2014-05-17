$(document).ready(function(){
	initialize();

	$('#start').mouseenter(function(){
		var sound = $('#start-hover')[0];
		sound.load();
		sound.play();
	});
	
	//Random lightsaber based hover colors on answers
	$(document.body).on('mouseenter', '.answers ul li', function(){
		var colors = ["#00CDCD", "#EE7600", "#FF4500", "#FFD700"];
		$(this).css('background', colors[Math.floor(Math.random()*colors.length)]);
		// var sound = $('#saber-strike')[0];
		// sound.load();
		// sound.play();
	}).on('mouseleave', '.answers ul li', function(){
		$(this).css('background', 'rgba(0,0,0,0)');
	}).on('click', '.answers ul li', function(){
		checkAnswer($(this));
	});
});

var quiz = {};
quiz.refreshCount = 0;

function getQuestions(){
	$.ajax({
		url: "questions.json",
		datatype: "jsonp",
		async: false,
		success: function(data){
			console.log(typeof data);
			quiz.questionSet = (data);
			quiz.keys = Object.keys(quiz.questionSet);
		}
	});
}  

//Called to load the first question when the quiz is started.
function loadQuestion(){
	var key = quiz.keys[Math.floor(Math.random()*quiz.keys.length)];
	quiz.curAnswer = quiz.questionSet[key]['a'];
	var qhtml = "<div id='" + key + "'><p>Q: "+quiz.questionSet[key]["q"]+"</p><div class='answers'><ul><li>" + quiz.questionSet[key]["op1"] + "</li><li>" + quiz.questionSet[key]["op2"] + "</li><li>" + quiz.questionSet[key]["op3"] + "</li><li>" + quiz.questionSet[key]["op4"] + "</li></ul></div></div>" ;
	$('#questions').hide().html(qhtml).fadeIn();

	delete quiz.questionSet[key];
	for(var i = 0; i < quiz.keys.length ; i++){
		if(quiz.keys[i] === key) quiz.keys.splice(i,1);
	}
}   

function checkAnswer(answer){
	var answerLimit = 6;
	if(quiz.correct !== answerLimit && quiz.wrong !== answerLimit){
		if(answer.text() === quiz.curAnswer){
			var sound = $('#yoda-' + Math.ceil(Math.random()*3))[0];
			sound.load();
			sound.play();
			answer.css("background","green");
			$('#saber').animate({"height":140*quiz.correct + "px"},800).show();
			quiz.correct++;
		}else{
			var sound = $('#darkside-' + Math.ceil(Math.random()*6))[0];
			sound.load();
			sound.play();
			answer.css("background","red");
			$('#saber-dark').animate({"height":140*quiz.wrong + "px"},800).show();
			quiz.wrong++;
		}
		console.log("correct: " + quiz.correct);
		quiz.curAnswer = "";
		setTimeout(function(){loadQuestion();}, 800);
	}


	console.log("total: " + quiz.correct);
	if(quiz.correct === answerLimit) winScreen();
	else if(quiz.wrong === answerLimit) loseScreen();
	
}

function initialize(){
	quiz.correct = 1;
	quiz.wrong = 1;
	hideMainScreen();
	
	//Incase start is hidded
	$('#start').show().click(function(){
		$(this).addClass('animate').fadeOut(1100, function(){
			$("#questions").css('visibility', "visible");
			$('#progress-saber,#progress-saber-dark').show();
			$('#saber').css('height','0');
			$('#saber-dark').css('height','0');
			if(quiz.refreshCount === 0){
				$('#tour').crumble();
				quiz.refreshCount++;
			}
			
		});
	});
	
	//Load the first question
	getQuestions();
	loadQuestion();
}

function winScreen(){
	hideMainScreen();
	$('#win').show().fadeOut(1000, function(){
		$('#start').removeClass('animate');
		initialize();
	});
	
}

function loseScreen(){
	hideMainScreen();
	$('#lose').show().fadeOut(1500, function(){
		$('#start').removeClass('animate');
		initialize();
	});
	
}

function hideMainScreen(){
	$('#questions').css("visibility","hidden");
	$('#progress-saber').hide();
	$('#progress-saber-dark').hide();
}
                                                                                                                                                                                           