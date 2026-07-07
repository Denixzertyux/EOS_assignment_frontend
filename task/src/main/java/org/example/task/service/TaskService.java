package org.example.task.service;

import lombok.extern.slf4j.Slf4j;
import org.example.task.TaskNotFoundException;
import org.example.task.dto.TaskDTO;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class TaskService {
    private List<TaskDTO> tasks = new ArrayList<>();

    public List<TaskDTO> getTasks(){
        log.info("getTasks");
        return tasks;
    }

    public TaskDTO getTaskById(Long taskId) {
        for (TaskDTO task : tasks) {
            if (task.getId().equals(taskId)) {
                return task;
            }
        }
        throw new TaskNotFoundException("Task not found with id: " + taskId);
    }

    public TaskDTO changeTaskStatus(Long taskId){
        TaskDTO task = tasks.stream()
                .filter(t -> t.getId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));
        task.setStatus("COMPLETED");
        return task;
    }

    public List<TaskDTO> getLateTasks(LocalDateTime date){
        List<TaskDTO> lateTasks = new ArrayList<>();
        for(TaskDTO taskDTO : tasks){
            if (taskDTO.getDueDate().isBefore(date)) {
                lateTasks.add(taskDTO);
            }
        }
        return lateTasks;
    }


    public List<TaskDTO> addTask(TaskDTO task){
        TaskDTO builtTask = buildTaskDTO(task);
        tasks.add(builtTask);
        log.info("added Task {}", builtTask);
        return tasks;
    }

    public TaskDTO updateTask(Long taskId, TaskDTO updatedTask) {
        TaskDTO oldTask = tasks.stream()
                .filter(task -> task.getId().equals(taskId))
                .findFirst().orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));
        oldTask.setContent(updatedTask.getContent());
        oldTask.setStatus(updatedTask.getStatus());
        oldTask.setDueDate(updatedTask.getDueDate());
        return oldTask;
    }

    public List<TaskDTO> deleteTask(Long id){
        tasks.removeIf(task -> task.getId().equals(id));
        return tasks;
    }

    public void deleteAllTasks(){
        tasks.clear();
    }


    private TaskDTO buildTaskDTO(TaskDTO task){
        return TaskDTO.builder().
                id(task.getId()).
                content(task.getContent()).
                dueDate(task.getDueDate()).
                status(task.getStatus()).build();
    }
}
