import { getAllTasks } from "../services/tasks-service";
import { TaskList } from "../components/task-list";
import { CreateTaskForm } from "../components/create-task-form";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>

      <section className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add a Task</h2>
        <CreateTaskForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          All Tasks{" "}
          <span className="text-sm font-normal text-gray-500">({tasks.length})</span>
        </h2>
        <TaskList tasks={tasks} />
      </section>
    </main>
  );
}
