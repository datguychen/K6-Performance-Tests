import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

//Determine the system's breaking point by incrementally increasing the load until failure, revealing performance limitations.
//Run only if load and stress test pass.
//Don't run this test, its  just a preview how it would look. We dont want to break the public API.

export let options:Options = {
  stages: [
    { duration: '2h', target: 10000 },
  ]
};

export default () => {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');
  check(response, {
    'status is 200': () => response.status === 200,
  });
  sleep(1); //1 call per second
};
