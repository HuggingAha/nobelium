const { NotionAPI } = require('notion-client');
const { idToUuid } = require('notion-utils');
const fs = require('fs');

// 手动读取 .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const pageId = envVars.NOTION_PAGE_ID;
const accessToken = envVars.NOTION_ACCESS_TOKEN;

console.log('🔍 测试 Notion 连接...\n');
console.log('Page ID:', pageId);
console.log('Access Token:', accessToken ? `${accessToken.substring(0, 10)}...` : '未设置');

async function testNotionConnection() {
  try {
    const client = new NotionAPI({ 
      authToken: accessToken 
    });
    
    const uuid = idToUuid(pageId);
    console.log('\n转换后的 UUID:', uuid);
    
    console.log('\n正在获取页面数据...');
    const response = await client.getPage(uuid);
    
    console.log('\n✅ 连接成功！');
    console.log('页面类型:', Object.values(response.block)[0]?.value?.type);
    console.log('集合数量:', Object.keys(response.collection || {}).length);
    
  } catch (error) {
    console.error('\n❌ 连接失败:', error.message);
    console.error('\n可能的原因:');
    console.error('1. Notion Page ID 格式不正确');
    console.error('2. Notion Access Token 无效或已过期');
    console.error('3. 该页面不是数据库类型');
    console.error('4. Integration 没有访问该页面的权限');
  }
}

testNotionConnection();
