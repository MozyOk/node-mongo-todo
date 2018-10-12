new Vue({
  http: {
    root: '/'
  },
  el: '#todos',
  data: {
    todo: { __v: '', content: '', title: '', _id: '' },
    todos: []
  },
  created: function () {
    this.fetchTodos();
  },
  methods: {
    fetchTodos: function () {
      console.log('fetchTodos');
      this.$http.get('/todos').then(function (response) {
        this.todos = response.body;
      });
    },
    addTodo: function () {
      if (this.todo.title.trim()) {
        this.$http.put('/todo', this.todo).then(function (response) {
          this.todos.push(response.body);
        });
      }
    },
    editTodo: function (index, todo) {
      console.log('editTodo: ' + this.todos[index]._id);
      console.log('title: ' + todo.title);
      console.log('content: ' + todo.content);
      // this.todos.splice(index, 1);
      this.todo.title = 'hogehogera';
      this.todo.content = 'hogehogera';
      this.$http.delete('/todo/' + this.todos[index]._id).then(function (response) {
        this.todos.push(response.body);
      });
    },
    deleteTodo: function (index) {
      console.log('deleteTodo: ' + this.todos[index]._id);
      this.$http.delete('/todo/' + this.todos[index]._id).then(function (response) {
        this.todos.splice(index, 1);
      });
    }
  }
});