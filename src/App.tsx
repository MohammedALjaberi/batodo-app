import TodoList from "./Tasks/todo/TodoList";

function App() {
  return (
    <div className="container mx-auto max-w-md p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Todo App</h1>
      </header>
      <main>
        <TodoList />
      </main>
    </div>
  );
}

export default App;
