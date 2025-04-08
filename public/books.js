async function fetchBooks() {
    try {
        const response = await fetch('/books');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        console.log('Books:', books);
        // You can now use the books data as needed
        document.getElementById('book-list').innerHTML = books.map(book => `<li>${book.title} by ${book.author}</li>`).join('');
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Call the function to fetch books
fetchBooks();