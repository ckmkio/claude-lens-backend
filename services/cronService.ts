import * as cron from 'node-cron';
import { execSync } from 'child_process';

class CronService {
  private task: cron.ScheduledTask | null = null;

  start() {
    // Schedule task to run every minute
    this.task = cron.schedule('* * * * *', () => {
      this.executeClaudeCode();
    });

    console.log('Cron job started: Claude Code execution every minute');
  }

  stop() {
    if (this.task) {
      this.task.stop();
      console.log('Cron job stopped');
    }
  }

  private executeClaudeCode() {
    try {
      console.log(`[${new Date().toISOString()}] Executing Claude Code...`);
      
      // Execute claude command with a simple message
      const command = 'claude "Hello from automated cron job!"';
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 30000 // 30 second timeout
      });
      
      console.log(`[${new Date().toISOString()}] Claude Code output:`, output);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error executing Claude Code:`, error);
    }
  }
}

export default new CronService();