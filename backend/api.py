import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from bs4 import BeautifulSoup
from config import Config
from models import db, User
from dotenv import load_dotenv
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, JWTManager

import bcrypt
import whisper
import youtube_dl
import yt_dlp
import os
import whisperx
import gc
import torch
import requests

load_dotenv()
app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)

db.init_app(app)

CORS(app, 
     supports_credentials=True,
     resources={r"/*": {"origins": "http://localhost:5173"}},
     methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
     allow_headers=["Content-Type",'Accept'])

@app.route('/api/test')
def test():
    return {'hello' : 'hi'}

@app.route('/api/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        data = request.json
        email = data['email']
        password = data['password'].encode("utf-8")

        if User.query.filter_by(email=email).first():
            return {"message": "email exists"}

        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        hashed_str = hashed.decode("utf-8")

        user = User(email, hashed_str)
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))

        res = jsonify({"message" : "User created"})

        # set JWT into a cookie
        set_access_cookies(res, token)

        return res 
    else:
        return 'Route only handles POST'

@app.route('/api/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        data = request.json
        email = data['email']
        password = data['password']

        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
            return {'message': "Invalid input"}
        
        token = create_access_token(identity=str(user.id))

        res = jsonify({'message': "Login successful"})
        #print(res)
        # set JWT into a cookie
        set_access_cookies(res, token)
        
        return res
    else:
        return 'Route only handles POST'

#access to specific user info
@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    # auto extracts the JWT from the HttpOnly cookie
    user_id = get_jwt_identity()
    
    user = User.query.get(user_id)

    return {"email": user.email}

@app.route('/api/get_definitions', methods=['POST', 'GET'])
def get_definitions():
    info = request.json
    word = info['word']
    language = info['language']
    result = []

    url = f"https://en.wiktionary.org/api/rest_v1/page/definition/{word}"

    #prevent 403 error
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
    }

    res = requests.get(url, headers=headers)

    if res.status_code != 200:
        print(f"Error fetching data: {res.status_code}")
        return jsonify([f"Error fetching data for the word '{word}'"])
    
    data = res.json()

    if language not in data:
        print(f"No definitions found for {word} in {language}")
        return jsonify([f"No definitions found for '{word}' in {language}"])

    for entry in data[language]:
        part_of_speech = entry.get('partOfSpeech', 'Unknown')
        definitions = entry.get('definitions', [])
        for i in range(len(definitions)):
            raw_definition = definitions[i].get('definition', '')
            clean_definition = BeautifulSoup(raw_definition, "html.parser").get_text()
            if raw_definition != '' and i < 2:
                result.append(f"({part_of_speech}) {clean_definition}")

    return jsonify([word, result])

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
        language = result["language"]
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
        
        return jsonify([words, language])
    
    else:
        return "nada"


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)