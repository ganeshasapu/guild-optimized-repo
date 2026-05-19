import type { Task } from "@guild-optimized/db";

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No tasks yet. Create one to get started!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 p-3 border rounded-lg bg-white"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle?.(task.id, !task.completed)}
            className="h-4 w-4 cursor-pointer"
            aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          />
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium truncate ${
                task.completed ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-gray-500 truncate">{task.description}</p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700 text-sm shrink-0"
              aria-label={`Delete "${task.title}"`}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
