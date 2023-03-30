// var zero = (f) => (x) => x;

var one = (f) => () => f();

var add = (n, m) => (f) => () => m(f)(n(f)());

var two = add(one, one);

// var three = add(one, two);

two(() => console.log('1 time'))();

// three(() => console.log('print 3 times'))();
