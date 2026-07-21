import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  getTasks(){
    return this.http.get<any[]>('http://localhost:8080/tasks')
  }
  addTask(task: any){
    return this.http.post<any[]>('http://localhost:8080/tasks', task);
  }
  updateTask(taskId: number, task: any){
    return this.http.put<any>('http://localhost:8080/tasks/' + taskId, task);
  }
  deleteTask(task: any){
    return this.http.delete<any[]>('http://localhost:8080/tasks', { body: task });
  }
  getUsers(){
    return this.http.get<any[]>('http://localhost:8080/users');
  }
  getStatuses(){
    return this.http.get<any[]>('http://localhost:8080/statuses');
  }
}
