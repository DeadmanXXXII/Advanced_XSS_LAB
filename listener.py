from flask import Flask, request
app = Flask(__name__)

@app.route('/callback', methods=['GET', 'POST'])
def callback():
    print("[OOB] Received callback from CSV payload!")
    return "ACK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9001)
