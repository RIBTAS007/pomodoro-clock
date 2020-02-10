$(document).ready(function() {
  //initial variables
  var sessionEnd;
  var sessionSet = 25;
  var breakSet = 5;
  var mins = 25;
  var secs = 0;
  //page starts not pausable, and NOT on break, ie in session
  var pausable = 0;
  var onBreak = 0;
  //two different sounds can be added for end of break/session
  var ringSound = new Audio('https://goo.gl/LrGgFC');
  $("#session-length").text(sessionSet);
  $("#timer").text(sessionSet);
  $("#break-length").text(breakSet);

  //allow setting of work timer
  $("#set-session-up").click(function() {
    if (sessionSet < 59) {
      sessionSet++;
      $("#session-length").text(sessionSet);
      if (onBreak % 2 == 0) {
        $("#timer").text(sessionSet);
        mins = sessionSet;
        secs = 0;
      }
    }
  });

  $("#set-session-dn").click(function() {
    if (sessionSet > 1) {
      sessionSet--;
      $("#session-length").text(sessionSet);
      if (onBreak % 2 == 0) {
        $("#timer").text(sessionSet);
        mins = sessionSet;
        secs = 0;
      }
    }
  });

  //allow setting of break timer
  $("#set-break-up").click(function() {
    if (breakSet < 59) {
      breakSet++;
      $("#break-length").text(breakSet);
      if (onBreak % 2 == 1) {
        $("#timer").text(breakSet);
        mins = breakSet;
        secs = 0;
      }
    }
  });

  $("#set-break-dn").click(function() {
    if (breakSet > 1) {
      breakSet--;
      $("#break-length").text(breakSet);
      if (onBreak % 2 == 1) {
        $("#timer").text(breakSet);
        mins = breakSet;
        secs = 0;
      }
    }
  });

  //start timer with session length
  $("#start-pause-timer").click(function() {
    pausable++;
    if (pausable % 2 == 1) {
      startSession(mins, secs);
    } else {
      clearInterval(sessionEnd);
      $("#start-pause-timer").text("Start");
      enableSessionB();
      enableBreakB();
    }
  });

  $("#reset-timer").click(function() {
    clearInterval(sessionEnd);
    pausable = 0;
    secs = 0;
    $("#start-pause-timer").text("Start");
    enableSessionB();
    enableBreakB();
    if (onBreak % 2 == 0) {
      $("#timer").text(padZero(sessionSet) + ":00");
      mins = sessionSet;
    } else {
      $("#timer").text(padZero(breakSet)) + ":00";
      mins = breakSet;
    }
  });

  //padding numbers function
  function padZero(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  function enableSessionB() {
    $("#set-session-up").prop("disabled", false);
    $("#set-session-up").addClass("button");
    $("#set-session-dn").prop("disabled", false);
    $("#set-session-dn").addClass("button");
  }

  function enableBreakB() {
    $("#set-break-up").prop("disabled", false);
    $("#set-break-up").addClass("button");
    $("#set-break-dn").prop("disabled", false);
    $("#set-break-dn").addClass("button");
  }

  //start and run timer function
  function startSession(inputmins, inputsecs) {
    //display if on session or break
    if (onBreak % 2 == 0) {
      $("#s-or-b").text("Session");
      $("#set-session-up").prop("disabled", true);
      $("#set-session-up").removeClass("button");
      $("#set-session-dn").prop("disabled", true);
      $("#set-session-dn").removeClass("button");
    } else {
      $("#s-or-b").text("Break!");
      $("#set-break-up").prop("disabled", true);
      $("#set-break-up").removeClass("button");
      $("#set-break-dn").prop("disabled", true);
      $("#set-break-dn").removeClass("button");
    }
    $("#start-pause-timer").text("Pause");
    var time = parseFloat(inputsecs) + parseFloat(inputmins * 60);
    var originalTime = time;
    if (time === 0) {
      //if input is 0minutes just don't do anything
      clearInterval(sessionEnd);
    } else {
      ticker();
      sessionEnd = setInterval(ticker, 1000);

      function ticker() {
        if (time <= 0) {
          //timer ends
          clearInterval(sessionEnd);
          ringSound.play();
          onBreak++;
          $(".timer, .s-or-b").addClass("timer-done");
          setTimeout(function() {
            $(".timer, .s-or-b").removeClass("timer-done");
          }, 5000);
          $("#start-pause-timer").text("Start");

          if (onBreak % 2 == 1) {
            // if break is odd, then a session has just ended, so start break
            startSession(breakSet, 0);
            enableSessionB();
          } else {
            // if break is eve, then a break has just ended, so start session
            startSession(sessionSet, 0);
            enableBreakB();
          }
        }
        mins = Math.floor(time / 60);
        secs = time - mins * 60;
        $("#timer").text(padZero(mins) + ":" + padZero(secs));
        $(".spinner").css({
          "transform": "rotate(-" + (time / originalTime) * 360 + "deg)"
        });
        if (time / originalTime < 0.5) {
          $(".filler").css({
            "opacity": 1
          });
          $(".mask").css({
            "opacity": 0
          });
        } else {
          $(".filler").css({
            "opacity": 0
          });
          $(".mask").css({
            "opacity": 1
          });
        }
        time--;
      };
    };
  };

});