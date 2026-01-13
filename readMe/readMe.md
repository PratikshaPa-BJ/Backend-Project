## Open to Intern Project

## Overview

This Project is basically a simple Backend application built using Node.js, Express and MongoDB. It provides RESTful APIs to manage colleges and interns, where :
- colleges can register themselves.
- interns can apply for internships under those colleges.

The application follows a clean MVC architecture and includes robust input validation, file upload using Cloudinary and secure data handling using MongoDB with Mongoose.

## Key Features

- College registration with:
   
   - Unique short name
   - Full college name
   - Logo upload using Cloudinary

- Intern registration with:

   - Name, email and mobile validation
   - Duplicate email and mobile prevention
   - Association with a valid college

- Fetch college details along with all interns applied
- Centralized validation logic
- Proper HTTP status codes and structured responses
- Soft delete support (using isDeleted flag)


##  Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Javascript(ES6+)**
- **Cloudinary (image upload)**
- **Multer (File handling)**
- **Postman ( API Testing )**

### Models

- College Model

```
{ name: { mandatory, unique, example iith}, fullName: {mandatory, example `Indian Institute of Technology, Hyderabad`}, logoLink: {mandatory}, isDeleted: {boolean, default: false} }
```

- Intern Model

```
{ name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}}
```

### POST /colleges

- Create a college - a document for each member of the group
- The logo link will be provided by Cloudinary once you create account in Clodinary

  `Endpoint: BASE_URL/colleges`

### POST /interns

- Create a document for an intern.
- Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}
- Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like [this](#successful-response-structure)

- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

### GET /collegeDetails

- Returns the college details for the requested college (Expect a query parameter by the name `collegeName`. This is anabbreviated college name. For example `iith`)
- Returns the list of all interns who have applied for internship at this college.
- The response structure should look like [this](#college-details)


## Response

### Successful Response structure

```yaml
{ status: true, data: {} }
```

### Error Response structure

```yaml
{ status: false, message: "" }
```

## Collections samples

#### College

```yaml
{
  "name": "iith",
  "fullName": "Indian Institute of Technology, Hyderabad",
  "logoLink": "https://res.cloudinary.com/dqcpb9s7z/image/upload/v1768286983/college_logos/aqtsaatdjbajkoc5wzm8.png",
  "isDeleted": false,
}
```

#### Intern

```yaml
{
  "isDeleted": false,
  "name": "Jane Does",
  "email": "jane.doe@iith.in",
  "mobile": "90000900000",
  "collegeId": ObjectId("888771129c9ea621dc7f5e3b"),
}
```

## Response samples

### College details

```yaml
{
  "data":
    {
      "name": "xyz",
      "fullName": "Some Institute of Engineering and Technology",
      "logoLink": "some public s3 link for a college logo",
      "interns":
        [
          {
            "_id": "123a47301a53ecaeea02be59",
            "name": "Jane Doe",
            "email": "jane.doe@miet.ac.in",
            "mobile": "8888888888",
          },
          {
            "_id": "45692c0e1a53ecaeea02b1ac",
            "name": "John Doe",
            "email": "john.doe@miet.ac.in",
            "mobile": "9999999999",
          },
          {
            "_id": "7898d0251a53ecaeea02a623",
            "name": "Sukruti",
            "email": "dummy.email@miet.ac.in",
            "mobile": "9191919191",
          },
          {
            "_id": "999803da1a53ecaeea02a07e",
            "name": "Neeraj Kumar",
            "email": "another.example@miet.ac.in",
            "mobile": "9898989898",
          },
        ],
    },
}
```

##  Installation & Setup

###  1. Clone the Repository
     
       git clone <repoLink>

###  2. Install Dependencies

      npm i

###  3. Create .env file

      MONGO_URI=your_mongoDb_Connection_String
      PORT=port_number
      CLOUD_NAME=your_clodinary_name
      CLOUD_API_KEY=your_api_key
      CLOUD_API_SECRET=your_api_secret


###  4.  Start the server

      node src/index.js


##  Learning

- REST API design
- MVC architecture
- Cloudinary image uploads
- Mongoose schema design
- Input validation
- Error handling and status codes

##  Author

Pratiksha Parihari

##  License

This Project is created for learning and practice purposes.

##  Extra note

   This Backend is also connected with Frontend for more clarity.
