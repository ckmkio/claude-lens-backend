#!/usr/bin/env ts-node

import configService from '../services/configService';

const args = process.argv.slice(2);
const command = args[0];

function showUsage() {
  console.log(`
用法: npx ts-node scripts/manage-config.ts <command> [options]

命令:
  show                    顯示目前配置
  set-timezone <tz>       設定時區 (例如: Asia/Taipei, America/New_York)
  reset-timezone          重設為系統時區
  add-schedule <cron>     新增排程 (例如: "0 9 * * *" 每天上午9點)
  remove-schedule <cron>  移除排程
  clear-schedules         清空所有排程
  list-schedules          顯示所有排程

時區範例:
  Asia/Taipei
  America/New_York  
  Europe/London
  UTC

排程範例 (Cron 格式):
  "0 9 * * *"      每天上午9點
  "30 14 * * 1-5"  週一到週五下午2:30
  "0 */6 * * *"    每6小時一次
  "0 0 1 * *"      每月1號午夜

注意: Cron 格式為 "分 時 日 月 星期"
  `);
}

function showConfig() {
  const config = configService.getConfig();
  const currentTimezone = configService.getTimezone();
  
  console.log('\n=== 目前配置 ===');
  console.log(`時區: ${config.timezone || '系統預設'} (實際: ${currentTimezone})`);
  console.log(`排程數量: ${config.schedule.length}`);
  
  if (config.schedule.length > 0) {
    console.log('\n排程列表:');
    config.schedule.forEach((schedule, index) => {
      console.log(`  ${index + 1}. ${schedule}`);
    });
  }
  console.log('');
}

function setTimezone(timezone: string) {
  try {
    configService.setTimezone(timezone);
    console.log(`✅ 時區已設定為: ${timezone}`);
  } catch (error) {
    console.error(`❌ 設定時區失敗:`, error);
  }
}

function resetTimezone() {
  try {
    configService.setTimezone(null);
    const systemTimezone = configService.getTimezone();
    console.log(`✅ 時區已重設為系統預設: ${systemTimezone}`);
  } catch (error) {
    console.error(`❌ 重設時區失敗:`, error);
  }
}

function addSchedule(cronExpression: string) {
  try {
    configService.addSchedule(cronExpression);
    console.log(`✅ 已新增排程: ${cronExpression}`);
  } catch (error) {
    console.error(`❌ 新增排程失敗:`, error);
  }
}

function removeSchedule(cronExpression: string) {
  try {
    configService.removeSchedule(cronExpression);
    console.log(`✅ 已移除排程: ${cronExpression}`);
  } catch (error) {
    console.error(`❌ 移除排程失敗:`, error);
  }
}

function clearSchedules() {
  try {
    configService.clearSchedules();
    console.log(`✅ 已清空所有排程`);
  } catch (error) {
    console.error(`❌ 清空排程失敗:`, error);
  }
}

function listSchedules() {
  const schedules = configService.getSchedules();
  console.log('\n=== 排程列表 ===');
  
  if (schedules.length === 0) {
    console.log('目前沒有排程');
  } else {
    schedules.forEach((schedule, index) => {
      console.log(`${index + 1}. ${schedule}`);
    });
  }
  console.log('');
}

switch (command) {
  case 'show':
    showConfig();
    break;
    
  case 'set-timezone':
    if (!args[1]) {
      console.error('❌ 請提供時區參數');
      showUsage();
      process.exit(1);
    }
    setTimezone(args[1]);
    break;
    
  case 'reset-timezone':
    resetTimezone();
    break;
    
  case 'add-schedule':
    if (!args[1]) {
      console.error('❌ 請提供 cron 表達式');
      showUsage();
      process.exit(1);
    }
    addSchedule(args[1]);
    break;
    
  case 'remove-schedule':
    if (!args[1]) {
      console.error('❌ 請提供要移除的 cron 表達式');
      showUsage();
      process.exit(1);
    }
    removeSchedule(args[1]);
    break;
    
  case 'clear-schedules':
    clearSchedules();
    break;
    
  case 'list-schedules':
    listSchedules();
    break;
    
  default:
    if (command) {
      console.error(`❌ 未知命令: ${command}`);
    }
    showUsage();
    process.exit(1);
}