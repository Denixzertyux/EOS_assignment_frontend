import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks-service';

@Component({
  selector: 'app-my-tasks',
  imports: [FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css',
})
export class MyTasksComponent implements OnInit {
  private taskService = inject(TasksService);

  allTasks = signal<any[]>([]);
  statuses = signal<string[]>([]);
  users = signal<string[]>([]);

  
  filterSubject = signal('');
  filterAssignedTo = signal('');
  filterStatus = signal('');
  filterDueDate = signal('');


  tasks = computed(() => {
    let result = this.allTasks();
    const subject = this.filterSubject().toLowerCase().trim();
    const assignedTo = this.filterAssignedTo();
    const status = this.filterStatus();
    const dueDate = this.filterDueDate();

    if (subject) {
      result = result.filter(t =>
        (t.content || '').toLowerCase().includes(subject)
      );
    }
    if (assignedTo) {
      result = result.filter(t => t.username === assignedTo);
    }
    if (status) {
      result = result.filter(t => t.status === status);
    }
    if (dueDate) {
      result = result.filter(t =>
        t.dueDate && t.dueDate.substring(0, 10) === dueDate
      );
    }
    return result;
  });

  ngOnInit() {
    const userData = localStorage.getItem('user');
    const loggedInUserId = userData ? JSON.parse(userData).userId : null;

    this.taskService.getTasks().subscribe((res) => {
      // Only keep tasks belonging to the logged-in user
      const myTasks = loggedInUserId != null
        ? res.filter((t: any) => t.userId === loggedInUserId)
        : res;

      this.allTasks.set(myTasks);

      // Extract unique statuses from the user's tasks
      const uniqueStatuses = [...new Set(myTasks.map((t: any) => t.status).filter(Boolean))];
      this.statuses.set(uniqueStatuses as string[]);

      // Extract unique usernames from the user's tasks
      const uniqueUsers = [...new Set(myTasks.map((t: any) => t.username).filter(Boolean))];
      this.users.set(uniqueUsers as string[]);
    });
  }

  clearFilters(): void {
    this.filterSubject.set('');
    this.filterAssignedTo.set('');
    this.filterStatus.set('');
    this.filterDueDate.set('');
  }

  get hasActiveFilters(): boolean {
    return !!(this.filterSubject() || this.filterAssignedTo() || this.filterStatus() || this.filterDueDate());
  }
}
