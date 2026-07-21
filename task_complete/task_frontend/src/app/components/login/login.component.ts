import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService }  from '../../services/login-service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    isLoginMode: boolean = true;
    loginForm: FormGroup;
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder, 
        private loginService: LoginService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });

        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            birthDate: ['', [Validators.required]]
        });
    }

    switchMode(mode: 'login' | 'register'): void {
        this.isLoginMode = (mode === 'login');
    }

    onSubmit(): void {
        if (this.isLoginMode) {
            if (this.loginForm.valid) {
                const rawCredentials = this.loginForm.value;
                
                const credentialsPayload = {
                    ...rawCredentials,
                    email: btoa(rawCredentials.email),
                    password: btoa(rawCredentials.password)
                };
                
                this.loginService.login(credentialsPayload).subscribe({
                    next: (response) => {
                        console.log('Login successful!', response);
                        localStorage.setItem('user', JSON.stringify(response));
                        this.router.navigate(['/home']); 
                    },
                    error: (err) => {
                        console.error('Login failed:', err);
                        alert('Invalid email or password');
                    }
                });
            }
        } else {
            if (this.registerForm.valid) {
                const userPayload = this.registerForm.value;
                
                this.loginService.register(userPayload).subscribe({
                    next: (response) => {
                        console.log('Registration successful!', response);
                        alert('Account created! You can now log in.');
                        this.switchMode('login'); 
                    },
                    error: (err) => {
                        console.error('Registration failed:', err);
                        alert('Could not create account. Email or username might already exist.');
                    }
                });
            }
        }
    }
}