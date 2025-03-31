import { Component, inject, signal, computed, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskService } from "../task.service";
import { Task } from "../task.model";
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import {
  trigger,
  transition,
  style,
  animate,
} from "@angular/animations";
import { TaskItemComponent } from "../task-item/task-item.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFormComponent } from "../task-form/task-form.component";
import { MathCeilPipe } from "../../../shared/pipes/math-ceil.pipe";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    TaskItemComponent,
    HeaderComponent,
    TaskFormComponent,
    MathCeilPipe,
    FormsModule
  ],
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms ease-in", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TaskListComponent {
  private service = inject(TaskService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  tasks = this.service.tasks;
  loading = this.service.loading;
  selectedTaskId: string | null = null;
  showAddForm = false;
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm = "";

  // Simulamos un usuario actual simple (luego se mejora con Auth real)
  userId = localStorage.getItem("userId") || "default-user";

  taskForm = this.fb.group({
    title: ["", Validators.required],
    description: [""],
  });

  constructor(private snackbar: MatSnackBar) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.service.loadTasks(user.id);
    }
    // this.service.loadTasks(this.userId);
  }

  addTask(): void {
    if (this.taskForm.invalid) return;

    const { title, description } = this.taskForm.value;
    this.service.createTask({
      title: title!,
      description: description || "",
      completed: false,
      userId: this.userId,
    });

    this.taskForm.reset();
  }

  updateTask(task: Task) {
    this.service.updateTask(task.id, task).then(() => {
      // Opcional: mostrar snackbar o mensaje de éxito
    });
  }

  toggleStatus(task: Task): void {
    this.service.updateTask(task.id, { completed: !task.completed });
  }

  async deleteTask(id: string) {
    await this.service.deleteTask(id);
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  logout(): void {
    this.auth.logout(); // Llama al servicio, que limpia todo
    this.router.navigateByUrl("/login");
  }

  onEdit(taskId: string) {
    this.selectedTaskId = taskId;
  }

  onCloseEdit() {
    this.selectedTaskId = null;
  }

  trackById = (index: number, task: Task) => task.id;

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onTaskAdded(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
    this.showAddForm = false;
    this.snackbar.open('Tarea agregada exitosamente', 'Cerrar', {
      duration: 3000
    });
  }

  get filteredTasks(): Task[] {
    const term = this.searchTerm.toLowerCase();
    return this.tasks().filter(task =>
      task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term)
    );
  }
  
  paginatedTasks(): Task[] {
    const filtered = this.filteredTasks;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    const maxPages = Math.ceil(this.tasks().length / this.itemsPerPage);
    if (this.currentPage < maxPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
