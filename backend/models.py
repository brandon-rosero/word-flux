from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

db = SQLAlchemy()
    
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    videos = db.relationship("User_saved_videos", back_populates="user", cascade="all, delete-orphan")
    flashcard_sets = db.relationship("Flashcard_set", back_populates="user")

    def __init__(self, email, password):
        self.email = email
        self.password_hash = password

    def __repr__(self):
        return f"<User: {self.email} {self.password_hash}>"
    
class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    video_url = db.Column(db.String(255), nullable=False)
    thumbnail_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    video_info = db.relationship("User_saved_videos", back_populates="video", cascade="all, delete-orphan")
    transcript = db.relationship("Video_transcript", uselist=False, back_populates="video", cascade="all, delete-orphan")

    def __init__(self, title, video_url, thumbnail_url):
        self.title = title
        self.video_url = video_url
        self.thumbnail_url = thumbnail_url

    def __repr__(self):
        return f"<Video: {self.title} {self.video_url} {self.thumbnail_url}>"
    
class User_saved_videos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"))
    video_id = db.Column(db.Integer, db.ForeignKey('video.id', ondelete="CASCADE"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", back_populates="videos")
    video = db.relationship("Video", back_populates="video_info")

class Video_transcript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id', ondelete="CASCADE"), unique=True, nullable=False)
    transcript = db.Column(JSONB, nullable=False)
    language = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    video = db.relationship("Video", back_populates="transcript")

class Flashcard_set(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"))
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", back_populates="flashcard_sets")
    flashcards = db.relationship("Flashcard", back_populates="flashcard_set", cascade="all, delete-orphan")

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    flashcard_set_id = db.Column(db.Integer, db.ForeignKey('flashcard_set.id', ondelete="CASCADE"))
    front_text = db.Column(db.String(255), nullable=False)
    back_text = db.Column(ARRAY(db.String), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    flashcard_set = db.relationship("Flashcard_set", back_populates="flashcards")