const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema } = graphql;
const Axios = require("axios");

const url = "http://localhost:3000";

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    overview: { type: GraphQLString },
    poster_path: { type: GraphQLString },
    release_date: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    movies: {
      type: MovieType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args = null) {
        if (args != null)
          return Axios.get(`${url}/movies/${args.id}`).then(res => res.data);
        else return Axios.get(`${url}/movies`).then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
