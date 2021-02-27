# MongoDB GraphQL Tutorial Link
https://www.youtube.com/watch?v=0bYf1wcOK9o

## MongoDB JSON

## Queries
```
mutation CreatePerson($firstname:String!, $lastname: String!) {
  person(firstname: $firstname, lastname: $lastname) {
    id,
    firstname,
    lastname
  }
}


{
  "firstname": "mongodb",
  "lastname": "smith"
}

{
	people {
		firstname,
		lastname
    }
}

{
	person(id: "60398d52686149e4962ed811") {
		firstname,
		lastname
  }
}

```