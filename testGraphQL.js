const fetch = require('node-fetch').default;

async function test() {
  const url = 'http://localhost:4000/graphql';

  const queries = [
    `query { courses { id title } }`,
    `query { users { id name } }`,
    `mutation { signup(name: "Test User", email: "testuser@example.com", password: "password123") { token user { id name } } }`,
    `mutation { login(email: "testuser@example.com", password: "password123") { token user { id name } } }`
  ];

  for (const query of queries) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    console.log('Query:', query);
    console.log('Response:', JSON.stringify(json, null, 2));
  }
}

test();
