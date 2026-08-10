import fs from 'fs';

let content = fs.readFileSync('master_schema.sql', 'utf8');
let tables = content.match(/CREATE TABLE IF NOT EXISTS [\w\.]+ \([\s\S]*?\);/g);

if (tables) {
    for (let table of tables) {
        let tableNameMatch = table.match(/CREATE TABLE IF NOT EXISTS ([\w\.]+)/);
        if (tableNameMatch) {
            let tableName = tableNameMatch[1];
            if (!table.includes('gym_id')) {
                console.log(`Table ${tableName} is missing gym_id`);
            }
        }
    }
}
