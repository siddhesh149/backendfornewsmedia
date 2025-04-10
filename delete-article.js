const axios = require('axios');

// First, list all articles to help user
async function listArticles() {
  try {
    const response = await axios.get('http://localhost:5000/api/articles');
    console.log('\nAvailable articles:');
    response.data.forEach(article => {
      console.log(`- ${article.title} (slug: ${article.slug})`);
    });
    console.log('\n');
  } catch (error) {
    console.error('Could not fetch articles. Make sure the server is running (node server.js)');
    process.exit(1);
  }
}

// Get the article slug from command line argument
const slug = process.argv[2];

if (!slug) {
  console.error('Please provide an article slug to delete');
  console.log('Usage: node delete-article.js article-slug');
  listArticles();
  process.exit(1);
}

async function deleteArticle(slug) {
  try {
    // First check if server is running
    await axios.get('http://localhost:5000/api/articles').catch(() => {
      throw new Error('Server is not running. Please start the server with: node server.js');
    });

    const response = await axios.delete(`http://localhost:5000/api/articles/${slug}`);
    console.log('\nSuccess:', response.data.message);
    
    // Show remaining articles
    console.log('\nRemaining articles:');
    const remainingArticles = await axios.get('http://localhost:5000/api/articles');
    remainingArticles.data.forEach(article => {
      console.log(`- ${article.title}`);
    });
  } catch (error) {
    if (error.response) {
      console.error('\nError:', error.response.data.error);
    } else {
      console.error('\nError:', error.message);
    }
  }
}

deleteArticle(slug); 