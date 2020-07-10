$(function() {
    $("#loader").html("")
    var active = false;
    var interrupt = false;
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");
    function reload() {
        var element = document.getElementById("output");
        element.scrollTop = element.scrollHeight
    }
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
                reload()
                if (active) {
                    window.setTimeout(load_output, 100)
                }
            }
        })
    }
    $("#run").click(function() {
        state = false;
        if (active) {
            $.ajax({
                type: "GET", 
                url: "/cancel", 
                success: function(response) {
                    $("#run").html("Run")
                    $("#run").attr("class", "btn btn-primary btn-lg btn-block")
                    interrupt = true;
                }
            })
        } else {
            $("#run").html("Interrupt")
            $("#run").attr("class", "btn btn-danger btn-lg btn-block")
            $("#loader").html(`<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div><br><br>`)
            $("#error").fadeOut(100)
            $.ajax({
                type: "POST",
                url: "/run_code",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "code": editor.getSession().getValue()
                }), complete: function() {
                    $("#loader").html("")
                    active = false; 
                    load_output()
                    $("#run").html("Run")
                    $("#run").attr("class", "btn btn-primary btn-lg btn-block")
                    $("#error").fadeIn()
                }, error: function() {
                    $("#error").html("Server currently down. Please retry. ")
                }, success: function() {
                    $("#error").html("")
                }
            })
            load_output();
            active = true; 
        }
    })
})