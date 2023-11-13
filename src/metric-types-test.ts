import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { Counter, Rate, Trend, Gauge } from 'k6/metrics';

// Examples of custom classes to be called during a test, and then to be added in the report with tresholds
let myCounter = new Counter('my_counter'); //Simple counter
let newsPageResponseTrend = new Trend('response_time_news_page'); //Trend of response time for the news page


export let options:Options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500' && 'max<2000'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'], // http errors should be less than 1% of all requests
    http_reqs: ['count>20' && 'rate>4'], // number of requests should be more than 20 and rate should be more than 4 per second
    vus: ['value>9'], // number of VUs should be more than 9 (its just an example)
    checks: ['rate>0.98'], // 98% of checks should pass
    my_counter: ['count>10'], // my_counter should be more than 9 (its just an example)
    response_time_news_page: ['p(95)<150', 'p(95)<200'], // 95% of response time for the news page should be less than 150ms
  },
};

export default () => {
  const response = http.get('https://test.k6.io/');
  const responseNews = http.get('https://test.k6.io/news.php');

  myCounter.add(1); //It just counts the number of times this function is called (so its equal to the number of iterations)
  sleep(1);
  newsPageResponseTrend.add(responseNews.timings.duration); //It adds the response time of the news page to the trend

  check(response, {
    'status is 200': () => response.status === 200,
    'page includes text': () => {
      const body = response.body as string;
      return body.includes('Collection of simple web-pages') === true
      },
  });

  sleep(1);
};
