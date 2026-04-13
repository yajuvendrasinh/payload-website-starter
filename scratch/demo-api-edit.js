async function demonstrateApiEdit() {
  const adminEmail = 'demo-author@example.com';
  const adminPassword = 'password';
  const pageId = 12; // Local Home page ID
  const baseUrl = 'http://localhost:3000';

  console.log('--- Step 1: Logging in ---');
  const loginRes = await fetch(`${baseUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });

  if (!loginRes.ok) {
    console.error('Login failed');
    return;
  }

  const { token } = await loginRes.json();
  console.log('Login successful! JWT token received.');

  console.log('\n--- Step 2: Editing the page (PATCH) ---');
  const editRes = await fetch(`${baseUrl}/api/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      title: 'Payload Website - EDITED',
    }),
  });

  if (!editRes.ok) {
    const err = await editRes.text();
    console.error('Edit failed:', err);
    return;
  }

  const editData = await editRes.json();
  console.log('Edit successful! New title:', editData.doc.title);

  console.log('\n--- Step 3: Verifying the change (GET) ---');
  const verifyRes = await fetch(`${baseUrl}/api/pages/${pageId}`);
  const verifyData = await verifyRes.json();
  console.log('Verification successful! API Title:', verifyData.title);
}

demonstrateApiEdit();
