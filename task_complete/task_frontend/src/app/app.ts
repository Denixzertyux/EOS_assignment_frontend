import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('task-app');
  protected username: string | null = null;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUsername();
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateUsername();
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateUsername(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.username = user.username || null;
      } catch {
        this.username = null;
      }
    } else {
      this.username = null;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.username = null;
    this.router.navigate(['/login']);
  }
}
