import * as cron from 'node-cron';
import { execSync } from 'child_process';
import configService from './configService';

class CronService {
  private tasks: cron.ScheduledTask[] = [];

  constructor() {}

  start() {
    this.stop(); // 停止現有的任務
    
    const timezone = configService.getTimezone();
    const schedules = configService.getSchedules();

    if (schedules.length === 0) {
      console.log('No schedules configured. Cron service not started.');
      return;
    }

    schedules.forEach((schedule, index) => {
      const task = cron.schedule(schedule, () => {
        this.executeClaudeCode(schedule);
      }, {
        timezone: timezone
      });
      
      this.tasks.push(task);
      console.log(`Cron job ${index + 1} started: "${schedule}" (${timezone})`);
    });

    console.log(`Total ${schedules.length} cron job(s) started with timezone: ${timezone}`);
  }

  stop() {
    if (this.tasks.length > 0) {
      this.tasks.forEach((task, index) => {
        task.stop();
        console.log(`Cron job ${index + 1} stopped`);
      });
      this.tasks = [];
    }
  }

  restart() {
    console.log('Restarting cron service with updated configuration...');
    this.start();
  }

  getStatus() {
    const timezone = configService.getTimezone();
    const schedules = configService.getSchedules();
    
    return {
      running: this.tasks.length > 0,
      taskCount: this.tasks.length,
      timezone: timezone,
      schedules: schedules
    };
  }

  private executeClaudeCode(schedule: string) {
    try {
      const timezone = configService.getTimezone();
      const timestamp = new Date().toISOString();
      const localTime = new Date().toLocaleString('en-US', { 
        timeZone: timezone,
        timeZoneName: 'short'
      });
      
      console.log(`[${timestamp}] (${localTime}) [Schedule: ${schedule}] Executing Claude Code...`);
      
      // Execute claude command with a simple message
      const command = 'claude "Reply Hello"';
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 30000 // 30 second timeout
      });
      
      console.log(`[${timestamp}] (${localTime}) [Schedule: ${schedule}] Claude Code output:`, output);
    } catch (error) {
      const timezone = configService.getTimezone();
      const timestamp = new Date().toISOString();
      const localTime = new Date().toLocaleString('en-US', { 
        timeZone: timezone,
        timeZoneName: 'short'
      });
      console.error(`[${timestamp}] (${localTime}) [Schedule: ${schedule}] Error executing Claude Code:`, error);
    }
  }
}

export default new CronService();