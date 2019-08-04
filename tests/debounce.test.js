import sleep from 'celia/sleep';
import debounce from '../src/debounce';

it('测试 debounce 方法', async () => {

  let i = 0;
  const counter = debounce(() => {
    i++;
  }, 200);
  counter();
  await sleep(100);
  counter();
  await sleep(100);
  counter();
  await sleep(200);
  await expect(i).toBe(1);
});
