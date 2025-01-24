//tests/blog_app.spec.js

const { test, expect, beforeEach, describe } = require('@playwright/test')
const axios = require('axios')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    // Reset the database
    await axios.post('http://localhost:3003/api/testing/reset')

    // Create a new user
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'StrongPass1!',
    }
    await axios.post('http://localhost:3003/api/users', newUser)

    // Navigate to the application
    await page.goto('http://localhost:5173')

    // Wait for the login form to be visible
    await page.waitForSelector('form')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.locator('form:has-text("Username:")')
    await page.waitForSelector('form:has-text("Username:")')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {

      // Fill in the login form with correct credentials
      await page.locator('input[aria-label="Username"]').fill('testuser')
      await page.locator('input[aria-label="Password"]').fill('StrongPass1!')
      await page.getByRole('button', { name: 'Login' }).click();

      // Assert that the user is logged in
      await expect(page.getByText('testuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {

      // Fill in the login form with incorrect credentials
      await page.locator('input[aria-label="Username"]').fill('testuser')
      await page.locator('input[aria-label="Password"]').fill('wrongPass1!')
      await page.getByRole('button', { name: 'Login' }).click()

      const errorDiv = await page.locator('.notification')
      await expect(errorDiv).toContainText('Wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Navigate to the app
      await page.goto('http://localhost:5173')

      // Log in with valid credentials
      await page.getByLabel('Username').fill('testuser')
      await page.getByLabel('Password').fill('StrongPass1!')
      await page.getByRole('button', { name: 'Login' }).click()

      // Assert login was successful
      await expect(page.getByText('testuser logged in')).toBeVisible()
    });

    test('a new blog can be created, and liked', async ({ page }) => {
      // Open the form for creating a new blog
      await page.getByRole('button', { name: 'Create New Blog' }).click()

      // Fill in the blog form fields
      await page.getByLabel('Title').fill('Test Blog Title')
      await page.getByLabel('Author').fill('Test Author')
      await page.getByLabel('URL').fill('https://testblog.com')

      // Submit the form
      await page.getByRole('button', { name: 'Add Blog' }).click()

      // Assert that the new blog is visible in the list
      await expect(page.getByText('Test Blog Title by Test Author')).toBeVisible()
      // Click the "View" button to expand blog details
      await page.getByRole('button', { name: 'View' }).click()

      // Check the initial likes count
      const likesText = await page.locator('.likes-count').textContent()
      const initialLikes = parseInt(likesText.match(/\d+/)[0], 10)

      // Click the "Like" button
      await page.getByRole('button', { name: 'Like' }).click()

      // Check the updated likes count
      const updatedLikesText = await page.locator('.likes-count').textContent()
      const updatedLikes = parseInt(updatedLikesText.match(/\d+/)[0], 10)+1

      // Assert the likes count increased by 1
      expect(updatedLikes).toBe(initialLikes + 1)

    })



  })

})//


