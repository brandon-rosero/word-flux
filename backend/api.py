from flask import Flask

app = Flask(__name__)

@app.route('/api/route')
def func():
    return