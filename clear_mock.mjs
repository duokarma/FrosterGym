import fs from 'fs';
import path from 'path';

const servicesDir = './src/services';
const files = fs.readdirSync(servicesDir);

for (const file of files) {
  if (!file.endsWith('.service.ts')) continue;
  
  const fullPath = path.join(servicesDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace all DEMO arrays with empty arrays
  // regex to match: const DEMO_SOMETHING: Type = [ ... ];
  content = content.replace(/const DEMO_[A-Z_]+(?:[\s\S]*?)= \[([\s\S]*?)\];/g, (match, p1, offset, string) => {
    // Only replace if it contains objects or strings, basically clear the inside
    const signature = match.split('=')[0];
    return `${signature}= [];`;
  });

  // For dashboard.service.ts, DEMO_STATS is an object
  content = content.replace(/const DEMO_STATS: DashboardStats = \{[\s\S]*?\};/g, 
    `const DEMO_STATS: DashboardStats = {
      totalMembers: 0,
      activeMembers: 0,
      todaysAttendance: 0,
      expiringSoon: 0,
      todaysCollection: 0,
      pendingDues: 0,
      birthdaysToday: 0
    };`
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Cleared mock data in ${file}`);
}
