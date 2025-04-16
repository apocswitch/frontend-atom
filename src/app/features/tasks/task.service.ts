import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, map, Observable } from "rxjs";
import { Task } from "./task.model";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = "https://us-central1-task-manager-atom.cloudfunctions.net/api/tasks";
  //private baseUrl = "http://127.0.0.1:5001/task-manager-atom/us-central1/api/tasks";

  tasks = signal<Task[]>([]);
  loading = signal(false);

  async loadTasks(userId: string): Promise<void> {
    this.loading.set(true);
    try {
      const data = await lastValueFrom(this.http.get<Task[]>(`${this.baseUrl}/${userId}`));
      this.tasks.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  createTask(task: Omit<Task, "id" | "createdAt">): Observable<Task> {
    return this.http.post<{ id: string }>(this.baseUrl, task).pipe(
      map((result) => {
        const newTask: Task = {
          ...task,
          id: result.id,
          createdAt: new Date().toISOString()
        };
          return newTask;
      })
    );
  }

  async updateTask(id: string, updated: Partial<Task>): Promise<void> {
    await lastValueFrom(this.http.put(`${this.baseUrl}/${id}`, updated));
    this.tasks.update((t) =>
      t.map((task) => (task.id === id ? { ...task, ...updated } : task))
    );
  }

  async deleteTask(id: string): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
    this.tasks.update((t) => t.filter((task) => task.id !== id));
  }
}
