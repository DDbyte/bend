//
const { test, describe } = require('node:test')
const assert = require('node:assert')
const list_helper = require('../utils/list_helper')

describe('favorite blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]

    const listOfBlogs = [        
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2,
          __v: 0
        }  
      ]

      const emptyList = []
  
    test('when list has only one blog, returns that blog as favorite', () => {
      const result = list_helper.favoriteBlog(listWithOneBlog)
      assert.deepStrictEqual(result, {        
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',        
        likes: 5,       
      })
    })

    test('list with a few blogs, returns the blog with most likes', () => {
        const result = list_helper.favoriteBlog(listOfBlogs)
        assert.deepStrictEqual(result, {
            title: 'First class tests',
            author: 'Robert C. Martin',
            likes: 10            
        })
    })

    test('empty list, equals null', () => {
        const result = list_helper.favoriteBlog(emptyList)
        assert.strictEqual(result, null)
    })
  })

  //Use assert.deepStrictEqual for object comparison, as strictEqual only works for primitive values.