  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB8qCZ1IeAi73mmK7mYmCI-Jois7egpeew",
    authDomain: "traindatabase-f79f4.firebaseapp.com",
    databaseURL: "https://traindatabase-f79f4.firebaseio.com",
    projectId: "traindatabase-f79f4",
    storageBucket: "traindatabase-f79f4.appspot.com",
    messagingSenderId: "107799807478"
  };
  firebase.initializeApp(config);

//Assigns the Firebase Database to a variable
  var database = firebase.database();

//Ensures the document is ready before running all the code
$(document).ready(function(){ 

//Creates a listener on the "Submit" button in order to add a train
$("#addTrain").on("click",function(event)
{

  event.preventDefault();

//Creates variables for all the data that has been submitted by the user
  var newName = $("#trainName").val().trim();
  var newDestination = $("#trainDestination").val().trim();
  var newTrainTime = $("#trainTime").val().trim();
  var newFrequency = $("#trainFrequency").val().trim();
  
//Merges these variables into an object to allow for easier storage in the database
  var newTrain = {
      name:newName,
      destination:newDestination,
      time:newTrainTime,
      frequency:newFrequency
  };

//Pushes the New Train to the Firebase database
  database.ref().push(newTrain);

//Clears all the forms
  $("#trainName").val("");
  $("#trainDestination").val("");
  $("#trainTime").val("");
  $("#trainFrequency").val("");
})

//Creates a listener to the Database that awaits for a train to be added to firebase and then displays all trains in the database
database.ref().on("child_added", function(childSnapshot)
{
 //Grabs all the variables from the Train Object and sets them to new variables
    var dispName = childSnapshot.val().name;
    var dispDestination = childSnapshot.val().destination;
    var dispTime = childSnapshot.val().time;
    var dispFrequency = childSnapshot.val().frequency;

//Begins the process of calculating the next arrival for the trains and how many minutes are left
    var convTrainTime = moment(dispTime,"HH:mm").subtract(1,"years");
    var minDif = moment().diff(moment(convTrainTime),"minutes");
    var remainingMins = minDif % dispFrequency;
    var minsToTrain = dispFrequency - remainingMins;
    var dispRemain = moment().add(minsToTrain, "minutes");
    var dispNextTrain = moment(dispRemain).format("hh:mm a");

//Creates a new row to be added to the table of trains and appends it all to the table

   var newRow = $("<tr>").append($("<td>").text(dispName),$("<td>").text(dispDestination),$("<td>").text(dispFrequency),$("<td>").text(dispNextTrain),$("<td>").text(minsToTrain));

   $("#trainTable").append(newRow);
})

});