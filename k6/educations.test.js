import http from 'k6/http'
import { check } from 'k6'

export let options = {
  scenarios: {
    ramping_rps: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 200, // initial VUs
      maxVUs: 5000, // cukup tinggi agar bisa scale
      stages: [
        { target: 100, duration: '15s' },   // 100 RPS selama 15 detik
        { target: 1000, duration: '30s' },  // naik ke 1000
        { target: 5000, duration: '30s' },  // naik ke 5000
        { target: 10000, duration: '30s' }, // akhir di 10000 RPS
        { target: 0, duration: '10s' },     // cooldown
      ],
    },
  },
}

const token = 'Bearer skinsight_NA.WTdGZXUzMFZjQmR1TnE5ajhZeVJTLUMwS08xVmJTWGlUT25IdVV0dTYxMzEyNzUxMA"'

export default function () {
  const res = http.get('http://localhost:3333/api/educations', {
    headers: {
      Authorization: token,
    },
  })

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  })
}
