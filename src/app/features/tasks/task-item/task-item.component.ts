import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { Task } from "../task.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-task-item",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: "./task-item.component.html",
  styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() update = new EventEmitter<Task>();
  @Input() editing = false;
  @Output() edit = new EventEmitter<void>();
  @Output() closeEdit = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();

  editMode = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: [this.task.title],
      description: [this.task.description],
      completed: [this.task.completed]
    });
  }

  onToggleComplete() {
    this.task.completed = !this.task.completed;
    //this.update.emit(this.task);
    this.update.emit({ ...this.task, completed: !this.task.completed });
  }

  startEdit() {
    this.editMode = true;
    this.edit.emit();
  }
  
  cancelEdit() {
    this.editMode = false;
    this.closeEdit.emit(); // 👈 Muy importante
  }
  
  onSave() {
    if (this.editForm.valid) {
      this.update.emit({ ...this.task, ...this.editForm.value });
      this.editMode = false;
      this.closeEdit.emit(); // 👈 También aquí
    }
  }

  deleteTask() {
    this.deleted.emit(this.task.id);
    this.snackBar.open('Tarea eliminada', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
