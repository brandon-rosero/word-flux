import json
from flask import Flask, request, jsonify
from flask_cors import CORS

import whisper
import youtube_dl
import yt_dlp
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/test')
def test():
    return {'hello' : 'hi'}

@app.route('/api/transcribe', methods=['POST', 'GET'])
def transcribe(): 
    if request.method == 'POST':
        # get data from api request
        data = request.json
        url = data['data']
        
        model = whisper.load_model("base")
    
        ydl_opts = {     
            'format': 'm4a/bestaudio/best',
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
            }]
        }
        info = ""
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
            # info = info.replace('.webm', '.wav')
            # info = info.replace('.m4a', '.wav')
            
        info = ydl.prepare_filename(ydl.extract_info(url, download=False))
        print("RESULTTTTTTTTTTTTTTTTTTTT:" + info)
        
        result = model.transcribe(info, fp16=False, language='English')

        # Delete the audio file that was created
        try:
            os.remove(info)
        except:
            print("File doesn't exist")
        
        return jsonify(result)
    
    else:
        return "nada"


if __name__ == "__main__":
    app.run(debug=True)