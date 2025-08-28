#!/usr/bin/env ts-node

import cronService from '../services/cronService';

const args = process.argv.slice(2);
const command = args[0];

function showUsage() {
  console.log(`
用法: npx ts-node scripts/manage-cron.ts <command>

命令:
  status     顯示 cron 服務狀態
  start      啟動 cron 服務
  stop       停止 cron 服務
  restart    重新啟動 cron 服務
  `);
}

function showStatus() {
  const status = cronService.getStatus();
  
  console.log('\n=== Cron 服務狀態 ===');
  console.log(`運行狀態: ${status.running ? '運行中' : '已停止'}`);
  console.log(`任務數量: ${status.taskCount}`);
  console.log(`時區: ${status.timezone}`);
  
  if (status.schedules.length > 0) {
    console.log('\n排程列表:');
    status.schedules.forEach((schedule, index) => {
      console.log(`  ${index + 1}. ${schedule}`);
    });
  } else {
    console.log('\n⚠️  沒有配置任何排程');
  }
  console.log('');
}

function startService() {
  try {
    cronService.start();
    console.log('✅ Cron 服務已啟動');
  } catch (error) {
    console.error('❌ 啟動 Cron 服務失敗:', error);
  }
}

function stopService() {
  try {
    cronService.stop();
    console.log('✅ Cron 服務已停止');
  } catch (error) {
    console.error('❌ 停止 Cron 服務失敗:', error);
  }
}

function restartService() {
  try {
    cronService.restart();
    console.log('✅ Cron 服務已重新啟動');
  } catch (error) {
    console.error('❌ 重新啟動 Cron 服務失敗:', error);
  }
}

switch (command) {
  case 'status':
    showStatus();
    break;
    
  case 'start':
    startService();
    break;
    
  case 'stop':
    stopService();
    break;
    
  case 'restart':
    restartService();
    break;
    
  default:
    if (command) {
      console.error(`❌ 未知命令: ${command}`);
    }
    showUsage();
    process.exit(1);
}