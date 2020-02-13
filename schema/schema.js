const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const Axios = require("axios");

const url = "http://localhost:3000";

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    overview: { type: GraphQLString },
    poster_path: { type: GraphQLString },
    release_date: { type: GraphQLString },
    cast: {
      type: GraphQLList(CastType),
      resolve(parentValue, args) {
        return Axios.get(`${url}/movies/${parentValue.id}/casts`).then(
          res => res.data
        );
      }
    }
  })
});

const CastType = new GraphQLObjectType({
  name: "Cast",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    character: { type: GraphQLString },
    profile_path: { type: GraphQLString },
    gender: { type: GraphQLInt },
    movie: {
      type: MovieType,
      resolve(parentValue, args) {
        return Axios.get(`${url}/movies/${parentValue.movieId}`).then(
          res => res.data
        );
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args = null) {
        return Axios.get(`${url}/movies/${args.id}`).then(res => res.data);
      }
    },
    cast: {
      type: CastType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args = null) {
        return Axios.get(`${url}/casts/${args.id}`).then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        overview: { type: GraphQLString }
      },
      resolve(parentValue, { id, title, overview }) {
        return Axios.post(`${url}/movies`, { id, title, overview }).then(
          res => res.data
        );
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, { id }) {
        return Axios.delete(`${url}/movies/${id}`).then(res => res.data);
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        overview: { type: GraphQLString }
      },
      resolve(parentValue, { id, title, overview }) {
        return Axios.put(`${url}/movies/${id}`, { title, overview }).then(
          res => res.data
        );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
