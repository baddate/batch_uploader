const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const files = event.target.elements['files[]'].files;

  for (const file of files) {
    const content = await readFile(file);

    await createFile(file.name, content);
  }

  alert('Upload successful!');
});

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}

async function createFile(filename, content) {
  const response = await fetch('https://api.github.com/repos/:owner/:repo/contents/' + filename, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer :token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Add ' + filename,
      content: btoa(content),
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message);
  }
}
