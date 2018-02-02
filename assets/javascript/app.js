


//<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDbp9cwrRuVSracoaUoKlt0fFspXdCj9Dg",
    authDomain: "fir-d56b3.firebaseapp.com",
    databaseURL: "https://fir-d56b3.firebaseio.com",
    projectId: "fir-d56b3",
    storageBucket: "",
    messagingSenderId: "852229870699"
  	};
  	firebase.initializeApp(config);

	var name;
	var destination;
	var frequency;
	var firstTrain;
	var nextArrival;
	var minutesAway;
	var intervalVar;
	

	var database = firebase.database();

	$("#addBtn").on("click",function(event){
		event.preventDefault();
		name = $("#nameInput").val().trim();
		destination = $("#destInput").val().trim();
		firstTrain = $("#timeInput").val().trim();
		frequency = parseInt($("#frequencyInput").val());
		console.log("name: " + name);
		console.log("destination: " + destination);
		console.log("firstTrain: " + firstTrain);
		console.log("frequency: " + frequency);
	

		database.ref().push({
			name: name,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency
			
		});

		$("#nameInput").val("");
		$("#destInput").val("");
		$("#timeInput").val("");
		$("#frequencyInput").val("");	
	
	});


	database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
		var sv = snapshot.val();
		console.log("in child_added");
		// var intervalVar = setInterval(function(){
		
			var first = sv.firstTrain;
		var convert1 = moment(first, "HH:mm").subtract(1, "years");
		var currTime = moment();
		var diffTime = moment().diff(moment(convert1), "minutes");
		var remainder = diffTime % sv.frequency;
		var minutesTilNext = parseInt(sv.frequency - remainder);
		var nextArrival = currTime.add(minutesTilNext, "minutes").format("h:mm A");

		$("#trainTable").append("<tr><td>"+sv.name+"</td><td>"+sv.destination+"</td><td>"+ sv.frequency + "</td><td>"+nextArrival+"</td><td>"+minutesTilNext+"</td>");
	// }, 1000 * 5);
		
	});

	function loadPageData(){
		$("#trainTable").empty();
		var query = database.ref().orderByChild("dateAdded");
		query.once("value")
			.then(function(snapshot){
				snapshot.forEach(function(childSnap){
					
				var first = childSnap.val().firstTrain;	
				var convert1 = moment(first, "HH:mm").subtract(1, "years");
				var currTime = moment();
				var diffTime = moment().diff(moment(convert1), "minutes");
				var remainder = diffTime % childSnap.val().frequency;
				var minutesTilNext = parseInt(childSnap.val().frequency - remainder);
				var nextArrival = currTime.add(minutesTilNext, "minutes").format("h:mm A");

				$("#trainTable").append("<tr><td>"+childSnap.val().name+"</td><td>"+childSnap.val().destination+"</td><td>"+ childSnap.val().frequency + "</td><td>"+nextArrival+"</td><td>"+minutesTilNext+"</td>");
				
				});
				
			}, function (errorObj){
				console.log(errorObj);
			});
	}
	intervalVar = setInterval(function(){
			loadPageData();
	}, 1000 * 5);
	$(document).ready(loadPageData());

