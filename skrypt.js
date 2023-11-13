class Todo {
  constructor() {
    this.tasks = [];
    this.editingIndex = null;
    this.searchPhrase = '';
    this.loadFromLocalStorage();
  }
  /* Metoda draw */
  draw() {
    const todoList = document.getElementById('myUL');
    if (todoList) {
      todoList.innerHTML = '';

      this.tasks.forEach((task, index) => {
        const listItem = document.createElement('div'); // Zmiana z <li> na <div>
        listItem.className = 'task-item'; // Dodanie klasy, aby łatwiej ukrywać elementy

        if (this.editingIndex === index) {
          listItem.innerHTML = `
            <input type="text" value="${task.text}" id="editInput_${index}" />
            <input type="date" value="${task.date}" id="editDateInput_${index}" />
            <button onclick="todo.saveEdit(${index})">Save</button>
          `;
        } else {
          const taskText = this.highlightSearchPhrase(task.text);

          if (!this.searchPhrase || task.text.toLowerCase().includes(this.searchPhrase.toLowerCase())) {
            listItem.innerHTML = `
              <span onclick="todo.startEdit(${index})">${taskText} - ${task.date}</span>
              <span class="close" onclick="todo.remove(${index})">✖</span>
            `;
          }
        }

        todoList.appendChild(listItem);
      });
    }

    this.saveToLocalStorage();
  }
  /* Funkcja dodaj element do listy */
  addTask(text, date) {
    if (this.validateTask(text, date)) {
      this.tasks.push({ text, date });
      this.draw();
    } else {
      alert('Nieprawidłowe dane dla nowego zadania.');
    }
  }
  /* Funkcja usuń element z listy */
  remove(index) {
    this.tasks.splice(index, 1);
    this.draw();
  }
  /* Funkcja edytuj element z listy */
  startEdit(index) {
    this.editingIndex = index;
    this.draw();

    const taskText = this.tasks[index].text;
    const taskDate = this.tasks[index].date;

    const editInput = document.getElementById(`editInput_${index}`);
    const editDateInput = document.getElementById(`editDateInput_${index}`);

    if (editInput && editDateInput) {
      editInput.value = taskText;
      editDateInput.value = taskDate;
    }
  }
  /* Funkcja zapisz edytowany element z listy */
  saveEdit(index) {
    const editInput = document.getElementById(`editInput_${index}`);
    const editDateInput = document.getElementById(`editDateInput_${index}`);

    if (editInput && editDateInput) {
      const newText = editInput.value.trim();
      const newDate = editDateInput.value;
      if (this.validateTask(newText, newDate)) {
        this.tasks[index].text = newText;
        this.tasks[index].date = newDate;
        this.editingIndex = null;
        this.draw();
      } else {
        alert('Nieprawidłowe dane dla edytowanego zadania.');
      }
    }
  }
  /* Funkcja waliduj element z listy (text wiecej niz 2 znaki, mniej niz 255) */
  validateTask(text, date) {
    const isTextValid = text.length >= 3 && text.length <= 255;
    const isDateValid = date === '' || new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);

    return isTextValid && isDateValid;
  }
  /* Funkcja wyszukaj (po wiecej niz 2 znakach) */
  search(phrase) {
    if (phrase.length >= 2) {
      this.searchPhrase = phrase;
      this.draw();
    } else {
      this.searchPhrase = '';
      this.draw();
    }
  }
  /* Funkcja podświetlająca wyszukiwane słowo */
  highlightSearchPhrase(text) {
    if (this.searchPhrase) {
      const regex = new RegExp(`(${this.searchPhrase})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } else {
      return text;
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.draw();
    }
  }
}

const todo = new Todo();

function newElement() {
  const taskInput = document.getElementById('textInput');
  const dateInput = document.getElementById('dateInput');

  const taskValue = taskInput.value.trim();
  const dateValue = dateInput.value;

  if (todo.validateTask(taskValue, dateValue)) {
    todo.addTask(taskValue, dateValue);
    taskInput.value = '';
    dateInput.value = '';
  } else {
    alert('Nieprawidłowe dane dla nowego zadania.');
  }
}

todo.draw();

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => todo.search(searchInput.value));
