import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks-service';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-homepage',
  imports: [TaskModalComponent, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  private taskService = inject(TasksService);
  allTasks = signal<any[]>([]);
  users = signal<any[]>([]);
  statuses = signal<any[]>([]);

  showModal = false;
  editingTask: any = null;

  
  filterSubject = signal('');
  filterAssignedTo = signal('');
  filterStatus = signal('');
  filterDueDate = signal('');

 
  taskUsernames = signal<string[]>([]);
  taskStatuses = signal<string[]>([]);

  
  filteredTasks = computed(() => {
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
    this.loadTasks();
    this.taskService.getUsers().subscribe((res) => {
      this.users.set(res);
    });
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses.set(res);
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((res) => {
      this.setTasks(res);
    });
  }

  private setTasks(tasks: any[]) {
    this.allTasks.set(tasks);
    const uniqueStatuses = [...new Set(tasks.map((t: any) => t.status).filter(Boolean))];
    this.taskStatuses.set(uniqueStatuses as string[]);
    const uniqueUsers = [...new Set(tasks.map((t: any) => t.username).filter(Boolean))];
    this.taskUsernames.set(uniqueUsers as string[]);
  }

  openAddModal() {
    this.editingTask = null;
    this.showModal = true;
  }

  openEditModal(task: any) {
    this.editingTask = { ...task };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingTask = null;
  }

  onSaveTask(taskData: any) {
    if (taskData.id) {
      this.taskService.updateTask(taskData.id, taskData).subscribe(() => {
        this.loadTasks();
        this.closeModal();
      });
    } else {
      this.taskService.addTask(taskData).subscribe((res) => {
        this.setTasks(res);
        this.closeModal();
      });
    }
  }

  deleteTask(task: any) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task).subscribe((res) => {
        this.setTasks(res);
      });
    }
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
