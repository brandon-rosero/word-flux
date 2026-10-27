import os
import sys
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import db, User, Video, User_saved_videos, Video_transcript, User_video_interaction
from api import app
from baseline import get_data, assign_weights, construct_transcript_strings, give_scores, recall_at_k

def get_vectors(transcripts):
    # create a numerical representation of each video based on it's words
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(transcripts)
    return tfidf_matrix, vectorizer

def get_labels(videos, user_interaction_result):
    interacted_video_labels = []
    interacted_videos = set()

    for interaction in user_interaction_result: 
        interacted_videos.add(interaction[1])

    for video in videos:
        if video.id in interacted_videos:
            #interacted_video_labels.append((video.id, 1))
            interacted_video_labels.append(1)
        else:
            #interacted_video_labels.append((video.id, 0))
            interacted_video_labels.append(0)

    return interacted_video_labels, interacted_videos

def get_recommendations(user_id):
    video_transcripts, user_interaction_result, videos = get_data(user_id)
    index_to_video = { index: video.id for index, video in enumerate(videos) }
    transcripts = construct_transcript_strings(video_transcripts)
    X, vectorizer = get_vectors(transcripts)
    y, interacted_videos = get_labels(videos, user_interaction_result)

    # x_train is tf-idf vectors, y_train is 1/0 interaction labels
    X_train, X_test, y_train, y_test, videos_train, videos_test = train_test_split(
        X, y,
        videos,
        test_size=0.3,
        random_state=42
    )

    # print("X_train:", X_train.shape)
    # print("X_test:", X_test.shape)
    # print("y_train:", len(y_train))
    # print("y_test:", len(y_test))
    # print("Training labels:", set(y_train))

    model = LogisticRegression()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    # filters out interacted videos from all videos
    candidate_transcripts = [ video for video in video_transcripts if video.id not in interacted_videos ]
    c_transcripts = construct_transcript_strings(candidate_transcripts)

    X_candidates = vectorizer.transform(c_transcripts)
    probabilities = model.predict_proba(X_candidates)[:, 1]
    ranked_indices = np.argsort(probabilities)[::-1]
    ranked_videos = [
        {
            "video_id": candidate_transcripts[i].id,
            "probability": probabilities[i]
        }
        for i in ranked_indices
    ]
    print(ranked_videos)

    # print("Probabilities:", probabilities)
    # print("Predictions:", predictions)
    # print("Accuracy:", accuracy_score(y_test, predictions))
    # print(classification_report(y_test, predictions, zero_division=0))

def evaluate(user_id):
    video_transcripts, user_interaction_result, videos = get_data(user_id)
    transcripts = construct_transcript_strings(video_transcripts)
    X, vectorizer = get_vectors(transcripts)
    y, interacted_videos = get_labels(videos, user_interaction_result)

    # x_train is tf-idf vectors, y_train is 1/0 interaction labels
    X_train, X_test, y_train, y_test, videos_train, videos_test = train_test_split(
        X, y,
        videos,
        test_size=0.3,
        random_state=42
    )

    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Makes sure interacted videos in the test split are not in interacted_videos. 
    # This is so that the ranked videos could actually have the interacted videos that were within the test split
    # for proper evaluation.
    videos_test_ids = [ v.id for v in videos_test ]
    interacted_videos = [ i_v for i_v in interacted_videos if i_v not in videos_test_ids ]
    print(interacted_videos)

    # filters out interacted videos from all videos
    candidate_transcripts = [ video for video in video_transcripts if video.id not in interacted_videos ]
    c_transcripts = construct_transcript_strings(candidate_transcripts)

    X_candidates = vectorizer.transform(c_transcripts)
    probabilities = model.predict_proba(X_candidates)[:, 1]
    ranked_indices = np.argsort(probabilities)[::-1]
    ranked_videos = [ (candidate_transcripts[i].id, probabilities[i]) for i in ranked_indices ] 

    relevant_video_ids = [ video.id for video, label in zip(videos_test, y_test) if label == 1 ]

    score = recall_at_k(ranked_videos, relevant_video_ids, 5)
    print(score)

if __name__ == "__main__":
    with app.app_context():
        #get_recommendations(46)
        evaluate(46)