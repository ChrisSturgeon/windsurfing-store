# Windsurfing Store Inventory

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)
- [Concepts and Ideas Learnt](#concepts-and-ideas-learnt)
- [Areas to Improve](#areas-to-improve)
- [Contact](#contact)

## Overview

A site to manage the inventory of a fictional windsurfing store where users can perform CRUD operations on individual items, product brands, and windsurfing disciplines. Express and MongoDB are used to manage data, and Tailwind to create a simple UI.

View the project guidelines [here](https://www.theodinproject.com/lessons/nodejs-inventory-application).

![Front page screenshot](/public/images/screenshot.jpg 'Store screenshot')

### Built With

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Async](https://www.npmjs.com/package/async)
- [Tailwind CSS](https://expressjs.com/)
- [Pug](https://pugjs.org/api/getting-started.html)

## Features

- Create, Read, Update and Delete operations across four different data models.
- Picures can be uploaded for products.
- Responsive UI.

### Concepts and Ideas Learnt

- How to **santitise and validate** user data on the server-side. This includes photos using [Multer middleware](https://github.com/expressjs/multer) for which I found [this video](https://www.youtube.com/watch?v=srPXMt1Q0nY) extremely helpful to understand how to implement it.
- How to model the **database schema** and consider when it's best to embed data wihin a single document, or use references between different documents.
- I have written some basic **MVC patterns** on previous projects but implementing them across four different models within a single project helped to cement my understanding.
- This was my first use of **Tailwind** which, after some experimentation, I can now see how it can be used to quickly put together a UI - although for a project of this size I think it's unnecessary.

### Areas to Improve

With more time I would have liked to have implemented more features and improved others, such as:

- Allowed users to upload images for each new brand i.e. the company logo.
- Create user accounts and basket & checkout stages.
- Improved the UI by making it more interactive.

## Contact

- sturgeon.chris@gmail.com
- [www.chrissturgeon.co.uk](https://chrissturgeon.co.uk/)
- [LinkedIn](https://www.linkedin.com/in/chris-sturgeon-36a74254/)
