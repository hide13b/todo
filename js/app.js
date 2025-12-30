// To-Do アプリケーション
class TodoApp {
    constructor() {
        // DOM要素の取得
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.totalCount = document.getElementById('total-count');
        this.activeCount = document.getElementById('active-count');
        this.completedCount = document.getElementById('completed-count');

        // タスク配列
        this.todos = [];

        // イベントリスナーの設定
        this.setupEventListeners();

        // LocalStorageからデータを読み込み
        this.loadFromStorage();

        // 初期表示
        this.render();
    }

    // イベントリスナーの設定
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });
    }

    // タスクを追加
    addTodo() {
        const text = this.input.value.trim();

        if (!text) {
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.input.value = '';
        this.input.focus();

        this.saveToStorage();
        this.render();
    }

    // タスクを削除
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
    }

    // タスクの完了状態を切り替え
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // LocalStorageに保存
    saveToStorage() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('保存に失敗しました:', error);
        }
    }

    // LocalStorageから読み込み
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('todos');
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('読み込みに失敗しました:', error);
            this.todos = [];
        }
    }

    // 統計を更新
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;

        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }

    // 画面を再描画
    render() {
        // タスクリストをクリア
        this.todoList.innerHTML = '';

        // 空の状態を表示/非表示
        if (this.todos.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');

            // タスクを表示
            this.todos.forEach(todo => {
                const li = this.createTodoElement(todo);
                this.todoList.appendChild(li);
            });
        }

        // 統計を更新
        this.updateStats();
    }

    // タスク要素を作成
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        // チェックボックス
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        // タスクテキスト
        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        // 要素を組み立て
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        return li;
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
