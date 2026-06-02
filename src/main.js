const SUPABASE_URL = 'https://jkpryieiyygvwoziajpg.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHJ5aWVpeXlndndvemlhanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MDU2ODMsImV4cCI6MjA5NTk4MTY4M30.ln_Y0945HrtDRJAbBwCQG2GiznGyKGTaRFPc3eo6VK8';


const articlesContainer = document.getElementById('articles-container');
const sortSelect = document.getElementById('sort-select');
const addArticleForm = document.getElementById('add-article-form');

async function fetchArticles() {
    const orderParam = sortSelect.value;
    const url = `${SUPABASE_URL}/rest/v1/article?select=*&order=${orderParam}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apiKey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }

        const data = await response.json();
        renderArticles(data);
    } catch (error) {
        console.error('Błąd pobierania artykułów:', error);
        articlesContainer.innerHTML = '<p class="text-center text-red-500">Nie udało się załadować artykułów. Sprawdź klucze API.</p>';
    }
}

function renderArticles(articles) {
    articlesContainer.innerHTML = ''; 

    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p class="text-center text-gray-500">Brak artykułów w bazie.</p>';
        return;
    }

    articles.forEach(article => {
        const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

        const articleDiv = document.createElement('div');
        
        articleDiv.className = 'bg-white p-6 rounded-none shadow-sm border border-gray-200 transition hover:shadow-md';
        
        articleDiv.innerHTML = `
            <h3 class="text-xl font-bold text-blue-800">${article.title}</h3>
            <h4 class="text-md text-gray-600 mb-3 italic">${article.subtitle || ''}</h4>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-4 border-b border-gray-100">
                <span class="mr-4">Autor: <span class="text-gray-700">${article.author || 'Nieznany'}</span></span> 
                <span>Dodano: <span class="text-gray-700">${formattedDate}</span></span>
            </div>
            <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">${article.content || 'Brak treści...'}</p>
        `;
        
        articlesContainer.appendChild(articleDiv);
    });
}


async function createNewArticle(event) {
    event.preventDefault(); 

    const newArticleData = {
        title: document.getElementById('title').value, // <--- Tego brakuje u Ciebie!
        subtitle: document.getElementById('subtitle').value,
        author: document.getElementById('author').value,
        content: document.getElementById('content').value
    };

    const createdAtInput = document.getElementById('created_at').value;
    if (createdAtInput) {
        newArticleData.created_at = new Date(createdAtInput).toISOString();
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/article`, {
            method: 'POST',
            headers: {
                'apiKey': API_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' 
            },
            body: JSON.stringify(newArticleData)
        });

        if (response.status !== 201) {
            throw new Error(`Błąd tworzenia artykułu: ${response.status}`);
        }

        addArticleForm.reset();
        fetchArticles();

    } catch (error) {
        console.error('Błąd podczas dodawania:', error);
        alert('Nie udało się dodać artykułu. Sprawdź, czy tytuł się nie powtarza (jeśli jest unikalny).');
    }
}

sortSelect.addEventListener('change', fetchArticles);
addArticleForm.addEventListener('submit', createNewArticle);

fetchArticles();