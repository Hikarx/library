function searchBooks() {
    const username = document.getElementById('borrower_name').value;
    const title = document.getElementById('book_name').value;
    const tbody = document.getElementById('borrow_info');

    fetch(`/borrow/all?username=${encodeURIComponent(username)}&title=${encodeURIComponent(title)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.borrowDate ? book.borrowDate : '无'}</td>
                    <td>${book.returnDate ? book.returnDate : '无'}</td>
                    <td>${book.isBorrowed ? '已借阅' : '待借阅'}</td>
                    <td>${book.username ? book.username : '无'}</td>
                    <td>
                        <button onclick="borrowBook('${book.title}')" ${book.isBorrowed === true ? 'disabled' : ''}>借阅</button>
                        <button onclick="returnBook('${book.title}')" ${book.isBorrowed !== true ? 'disabled' : ''}>归还</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', searchBooks);

    searchBooks();
});

// 借阅图书
function borrowBook(bookTitle) {
    const userId = localStorage.getItem('userId');
    fetch(`/borrow/${userId}/${encodeURIComponent(bookTitle)}`, {
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                alert('借阅成功');
                searchBooks();
            } else {
                alert('借阅失败');
            }
        })
        .catch(error => {
            console.error('发生错误:', error);
            alert('借阅过程中出错');
        });
}

// 归还图书
function returnBook(bookTitle) {
    const userId = localStorage.getItem('userId');
    fetch(`/borrow/return/${userId}/${encodeURIComponent(bookTitle)}`, {
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                alert('归还成功');
                searchBooks();
            } else {
                alert('归还失败');
            }
        })
        .catch(error => {
            console.error('发生错误:', error);
            alert('归还过程中出错');
        });
}