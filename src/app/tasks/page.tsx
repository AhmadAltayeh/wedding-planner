import { listTasks } from "@/lib/actions/tasks";
import { PageHeader } from "@/components/ui";
import { TasksClient } from "@/components/tasks-client";

export default async function TasksPage() {
  const tasks = await listTasks();
  return (
    <div>
      <PageHeader title="Checklist" subtitle="Jordan wedding to-dos — court, venue, zaffe & more" />
      <TasksClient tasks={tasks} />
    </div>
  );
}
