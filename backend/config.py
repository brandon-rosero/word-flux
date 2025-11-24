import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://myuser:GreenFiretruck227!@localhost:5432/wordfluxdb"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
