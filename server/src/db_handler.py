from dotenv import load_dotenv
import os
from pinecone import Pinecone
from pinecone import ServerlessSpec 
from langchain_pinecone import PineconeVectorStore
from embedding_handler import get_embeddings
from text_handler import load_pdf_files, filter_to_minimal_docs, text_split

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY


pinecone_api_key = PINECONE_API_KEY
pc = Pinecone(api_key=pinecone_api_key)


# load data

extracted_data = load_pdf_files(data='_path_')
filter_data = filter_to_minimal_docs(extracted_data)

text_chunks = text_split()


# create vectors

index_name = "careai"

if not pc.has_index(index_name):
    pc.create_index(
        name = index_name,
        dimension=384, 
        metric= "cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(index_name)


# Model Loading

Model = get_embeddings()

class SentenceTransformerEmbeddings:
    def __init__(self, model):
        self.model = model

    def embed_documents(self, texts):
        embeddings = self.model.encode(texts, show_progress_bar=False)
        return [e.tolist() for e in embeddings]  

    def embed_query(self, text):
        embedding = self.model.encode(text, show_progress_bar=False)
        return embedding.tolist() 

embedding_tool = SentenceTransformerEmbeddings(Model)


# update vectors

docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embedding_tool
)

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embedding_tool
)