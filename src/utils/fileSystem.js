let fileHandle = null;

export async function getPostsDirectory() {
  try {
    fileHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents'
    });
    return fileHandle;
  } catch (err) {
    console.error('Failed to get directory access:', err);
    throw err;
  }
}

export async function writePost(filename, content) {
  if (!fileHandle) {
    await getPostsDirectory();
  }
  
  try {
    const newFileHandle = await fileHandle.getFileHandle(filename, { create: true });
    const writable = await newFileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch (err) {
    console.error('Failed to write file:', err);
    throw err;
  }
}

export async function deletePost(filename) {
  if (!fileHandle) {
    await getPostsDirectory();
  }
  
  try {
    await fileHandle.removeEntry(filename);
  } catch (err) {
    console.error('Failed to delete file:', err);
    throw err;
  }
}