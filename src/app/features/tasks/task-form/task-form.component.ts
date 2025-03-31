import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() cancelForm = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private taskService = inject(TaskService);

  constructor(private snackBar: MatSnackBar) {}
  
  loading = false;

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['']
  });

  showSuccess() {
    this.snackBar.open('Tarea creada correctamente', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top', // 👈 Esto la muestra arriba
      horizontalPosition: 'center', // Opcional: left | right | center
    });
  }

  async onSubmit() {
  if (this.form.valid) {
    this.loading = true;
    const newTask = {
      ...this.form.value,
      userId: this.auth.getCurrentUser()?.id,
      createdAt: new Date().toISOString(),
    };

    try {
      await firstValueFrom(await this.taskService.createTask(newTask));
      this.taskCreated.emit(newTask);
      this.form.reset();
      this.showSuccess();
    } catch (err) {
      console.error("Error al crear la tarea:", err);
    } finally {
      this.loading = false;
    }
  }
}

cancel() {
  this.cancelForm.emit(); // ← Emitimos al padre
}
}
