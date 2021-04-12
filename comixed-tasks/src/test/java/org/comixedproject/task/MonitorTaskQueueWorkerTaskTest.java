/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

package org.comixedproject.task;

import static junit.framework.TestCase.*;
import static org.comixedproject.task.MonitorTaskQueueWorkerTask.IMPORT_COUNT_TOPIC;
import static org.comixedproject.task.MonitorTaskQueueWorkerTask.TASK_UPDATE_TARGET;

import java.util.ArrayList;
import java.util.List;
import org.comixedproject.model.state.messaging.ImportCountMessage;
import org.comixedproject.model.state.messaging.TaskCountMessage;
import org.comixedproject.model.tasks.Task;
import org.comixedproject.model.tasks.TaskType;
import org.comixedproject.task.adaptors.WorkerTaskAdaptor;
import org.comixedproject.task.encoders.WorkerTaskEncoder;
import org.comixedproject.task.runner.TaskManager;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RunWith(MockitoJUnitRunner.class)
public class MonitorTaskQueueWorkerTaskTest {
  private static final TaskType TEST_TASK_TYPE = TaskType.RESCAN_COMIC;
  private static final long TEST_TASK_COUNT = 97;
  private static final long TEST_ADD_COMIC_COUNT = 23L;
  private static final long TEST_PROCESS_COMIC_COUNT = 17L;

  @InjectMocks private MonitorTaskQueueWorkerTask monitorTaskQueueWorkerTask;
  @Mock private TaskManager taskManager;
  @Mock private WorkerTaskAdaptor workerTaskAdaptor;
  @Mock private WorkerTaskEncoder<?> workerTaskEncoder;
  @Mock private Task task;
  @Mock private WorkerTask workerTask;
  @Mock private SimpMessagingTemplate messagingTemplate;

  @Captor private ArgumentCaptor<Object> messageCaptor;

  private List<Task> taskList = new ArrayList<>();

  @Test
  public void testCreateDescription() {
    assertNotNull(monitorTaskQueueWorkerTask.getDescription());
  }

  @Test
  public void testAfterPropertiesSet() {
    Mockito.doNothing().when(taskManager).runTask(Mockito.any(WorkerTask.class));

    monitorTaskQueueWorkerTask.afterExecution();

    Mockito.verify(taskManager, Mockito.times(1)).runTask(monitorTaskQueueWorkerTask);
  }

  @Test
  public void testStartTaskNothingQueued() throws WorkerTaskException {
    Mockito.when(workerTaskAdaptor.getNextTask()).thenReturn(taskList);

    monitorTaskQueueWorkerTask.startTask();

    Mockito.verify(workerTaskAdaptor, Mockito.times(1)).getNextTask();
  }

  @Test(expected = WorkerTaskException.class)
  public void testStartTaskNoEncoder() throws WorkerTaskException, TaskException {
    taskList.add(task);

    Mockito.when(workerTaskAdaptor.getNextTask()).thenReturn(taskList);
    Mockito.when(task.getTaskType()).thenReturn(TEST_TASK_TYPE);
    Mockito.when(workerTaskAdaptor.getEncoder(Mockito.any(TaskType.class)))
        .thenThrow(TaskException.class);

    monitorTaskQueueWorkerTask.startTask();

    Mockito.verify(workerTaskAdaptor, Mockito.times(1)).getNextTask();
    Mockito.verify(task, Mockito.times(1)).getTaskType();
    Mockito.verify(workerTaskAdaptor, Mockito.times(1)).getEncoder(TEST_TASK_TYPE);
  }

  @Test
  public void testStartTask() throws WorkerTaskException, TaskException {
    for (int index = 0; index < 25; index++) taskList.add(task);

    Mockito.when(workerTaskAdaptor.getNextTask()).thenReturn(taskList);
    Mockito.when(task.getTaskType()).thenReturn(TEST_TASK_TYPE);
    Mockito.when(workerTaskAdaptor.getEncoder(Mockito.any(TaskType.class)))
        .thenReturn(workerTaskEncoder);
    Mockito.when(workerTaskEncoder.decode(Mockito.any(Task.class))).thenReturn(workerTask);
    Mockito.doNothing()
        .when(messagingTemplate)
        .convertAndSend(Mockito.anyString(), messageCaptor.capture());
    Mockito.when(workerTaskAdaptor.getTaskCount()).thenReturn(TEST_TASK_COUNT);
    Mockito.when(workerTaskAdaptor.getTaskCount(TaskType.ADD_COMIC))
        .thenReturn(TEST_ADD_COMIC_COUNT);
    Mockito.when(workerTaskAdaptor.getTaskCount(TaskType.PROCESS_COMIC))
        .thenReturn(TEST_PROCESS_COMIC_COUNT);

    monitorTaskQueueWorkerTask.startTask();

    assertFalse(messageCaptor.getAllValues().isEmpty());
    assertTrue(messageCaptor.getAllValues().contains(new TaskCountMessage(TEST_TASK_COUNT)));
    assertTrue(
        messageCaptor
            .getAllValues()
            .contains(new ImportCountMessage(TEST_ADD_COMIC_COUNT, TEST_PROCESS_COMIC_COUNT)));

    Mockito.verify(workerTaskAdaptor, Mockito.times(1)).getNextTask();
    Mockito.verify(task, Mockito.times(taskList.size())).getTaskType();
    Mockito.verify(workerTaskAdaptor, Mockito.times(taskList.size())).getEncoder(TEST_TASK_TYPE);
    Mockito.verify(workerTaskEncoder, Mockito.times(taskList.size())).decode(task);
    Mockito.verify(taskManager, Mockito.times(taskList.size())).runTask(workerTask, task);
    Mockito.verify(messagingTemplate, Mockito.times(1))
        .convertAndSend(TASK_UPDATE_TARGET, new TaskCountMessage(TEST_TASK_COUNT));
    Mockito.verify(messagingTemplate, Mockito.times(1))
        .convertAndSend(
            IMPORT_COUNT_TOPIC,
            new ImportCountMessage(TEST_ADD_COMIC_COUNT, TEST_PROCESS_COMIC_COUNT));
  }

  @Test
  public void testAfterExecution() {
    Mockito.doNothing().when(taskManager).runTask(Mockito.any(WorkerTask.class));

    monitorTaskQueueWorkerTask.afterExecution();

    Mockito.verify(taskManager, Mockito.times(1)).runTask(monitorTaskQueueWorkerTask);
  }
}