import after from '../src/afterCall';

class A {

  constructor() {
    this.counter = 0;
  }

  increment() {
    this.counter++;
  }

}

it('测试 afterCall 方法', () => {
  after();

  const a = new A();
  expect(a.counter).toBe(0);

  after(a, 'increment', function () {
    this.counter = 1;
  });
  a.increment();
  expect(a.counter).toBe(1);
});
