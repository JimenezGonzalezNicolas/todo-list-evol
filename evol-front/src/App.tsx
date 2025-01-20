import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TaskPage";
import Header from "./components/Header";
import CreateTask from "./components/NewTask";
import './index.css'

function App() {
  return (
      <BrowserRouter >
          <div className="App">
              <Header
                  title="Bienvenidos a EVOL Task"
                  subtitle="¡Administra tus tareas con facilidad!"
              />
              <Routes>
                  <Route path="/" element={<TasksPage />} />
                  <Route path="/new-task" element={<CreateTask />} />
              </Routes>
          </div>
      </BrowserRouter>
  );
}
export default App;
