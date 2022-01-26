import express from "express" // 3RD PARTY MODULE DOES NEED TO INSTALL
import fs from "fs" // CORE MODEL DOESNT NEED TO INSTALLED->fs means file system
import { fileURLToPath } from "url" // CORE MODEL DOESNT NEED TO INSTALLED->fs means file system
import { dirname, join } from "path" // CORE MODEL DOESNT NEED TO INSTALLED->fs means file system
import uniqid from "uniqid" // genertae unique id => 3RD PARTY MODULE DOES NEED TO INSTALL (npm i uniqid)
import { blogPostValidatioMiddlewares } from "./validation.js"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"

const blogpostRouter = express.Router()

//                               *************************** HOW TO FIND OUT THE PATH FOR THIS JASON DATA ********************

const full_blogpost_JSONpath = join(dirname(fileURLToPath(import.meta.url)), "blogpost.json") // =====>this is the shortest way getting dynamic path of the "author.json" path in difrent opreating system
// const thisFilePath = fileURLToPath(import.meta.url)

// const parentDirctory = dirname(thisFilePath)

// const full_author_JSONpath = join(parentDirctory, "author.json")

const readAuthors = () => JSON.parse(fs.readFileSync(full_blogpost_JSONpath))
const writeAuthors = (content) => {
  fs.writeFileSync(full_blogpost_JSONpath, JSON.stringify(content))
}

// ================================CREATING END POINT METHODS===========================

//1 *******POST******
blogpostRouter.post("/", blogPostValidatioMiddlewares, (req, res, next) => {
  const errorList = validationResult(req)
  try {
    if (!errorList.isEmpty()) {
      // if we had validation errors -> we need to trigger bad request Error handler
      next(createHttpError(400, { errorList }))
    } else {
      const newBlogPost = { id: uniqid(), ...req.body, createdAt: new Date() }
      const BlogpostsJsonArray = readAuthors()
      BlogpostsJsonArray.push(newBlogPost)
      writeAuthors(BlogpostsJsonArray)
      res.status(201).send({ id: newBlogPost.id })
    }
  } catch (error) {
    next(error)
  }
})

//1 *******GET******
blogpostRouter.get("/", (req, res, next) => {
  try {
    const BlogpostsJsonArray = readAuthors()
    if (req.query && req.query.title) {
      const filterdAuthors = BlogpostsJsonArray.filter((blog) => blog.title == req.query.title)
      res.send(filterdAuthors)
    } else {
      res.send(BlogpostsJsonArray)
    }
  } catch (error) {
    next(error)
  }
})

// *******GET WITH ID******
blogpostRouter.get("/:id", (req, res, next) => {
  try {
    const BlogpostsJsonArray = readAuthors()

    const specficAuthor = BlogpostsJsonArray.find((blog) => blog.id == req.params.id)

    res.send(specficAuthor)
  } catch (error) {
    next(error)
  }
})

//1 **********PUT **************
blogpostRouter.put("/:id", (req, res, next) => {
  try {
    const BlogpostsJsonArray = readAuthors()
    const index = BlogpostsJsonArray.findIndex((blog) => blog.id === req.params.id) //findIndexToUpdate
    const blogpostToModify = BlogpostsJsonArray[index]
    const updateBlogpost = { ...blogpostToModify, ...req.body, updatedAt: new Date() }

    BlogpostsJsonArray[index] = updateBlogpost
    writeAuthors(BlogpostsJsonArray)
    res.send(updateBlogpost)
  } catch (error) {
    next(error)
  }
})

//1 *******DELETE******
blogpostRouter.delete("/:id", (req, res, next) => {
  try {
    const BlogpostsJsonArray = readAuthors()
    const remainingAuthors = BlogpostsJsonArray.filter((blog) => blog.id !== req.params.id)
    writeAuthors(remainingAuthors)
    res.status(204).send(`USER SUCCESSFULLY DELETED`)
  } catch (error) {
    next(error)
  }
})

export default blogpostRouter
