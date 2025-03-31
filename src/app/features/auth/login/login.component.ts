import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component"; // ajusta si cambia el path

import {
  trigger,
  style,
  transition,
  animate,
} from "@angular/animations";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ConfirmDialogComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms ease-in", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  checkingSession = true;

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.router.navigateByUrl("/tasks");
    } else {
      this.checkingSession = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;
    const email = this.form.value.email!;

    try {
      const user = await this.auth.getUserByEmail(email);

      if (user) {
        this.auth.setCurrentUser(user);
        this.router.navigateByUrl("/tasks");
      } else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { email },
        });

        const shouldCreate = await dialogRef.afterClosed().toPromise();

        if (shouldCreate) {
          const newUser = await this.auth.createUser(email);
          this.auth.setCurrentUser(newUser);
          this.router.navigateByUrl("/tasks");
        }
      }
    } catch (err) {
      console.error("Error en login:", err);
      this.error = "Error al iniciar sesión";
    } finally {
      this.loading = false;
    }
  }
}
