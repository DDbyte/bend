//components/Blog.test.jsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

//test title-author
test('renders title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5,
  }

  //render() renders the Blog component in a virtual DOM environment for testing
  const { container } = render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} user={null} />)

  // Check that the title and author are rendered
  const titleAndAuthor = container.querySelector('.blog-title-author')
  expect(titleAndAuthor).toHaveTextContent('Test Blog Title by Test Author')

  // Check that details (URL and likes) are not rendered by default
  const details = container.querySelector('.blog-details')
  expect(details).toBeNull()
})//

//test view-details
test('displays blog URL and likes when the "View" button is clicked', async () => {
  const blog = {
    title: 'Test Blog Details',
    author: 'Test Author',
    url: 'https://test-blog-details.com',
    likes: 10,
  }

  render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} user={null} />)

  // Ensure details are not shown by default
  //queryByText: Returns null if no match is found. Ideal for checking elements that might not be rendered
  expect(screen.queryByText('URL: https://test-blog-details.com')).toBeNull()
  expect(screen.queryByText('Likes: 10')).toBeNull()

  // Simulate user clicking the "View" button
  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  // Check that the URL and likes are displayed
  expect(screen.getByText('URL: https://test-blog-details.com')).toBeDefined()
  expect(screen.getByText('Likes: 10')).toBeDefined()

})//

//test "Like" button clicked twice
test('calls the like event handler twice when the "Like" button is clicked twice', async () => {
  const blog = {
    title: 'Test Blog "Like" button is clicked twice',
    author: 'Test Author',
    url: 'https://test-"Like"-button-clicked-twice.com',
    likes: 20,
  }

  //mockUpdateBlogLikes is a mock function created using vi.fn() to track how many times it gets called
  //It is passed to the Blog component as the updateBlogLikes prop
  const mockUpdateBlogLikes = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlogLikes={mockUpdateBlogLikes}
      deleteBlog={() => {}}
      user={null}
    />
  )

  // Simulate user clicking the "View" button to reveal the "Like" button
  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  // Find the "Like" button and click it twice
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  // Ensure the event handler was called twice
  expect(mockUpdateBlogLikes.mock.calls).toHaveLength(2)
})//

//test form-eventHandler
test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Click "Create New Blog" to reveal the form
  const toggleButton = screen.getByText('Create New Blog')
  await user.click(toggleButton)

  // Fill out the form fields, Labels provide more precise targeting vs getByRole
  const titleInput = screen.getByLabelText(/Title:/i)
  const authorInput = screen.getByLabelText(/Author:/i)
  const urlInput = screen.getByLabelText(/URL:/i)
  const addButton = screen.getByText('Add Blog')

  //Each form field is filled with specific values using user.type
  await user.type(titleInput, 'New Blog Title: Test Form')
  await user.type(authorInput, 'Blog Author')
  await user.type(urlInput, 'https://newblog.com')

  // Submit the form
  await user.click(addButton)

  // Assert that the createBlog function was called with correct data
  expect(createBlog.mock.calls).toHaveLength(1)
  //mock.calls[0][0] contains the first argument passed to the createBlog function.
  // The test asserts that this argument matches the expected object structure.
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Blog Title: Test Form',
    author: 'Blog Author',
    url: 'https://newblog.com',
  })
})//