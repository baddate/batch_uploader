const token = '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';
const repoName = 'batch_uploader';
const username = 'baddate';

async function uploadFileToGithub(file) {
  const content = await file.arrayBuffer();
  const encodedContent = btoa(String.fromCharCode.apply(null, new Uint8Array(content)));

  const path = file.webkitRelativePath || file.name;
  const message = `Upload ${path}`;

  const url = `https://api.github.com/repos/${username}/${repoName}/contents/${path}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
    }),
  });

  if (response.ok) {
    console.log(`${path} uploaded to GitHub with status code ${response.status}`);
  } else {
    console.error(`Error uploading ${path} to GitHub: ${response.statusText}`);
  }
}

async function uploadFiles() {
  // 获取文件上传表单中的文件
  const files = document.getElementById('file-input').files;

  // 检查是否选择了文件
  if (files.length === 0) {
    alert('请选择需要上传的文件');
    return;
  }

  // 循环上传每个文件
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`${file.name}`);
    await uploadFileToGithub(file);
  }

  console.log('All files uploaded to GitHub');
}

// 添加事件监听器，等待上传按钮被点击
document.getElementById('upload-button').addEventListener('click', uploadFiles);
