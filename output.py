from time import sleep

def load_html(*args, end="\n", flush=False):
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

def print(*args, end="\n", flush=False):
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
    sleep(0.15)
del sleep, load_html
print()

try: 
	
	print("Hello World")

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
