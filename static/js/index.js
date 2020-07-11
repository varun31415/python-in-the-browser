$(function() {
    // initializes variables
    $("#loader").html("")
    var active = false;
    var interrupt = false;

    // initializes ace.js
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");    
    editor.getSession().setMode("ace/mode/python");

    // function when click run button
    $("#run").click(function() {
        // if the program is already active, interrupt it, if it isn't run the program
        if (active) {
            // ajax request to cancel
            $.ajax({
                type: "GET", 
                url: "/cancel", 
                success: function(response) {
                    // changes the button to btn-primary and interrupt to true when interrupt
                    $("#run").html("Run")
                    $("#run").attr("class", "btn btn-primary btn-lg btn-block")
                    interrupt = true;
                }
            })
        } else {
            // changes the button to btn-danger when starting program
            $("#run").html("Interrupt")
            $("#run").attr("class", "btn btn-danger btn-lg btn-block")
            $("#loader").html(`<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div><br><br>`)
            $("#error").fadeOut(100)

            // ajax request to send code
            $.ajax({
                type: "POST",
                url: "/run_code",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "code": editor.getSession().getValue()
                }), complete: function() {
                    // function on completion of code
                    $("#loader").html("")
                    active = false; 
                    load_output()
                    $("#run").html("Run")
                    $("#run").attr("class", "btn btn-primary btn-lg btn-block")
                    $("#error").fadeIn()
                }, error: function() {
                    // shows error message if server down
                    $("#error").html("Server currently down. Please retry. ")
                }, success: function() {
                    // removes error message
                    $("#error").html("")
                }
            })
            load_output();
            active = true; 
        }
    })

    // load_output constantly updates the output of the code
    function load_output() {
        $.ajax({
            type: "GET", 
            url: "/output.txt",
            contentType: "application/json", 
            dataType: "json", 
            data: JSON.stringify({
                "file": "output.txt"
            }), success: function(response) {
                if (active) {
                    $("#output").html(response["output.txt"] + "█")
                } else {
                    $("#output").html(response["output.txt"])
                }
                if (interrupt) {
                    $("#output").append("^C")
                }
                if (!active) {
                    $("#output").append(`<span style="color: green;">$</span> █`)
                }
                // reload scrolls the output to the bottom of it overflows
                reload()
                if (active) {
                    window.setTimeout(load_output, 100)
                }
            }
        })
    }

    function reload() {
        var element = document.getElementById("output");
        element.scrollTop = element.scrollHeight
    }
})