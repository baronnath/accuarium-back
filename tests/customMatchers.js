expect.extend({
  toBeArrayOfSize(received, size) {
    const pass = received.length >= size;
    if (pass) {
      return {
        message: () =>
          `expected ${received} to be ${size} long`,
        pass: true,
      };
    } else {
      return {
        message: () =>
        `expected ${received} to be ${size} long`,
        pass: false,
      };
    }
  },
});