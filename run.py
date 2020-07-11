import subprocess
from flask import * 

app = Flask(__name__)

global before_content, after_content, proc

# before_content and after_content represent the content to place before and after the program to capture the output on output.txt. 

before_content = """from time import sleep

def load_html(*args, end="\\n", flush=False):
    total = ""
    i = 0
    for arg in args:
        if i != len(args) - 1: 
            total += str(arg) + " "
        else: 
            total += str(arg)
        i = i + 1
    pre = open("output.txt",'r').read()
    open("output.txt",'w').write(pre + total + end)

def print(*args, end="\\n", flush=False):
    total = ""
    i = 0
    for arg in args:
        if i != len(args) - 1: 
            total += str(arg) + " "
        else: 
            total += str(arg)
        i = i + 1
    pre = open("output.txt",'r').read()
    new_total = ""
    for char in total:
        if char == "<":
            new_total += "&lt;"
        else: 
            new_total += char
    total = new_total
    open("output.txt",'w').write(pre + total + end)

load_html('<span style="color: green;">$</span>', end="")
for char in " python3 __main__.py":
    load_html(char, end="")
    sleep(0.05)
del sleep, load_html
print()

try: 
"""

after_content = """
except Exception as e:
    from traceback import format_exc
    trace = format_exc()
    array = trace.split(",")
    new_trace = ""
    for arg in array:
        if arg[0:6] == " line ":
            line_number = int(arg[6:])
            line_number -= 41
            arg = f" line {line_number}"
        new_trace += arg + ","
    print(new_trace[:-2])
"""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/run_code", methods=["POST"])
def run_code():
    # /run_code takes the code from the json and starts it using subprocess
    data = request.json
    code = data["code"]
    new_code = ""
    for line in code.split("\n"):
        new_code += "\t" + line + "\n"
    code = new_code
    open("output.py",'w').write(before_content + code + after_content)
    open("output.txt",'w').write("")
    global proc 
    proc = subprocess.Popen(['python3 output.py'], shell=True)
    proc.communicate()
    return jsonify({"success": True})

@app.route("/output.txt")
def return_output_txt():
    # returns the value of output.txt
    data = open("output.txt",'r').read()
    return jsonify({"output.txt": data})

@app.route("/cancel")
def stop_program():
    # stops the program
    global proc
    proc.terminate()
    return "Success"

if __name__ == "__main__":
    app.run(debug=True, port=80, host="0.0.0.0")