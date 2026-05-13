import os
import requests
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import BaseMessage
from prompt_handler import system_prompt
from huggingface_hub import InferenceClient


# ENVIRONMENT SETUP 

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")


# LOCAL/ONLINE EMBEDDING MODEL

local_model = InferenceClient(
    "sentence-transformers/all-MiniLM-L6-v2",
    token=HF_API_KEY
)

class SentenceTransformerEmbeddings:
    def __init__(self, model):
        self.model = model

    def embed_documents(self, texts):
        embeddings = [self.model.feature_extraction(t) for t in texts]
        processed = []
        for e in embeddings:
            if isinstance(e, list) and len(e) == 1:
                e = e[0]
            if hasattr(e, "tolist"):
                e = e.tolist()
            processed.append(e)
        return processed

    def embed_query(self, text):
        embedding = self.model.feature_extraction(text)
        if isinstance(embedding, list) and len(embedding) == 1:
            embedding = embedding[0]
        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()
        return embedding

    async def aembed_documents(self, texts):
        return self.embed_documents(texts)

    async def aembed_query(self, text):
        return self.embed_query(text)

embedding_tool = SentenceTransformerEmbeddings(local_model)

# PINECONE RETRIEVER

index_name = "careai"
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embedding_tool
)

retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)


# HUGGING FACE CHAT

HF_MODEL = "HuggingFaceH4/zephyr-7b-beta"
chat_client = InferenceClient(model=HF_MODEL, token=HF_API_KEY)

def ask_huggingface(prompt: str, model=HF_MODEL, max_tokens=500) -> str:
    """ Send prompt to Hugging Face Chat API. """

    # Convert LangChain's prompt objects to string
    if not isinstance(prompt, str):
        try:
            prompt = prompt.to_string()
        except Exception:
            prompt = str(prompt)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt},
    ]

    try:
        response = chat_client.chat_completion(messages=messages, max_tokens=max_tokens)
        return response.choices[0].message.content
    except Exception as e:
        return f"Error calling Hugging Face API: {e}"


# CHAT MODEL WRAPPER 

class HuggingFaceChat:
    def __init__(self, model=HF_MODEL):
        self.model = model

    def __call__(self, prompt, stop=None):
        try:
            if hasattr(prompt, "to_string"):
                prompt_text = prompt.to_string()
            elif isinstance(prompt, BaseMessage):
                prompt_text = prompt.content
            else:
                prompt_text = str(prompt)
        except Exception:
            prompt_text = str(prompt)

        return ask_huggingface(prompt_text, model=self.model)


chatModel = HuggingFaceChat()


# PROMPT TEMPLATE 

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])


# RAG CHAIN

question_answer_chain = create_stuff_documents_chain(chatModel, prompt_template)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
