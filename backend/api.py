import json
from flask import Flask, request, jsonify
from flask_cors import CORS

import whisper
import youtube_dl
import yt_dlp
import os
import whisperx
import gc
import torch

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

        audio_file = ""
        device = "cpu" #torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        batch_size = 4
        compute_type = "int8"
        
        # 1. Transcribe with original whisper (batched)
        model = whisperx.load_model("tiny", device, compute_type=compute_type)
    
        ydl_opts = {     
            'format': 'm4a/bestaudio/best',
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
            }]
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            # info = info.replace('.webm', '.wav')
            # info = info.replace('.m4a', '.wav')
            
        audio_file = ydl.prepare_filename(ydl.extract_info(url, download=False))
        print("RESULTTTTTTTTTTTTTTTTTTTT:" + audio_file)

        audio = whisperx.load_audio(audio_file)
        result = model.transcribe(audio, batch_size=batch_size)
        #print(result["segments"]) # before alignment

        # 2. Align whisper output
        model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
        result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

        words = []
        segments = result["segments"]

        # concatenate each word(with their timestamp) into a list
        for i in range(len(segments)):
            for key in segments[i]:
                if key == "words":
                    words += segments[i][key]

        #print(words) # after alignment
    
        # Delete the audio file that was created
        try:
            os.remove(audio_file)
        except:
            print("File doesn't exist")
        
        return jsonify(words)
    
    else:
        return "nada"


if __name__ == "__main__":
    app.run(debug=True)