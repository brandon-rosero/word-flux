from flask import jsonify
import nltk
import sys
import os
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import db, User, Video, User_saved_videos, Video_transcript, User_video_interaction
from api import app

weights = {
    "view": 1,
    "word_click": 2,
    "watch": 3,
    "saved_flashcard": 4,
    "saved_video": 5
}

def recall_at_k(recommended, relevant, k):
    # isolate video_id from tuple to prep for set intersection
    recommended = [tuple[0] for tuple in recommended]

    top_k_rec = set(recommended[:k])
    relevant_set = set(relevant)

    print(top_k_rec)
    print(relevant_set)
    
    intersection = top_k_rec.intersection(relevant_set)
    return len(intersection) / len(relevant_set)


def get_data(user_id):
    video_transcripts = (
        db.session.query(
            Video.id,
            Video_transcript.transcript,
            Video_transcript.language, 
        )
        .join(Video_transcript, Video.id == Video_transcript.video_id)
        .all()          
    )

    user_interaction_result = (
        db.session.query(
            User.id,
            Video.id,
            User_video_interaction.id,
            User_video_interaction.interaction_type,
            User_saved_videos.video_id
        )
        .join(User_video_interaction, User_video_interaction.user_id == User.id)
        .join(Video, User_video_interaction.video_id == Video.id)
        .join(User_saved_videos, User_saved_videos.user_id == User.id)
        .filter(User.id == user_id)
        .all()          
    )

    videos = Video.query.all()

    return video_transcripts, user_interaction_result, videos

def assign_weights(user_interaction_result, weights):
    user_interaction_weights = []
    seen = set()
    interacted_videos = set()
    for interaction in user_interaction_result:
        if interaction[3] == 'view':
            user_interaction_weights.append((interaction[1], weights["view"]))
        elif interaction[3] == 'watch':
            user_interaction_weights.append((interaction[1], weights["watch"]))
        # checking if video is saved
        if interaction[1] == interaction[4]:
            value = interaction[4]
            if value not in seen:
                seen.add(interaction[4])
                user_interaction_weights.append((interaction[1], weights["saved_video"]))
        interacted_videos.add(interaction[1])

    return user_interaction_weights, list(interacted_videos)

def construct_transcript_strings(video_transcripts):
    transcripts = []
    for video in video_transcripts:
        raw_transcript = video[1]
        transcript_string = ""
        for word in raw_transcript:
            transcript_string += word["word"] + " "

        transcripts.append(transcript_string)

    return transcripts

def give_scores(transcripts, user_interaction_weights, index_to_video):
    # create a numerical representation of each video based on it's words
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(transcripts)
    video_scores = []
    # calculate similarity between the videos
    similarity = cosine_similarity(tfidf_matrix)

    for row in similarity:
        score = 0
        for i, value in enumerate(row):
            for weights in user_interaction_weights:
                if index_to_video[i] == weights[0]:
                    score += weights[1] * value       
        video_scores.append(score)

    return video_scores

def get_recommendations(user_id):

    video_transcripts, user_interaction_result, videos = get_data(user_id)
    
    index_to_video = { index: video.id for index, video in enumerate(videos) }

    user_interaction_weights, interacted_videos = assign_weights(user_interaction_result, weights)

    transcripts = construct_transcript_strings(video_transcripts)
   

    result = give_scores(transcripts, user_interaction_weights, index_to_video)

    video_scores = []
    for i in range(len(result)):
        video_scores.append((index_to_video[i], result[i]))
    video_scores = [score for score in video_scores if score[0] not in interacted_videos]
    video_scores.sort(key=lambda x: x[1], reverse=True)

    recommendations = video_scores[:5]
    print(recommendations)

def evaluate(user_id, training_percentage):
    video_transcripts, user_interaction_result, videos = get_data(user_id)

    index_to_video = { index: video.id for index, video in enumerate(videos) }

    user_interaction_weights, interacted_videos = assign_weights(user_interaction_result, weights)

    split = int(len(interacted_videos) * training_percentage)
    training = interacted_videos[:split]
    testing = interacted_videos[split:]
    print(training)
    print(testing)

    # get rid of the testing elements within the elements that will be given similarity scores
    user_interaction_weights = [weight for weight in user_interaction_weights if weight[0] not in testing]

    transcripts = construct_transcript_strings(video_transcripts)

    result = give_scores(transcripts, user_interaction_weights, index_to_video)

    video_scores = []
    for i in range(len(result)):
        video_scores.append((index_to_video[i], result[i]))
    # filter out the user's interacted videos so that they don't get recommended
    video_scores = [score for score in video_scores if score[0] not in training]
    video_scores.sort(key=lambda x: x[1], reverse=True)
    score = recall_at_k(video_scores, testing, k=10)
    print(score)

if __name__ == "__main__":
    with app.app_context():
        #get_recommendations(46)
        evaluate(45, 0.7)