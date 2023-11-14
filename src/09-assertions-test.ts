import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'], // http errors should be less than 1% of all requests
  },
};

export default () => {
  const response = http.get('https://test.k6.io/');

  check(response, {
    'status is 200': () => response.status === 200,
    'page includes text': () => {
      const body = response.body as string;
      return body.includes('Collection of simple web-pages') === true
      },
  });

  sleep(1);
};
