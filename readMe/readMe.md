## URL Shortner Project

## Overview

URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs. So, short links are useful because:

- They are easier to share, print, tweet or message.
- Users are less likely to mistype them.
- They are more readable.
- They help track user clicks.
- They can hide complex or long affiliate link.

For example, if we shorten the following URL through TinyURL:

## Long URL:

     https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143

## Short URL:

    https://tinyurl.com/y4ned4ep

The shortened URL is nearly one-fifth the size of the actual URL.
Example : tinyurl.com throgh which we can shortened URL.

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDb + Mongoose**
- **Redis Cloud**
- **NanoID**
- **dotenv**
- **Postman ( Testing)**

## Features

- Shorten any valid long URL
- Generate unique urlCode using nanoid
- Store & fetch URL details from MongoDB
- Fast redirection using Redis Caching
- Avoid duplicate short URLs
- Input validation ( URL format, empty body etc.)
- clean REST API responses
- 302 Redirect for GET short URLs

## Models

## Url Model

{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }

## POST /url/shorten

Create a short URL for an original url recieved in the request body.
The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
Return the shortened unique url. Refer this for the response
Ensure the same response is returned for an original url everytime
Return HTTP status 400 for an invalid request

## GET /:urlCode

Redirect to the original URL corresponding
Use a valid HTTP status code meant for a redirection scenario.
Return a suitable error for a url not found
Return HTTP status 400 for an invalid request

Use caching while fetching the shortened url to minimize db calls.
Implement what makes sense to you and we will build understanding over the demo discussion.
Figure out if you can also use caching while redirecting to the original url from the shortedned url

## Response

## Successful Response structure

{
status: true,
data: {

}
}

## Error Response structure

{
status: false,
message: ""
}
Response samples

## Url shorten response

   ```yaml  {
     "data": {
     "longUrl": "https://www.amazon.in/s?rh=n%3A976419031%2Cn%3A1389401031&dc&qid=1763154840&rnid=976419031&ref=sr_nr_n_8",
     "shortUrl": "http://localhost:3000/ghfgfg",
     "urlCode": "ghfgfg"
     }
     }
   ```  

## Installation & Setup

### 1. Clone the Repository

      git clone <repoLink>
      cd project-folder

### 2. Install dependencies

        npm install

### 3. Create .env file in the root folder

       REDIS_URL=your-redis-cloud-url
       MONGO_URI=your-mongodb-connection-string
       BASE_URL=http://localhost:3000/

### 4. Start the server

      node src/index.js

##  Author

Pratiksha Parihari

## License

This project is for learning and practice purposes.
