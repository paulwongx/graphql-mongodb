const Express = require('express');
const { graphqlHTTP } = require('express-graphql');
const Mongoose = require('mongoose');

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

Mongoose.connect(`${process.env.MONGO_URL1}${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_URL2}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
}, 'myCollection'); // custom collection name

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
                    return PersonModel.find().exec();
                }
            },
            person: {
                type: PersonType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID)}
                },
                resolve: (root, args, context, info) => {
                    return PersonModel.findById(args.id).exec();
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
                    let person  = new PersonModel(args);
                    return person.save();

                }
            }
        }
    })
});

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
	console.log('Listening at: http://localhost:3000');
});
