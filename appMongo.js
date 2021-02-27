const Express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { MongoClient } = require('mongodb');

const {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
} = require('graphql');
require('dotenv').config();

var app = Express();

// --------------------------------- CONNECT TO DATABASE -------------------------------------------
// Connect via MongoDB
const uri = `${process.env.MONGO_URL1}${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_URL2}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tutorial');
        const collection = database.collection('graphql2');
		console.log(`Database: ${database}`);
		console.log(`Collection: ${collection}`);

        // MongoDB Create Collection & Schema
        // database.createCollection(
        //     'graphql2', {
        //         validator: {
        //             $jsonSchema: {
        //                 bsonType: 'object',
        //                 properties: {
        //                     _id: {},
        //                     firstname: {
        //                         bsonType: 'string',
        //                         description: "The person's first name",
        //                     },
        //                     lastname: {
        //                         bsonType: 'string',
        //                         description: "The person's last name",
        //                     },
        //                 },
        //             },
        //         }
        //     }
        // );

        // collection.findOne({'_id': '60398d52686149e4962ed811'}, (err, result) => {
        //     if (err) throw err;
        //     console.log(result);
        //     db.close();
        // });

        // // MongoDB Schema
        // database.runCommand({
        //     collMod: 'graphql2',
        //     validator: {
        //         $jsonSchema: {
        //             bsonType: 'object',
        //             properties: {
        //                 _id: {},
        //                 firstname: {
        //                     bsonType: 'string',
        //                     description: "The person's first name",
        //                 },
        //                 lastname: {
        //                     bsonType: 'string',
        //                     description: "The person's last name",
        //                 },
        //             },
        //         },
        //     }
        // });

        const PersonType = new GraphQLObjectType({
            name: 'Person',
            fields: {
                id: { type: GraphQLID },
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
            },
        });

        const schema = new GraphQLSchema({
            query: new GraphQLObjectType({
                name: "Query",
                fields: {
                    people: {
                        type: GraphQLList(PersonType),
                        resolve: (root, args, context, info) => {
                            // return PersonModel.find().exec();
                            console.log('querying people');
                            collection.find({}).toArray((err, result) => {
                                if (err) throw err;
                                console.log(result);
                                return result;
                            });
                        }
                    },
                    person: {
                        type: PersonType,
                        args: {
                            id: {type: GraphQLNonNull(GraphQLID)}
                        },
                        resolve: (root, args, context, info) => {
                            // return PersonModel.findById(args.id).exec();
                            return collection.findOne({'_id': args.id}, (err, result) => {
                                if (err) throw err;
                                db.close();
                            });
                        }
                    }
                }
            }),
            mutation: new GraphQLObjectType({
                name: "Mutation",
                fields: {
                    person: {
                        type: PersonType,
                        args: {
                            firstname: {type: GraphQLNonNull(GraphQLString)},
                            lastname: {type: GraphQLNonNull(GraphQLString)},
                        },
                        resolve: (root, args, context, info) => {
                            // let person  = new PersonModel(args);
                            // return person.save();
                            collection.insertOne(args, (err, res) => {
                                if (err) throw err;
                                console.log('1 document inserted');
                                db.close();
                            });
                        }
                    }
                }
            })
        });

        app.use("/graphql", express.json(), graphqlHTTP({
            schema: schema,
            graphiql: true
        }));

    } catch(err) {
        console.log('error',err);
    }
}

run().catch(console.dir);

app.listen(3000, () => {
	console.log('Listening at: http://localhost:3000');
});
