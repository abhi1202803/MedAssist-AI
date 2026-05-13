### ☐ medirag Assistant
medirag is a medical assistant that leverages Large Language Models (LLMs) and Vector Databases to deliver context-aware, evidence-based medical insights. It processes trusted medical literature, generates semantic embeddings, and retrieves the most relevant information using similarity search. The system provides safe, concise, and professional explanations to user health queries, ensuring reliable medical understanding through an efficient pipeline of data extraction, embedding, and LLM inference.

<p align="center">
  <img src="/public/test.png" alt="System Architecture" height="540">
</p>

### ☐ Toolkit
- **Frontend**: Next.js 16, React.js, TailwindCSS, Framer Motion, TypeScript
- **Backend**: Python 3.11+, FastAPI, LangChain, RAG, Hugging Face (LLMs)
- **Database**: Pinecone Vector
- **Tools/Version**: Git, MCP

### ☐ Procedure
- User enters a Query through the web interface.
- Generates a vector embedding(MiniLM L6) for each query to enable semantic search.
  
<p align="center">
  <img src="/public/Screenshot 2025-10-30 143028.png" alt="System Architecture" height="200">
</p>

- Server fetches similar medical contexts from the Vector DB using the query embedding.

<p align="center">
  <img src="/public/Screenshot 2025-10-30 143220.png" alt="System Architecture" height="160">
</p>

- LLMs uses the retrieved context to generate an accurate, concise, and evidence-based medical response.
- Then output is structured using filter.ts(run algorithms) and converted into HTML.
- The response is displayed to the user on a responsive Next.js UI

### ☐ Vector DB
Stores medical text embeddings in a Vector Database (Pinecone) for fast semantic search and context retrieval.

<p align="center">
  <img src="/public/Screenshot 2025-10-30 151307.png" alt="System Architecture" height="400">
</p>

### ☐ Project Structure
``` Java
    medirag/
    ├── app/                             
    │   ├── components/                
    │   │   └── ...tsx
    │   ├── styles/                     
    │   │   └── ...css
    │   ├── utils/                      
    │   │   └── ...ts
    │   ├── layout.tsx                   
    │   └── page.tsx            
    ├── public/
    ├── data/                            
    │   └── ...pdf                   
    ├── server/
    │   ├── model/
    │   │   └── ...ipynb                 
    │   ├── src/
    │   │   ├── routes/
    │   │   │   ├── __init__.py
    │   │   │   └── ...py
    │   │   ├── utils/
    │   │   │   └── ...py
    │   │   ├── __init__.py
    │   │   ├── db_handler.py
    │   │   ├── embedding_handler.py
    │   │   ├── gpt_handler.py
    │   │   ├── prompt_handler.py
    │   │   └── text_handler.py
    │   ├── main.py
    │   ├── requirements.txt
    │   ├── setup.py
    │   └── template.sh           
    ├── .gitignore
    ├── package.json
    ├── eslint.config.mjs
    ├── next.config.js
    ├── tailwind.config.js
    └── README.md
```


### ☐ Installation
#### 1. Clone the repository
```bash
  git clone https://github.com/abhi1202803/MedAssist-AI.git
  cd MedAssist-AI
```

#### 2. Frontend setup (Next.js 16)
```bash
  cd app
  npm install       # Install Dependencies
  npm run dev       # Run Server
```
Run at http://localhost:3000

#### 3. Backend setup (FastAPI)
```bash
  cd ../server
  python -m venv venv         # Create virtual environment
  source venv/bin/activate     # Linux/macOS
  # OR
  venv\Scripts\activate        # Windows
  
  pip install -r requirements.txt  # Install Dependencies
  uvicorn main:app --reload        # Run Server
```
Run at http://localhost:8000

#### 4. Environment Variables
.env file in server:
```bash
  HF_API_KEY = "your_huggingface_api_key"
  PINECONE_API_KEY ="your_pinecone_api_key"
```

### ☐ Contributing
Open to contributions!
- Fork the repository  
- Create a new branch (`git checkout -b feature-name`)  
- Commit your changes (`git commit -m 'Add feature'`)  
- Push to the branch (`git push origin feature-name`)  
- Create a Pull Request
