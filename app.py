#! /usr/bin/env python

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return """<h1>eLibrary</h1>
<ul>
<li> Author: Bjarne Stroustrup
<li> <a href="/other">Other</a>
</ul>"""

@app.route("/other")
def other():
    return """<h1>eLibrary</h1>
<h2>Why you would ever need another author?</h2>
<a href="/">Yes, I apologize</a>"""

def run():
    app.run(host="0.0.0.0", port=5000)

if __name__ == "__main__":
    run()