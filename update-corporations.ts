import { connectDB, Issue } from './src/db-mongo.js';

/**
 * Corporation assignment rules:
 * - Roads, Sanitation, Water Supply → GVMC  (civic body)
 * - Electricity                     → EPDCL
 * - Public Safety                   → POLICE
 * - Infrastructure                  → VMRDA
 * - Everything else                 → GVMC  (default civic body)
 */
const assignCorporation = (category: string): string => {
  const map: Record<string, string> = {
    'Roads': 'GVMC',
    'Sanitation': 'GVMC',
    'Water Supply': 'GVMC',
    'Electricity': 'EPDCL',
    'Public Safety': 'POLICE',
    'Infrastructure': 'VMRDA',
  };
  return map[category] || 'GVMC';
};

async function run() {
  try {
    await connectDB();
    // Give MongoDB a moment to connect
    await new Promise(r => setTimeout(r, 3000));

    const issues = await Issue.find({});
    console.log(`\nFound ${issues.length} total issues in database.\n`);

    let updated = 0;
    for (const issue of issues) {
      const correct = assignCorporation(issue.category);
      if (issue.assigned_corporation !== correct) {
        console.log(`  UPDATING [${issue.category}] "${issue.title.substring(0, 50)}" → ${issue.assigned_corporation || 'null'} ❌  →  ${correct} ✅`);
        issue.assigned_corporation = correct;
        await issue.save();
        updated++;
      } else {
        console.log(`  OK       [${issue.category}] "${issue.title.substring(0, 50)}" → ${correct} ✅`);
      }
    }

    console.log(`\n✅ Done. Updated ${updated} / ${issues.length} issues.`);

    // Print summary
    const summary: Record<string, number> = {};
    for (const issue of await Issue.find({})) {
      const corp = issue.assigned_corporation || 'UNASSIGNED';
      summary[corp] = (summary[corp] || 0) + 1;
    }
    console.log('\n📊 Final Distribution:');
    for (const [corp, count] of Object.entries(summary)) {
      console.log(`   ${corp}: ${count} issues`);
    }

  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    process.exit(0);
  }
}

run();
