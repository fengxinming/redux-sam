import before from '../src/beforeCall';

class A {

  constructor() {
    this.counter = 0;
  }

  increment() {
    this.counter++;
  }

}

it('测试 beforeCall 方法', () => {
  before();

  const a = new A();
  expect(a.counter).toBe(0);

  before(a, 'increment', function () {
    this.counter = 1;
  });
  a.increment();
  expect(a.counter).toBe(2);
});
