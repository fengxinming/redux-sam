import around from '../src/around';

class A {

  constructor() {
    this.counter = 0;
  }

  increment() {
    this.counter++;
  }

}

it('测试 around 方法', () => {
  const a = new A();
  expect(a.counter).toBe(0);

  around(a, 'increment', function (fn, args) {
    this.counter = 1;
    fn.apply(this, args);
    this.counter = 1;
  });
  a.increment();
  expect(a.counter).toBe(1);
});
