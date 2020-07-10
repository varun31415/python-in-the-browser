# Python in the browser
This github repo is an implementation to run python in the browser using flask. 
# How it works
Here is how the code works:
<ol>
  <li>The client sends the code to the flask server. </li>
  <li>The flask server writes the code to <code>output.py</code> and runs the program using <code>subprocess.Popen(["python3 output.py"], shell=True)</code>. Note the the flask server makes some changes to the code so that the output is written to <code>output.txt</code></li>
  <li>Now, the client sends lots of requests to <code>output.txt</code>, the file that the output of the program is written too. The client recieves the data and shows it on the page. The client keeps updating the output until the program is finished. </li>
</ol>
