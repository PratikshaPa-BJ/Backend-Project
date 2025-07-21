You have to replicate the below data in your database. With this in mind, create a node application and APIs to do the following:

1. Write down the schemas for book and authors (keeping the data given below in mind). Also create the documents (corresponding to the data given below) in your database.
2. CRUD operations. Write API's to do the following:
   i.. Write create APIs for both books and authors ---> If author_id is not available then do not accept the entry(in neither the author collection nor the books collection)
   ii.. List out the books written by "Chetan Bhagat" ( this will need 2 DB queries one after another- first query will find the author_id for "Chetan Bhagat”. Then next query will get the list of books with that author_id )
   iii.. find the author of “Two states” and update the book price to 100; Send back the author_name and updated price in response. ( This will also need 2 queries- 1st will be a findOneAndUpdate. The second will be a find query aith author_id from previous query)
   iv.. Find the books which costs between 500-1000(500,1000 inclusive) and respond back with the author names of respective books..
