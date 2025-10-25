import '@testing-library/jest-dom'

// Mock File System Access API
const mockFileHandle = {
  getFileHandle: vi.fn(),
  removeEntry: vi.fn()
}

const mockWritable = {
  write: vi.fn(),
  close: vi.fn()
}

global.window.showDirectoryPicker = vi.fn().mockResolvedValue(mockFileHandle)
mockFileHandle.getFileHandle.mockResolvedValue({
  createWritable: () => Promise.resolve(mockWritable)
})