
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { TestScenario } from '../validation/test-scenario.schema';

export async function saveScenariosToFile(
  filePath: string,
  scenarios: TestScenario[],
): Promise<void> {
  if (scenarios.length === 0) {
    throw new Error('Cannot save an empty scenario list.');
  }

  await mkdir(dirname(filePath), { recursive: true });

  const json = JSON.stringify(scenarios, null, 2);

  await writeFile(filePath, `${json}\n`, 'utf8');
}
