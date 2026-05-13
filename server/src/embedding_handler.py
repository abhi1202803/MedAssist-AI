from dotenv import load_dotenv
import os
import requests
from huggingface_hub import InferenceClient

load_dotenv()


HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"


# Online Hugging Face Model 

client = InferenceClient(
    "sentence-transformers/all-MiniLM-L6-v2",
    token=HF_API_KEY
)

# online model

def get_embeddings(texts):
    res = client.feature_extraction(texts)
    return res


# local model

'''
def get_local_model(model_path: str = r"D:\models\all-MiniLM-L6-v2") -> SentenceTransformer:
    """
        Loads a local SentenceTransformer model and returns it.
    """
    return SentenceTransformer(model_path)
'''