package org.example.task.controller;

import org.example.task.dto.TaskDTO;
import org.example.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskDTO> getTasks(){
        return taskService.getTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/late")
    public ResponseEntity<List<TaskDTO>> getLateTasks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ResponseEntity.ok(taskService.getLateTasks(date));
    }

    @PostMapping
    public List<TaskDTO> addTask(@RequestBody TaskDTO task){
        return taskService.addTask(task);
    }

    @DeleteMapping
    public List<TaskDTO> deleteTask(@RequestBody TaskDTO task){
        return taskService.deleteTask(task.getId());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDTO> changeTaskStatus(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.changeTaskStatus(id));
    }

    @PutMapping("/{taskId}")
    public TaskDTO updateTask(@PathVariable Long taskId, @RequestBody TaskDTO task) {
        return taskService.updateTask(taskId, task);
    }

}
