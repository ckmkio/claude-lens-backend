import * as fs from 'fs';
import * as path from 'path';

interface Config {
  timezone: string | null;
  schedule: string[];
}

class ConfigService {
  private configPath: string;
  private config!: Config;

  constructor() {
    this.configPath = path.join(__dirname, '../config/default.json');
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      if (!fs.existsSync(this.configPath)) {
        this.createDefaultConfig();
      }
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error('Error loading config:', error);
      this.createDefaultConfig();
    }
  }

  private createDefaultConfig(): void {
    const defaultConfig: Config = {
      timezone: null,
      schedule: ['0 6 * * *']
    };
    
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2));
    this.config = defaultConfig;
  }

  private saveConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration');
    }
  }

  getConfig(): Config {
    return { ...this.config };
  }

  getTimezone(): string {
    return this.config.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  setTimezone(timezone: string | null): void {
    this.config.timezone = timezone;
    this.saveConfig();
  }

  getSchedules(): string[] {
    return [...this.config.schedule];
  }

  addSchedule(cronExpression: string): void {
    if (!this.isValidCronExpression(cronExpression)) {
      throw new Error('Invalid cron expression');
    }
    
    if (!this.config.schedule.includes(cronExpression)) {
      this.config.schedule.push(cronExpression);
      this.saveConfig();
    }
  }

  removeSchedule(cronExpression: string): void {
    const index = this.config.schedule.indexOf(cronExpression);
    if (index > -1) {
      this.config.schedule.splice(index, 1);
      this.saveConfig();
    }
  }

  clearSchedules(): void {
    this.config.schedule = [];
    this.saveConfig();
  }

  private isValidCronExpression(expression: string): boolean {
    const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    return cronRegex.test(expression.trim());
  }
}

export default new ConfigService();