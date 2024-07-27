import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, TypeORMError } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) { }
  async create(createTaskDto: CreateTaskDto): Promise<{ success: boolean, message?: string, task?: Task }> {
    try {

      const taskSaved = await this.taskRepository.save(createTaskDto);

      if (!taskSaved) {
        return { success: false, message: 'No se pudo guardar la tarea' };
      }
      return { success: true, task: taskSaved };

    } catch (error) {
      return { success: false, message: error };
    }
  }

  async findAll(): Promise<{ success: boolean; message: string; task?: Task[] }> {
    try {
      const task = await this.taskRepository.find({ withDeleted: true });
      if (task.length === 0) {
        return { success: false, message: 'No se encontraron tareas' };
      }
      return { success: true, message: 'Tareas encontradas', task };

    } catch (error) {
      let errorMessage = 'Ocurrió un error al buscar tareas';
      if (error instanceof TypeORMError) {
        errorMessage = `Error de TypeORM: ${error.message}`;
      }
      return { success: false, message: errorMessage };
    }
  }

  async findOne(id: number): Promise<{ success: boolean; message: string; task?: Task }> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        return { success: false, message: 'Tarea no encontrada' };
      }
      return { success: true, message: 'Tarea encontrada', task };

    } catch (error) {
      let errorMessage = 'Ocur   un error al buscar tareas';
      if (error instanceof TypeORMError) {
        errorMessage = `Error de TypeORM: ${error.message}`;
      }
      return { success: false, message: errorMessage };
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<{ success: boolean; message: string; task?: Task }> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        return { success: false, message: 'Tarea no encontrada' };
      }
      const taskUpdated = await this.taskRepository.update({ id }, updateTaskDto);
      if (!taskUpdated) {
        return { success: false, message: 'No se pudo actualizar la tarea' };
      }
      return { success: true, message: 'Tarea actualizada', task };

    } catch (error) {
      let errorMessage = 'Ocurrió un error al actualizar la tarea';
      if (error instanceof TypeORMError) {
        errorMessage = `Error de TypeORM: ${error.message}`;
      }
      return { success: false, message: errorMessage };
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        return { success: false, message: 'Tarea no encontrada' };
      }
      const taskDeleted = await this.taskRepository.softDelete({ id });
      if (!taskDeleted) {
        return { success: false, message: 'No se pudo eliminar la tarea' };
      }
      return { success: true, message: 'Tarea eliminada' };

    } catch (error) {
      let errorMessage = 'Ocurrió un error al eliminar la tarea';
      if (error instanceof TypeORMError) {
        errorMessage = `Error de TypeORM: ${error.message}`;
      }
      return { success: false, message: errorMessage };
    }
  }
}
