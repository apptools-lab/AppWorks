import { addBlock } from '..';

test('generateProject', async () => {
  const result = await addBlock(1);
  expect(result).toBe(1);
});