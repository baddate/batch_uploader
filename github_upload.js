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
  const response = await fetch('https://api.github.com/repos/baddate/batch_uploader/contents/' + filename, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer :d8e41bdfd90cd702600f25eff5de5bd4799f0549',
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
