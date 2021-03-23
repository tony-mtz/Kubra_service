const path = require('path');
const express = require('express');
// const cookieParser = require('cookie-parser');
const {ApolloServer, gql} = require('apollo-server-express')

// const {typeDefs} = require('./typeDefs')
// const {resolvers} = require('./resolvers')
const { PrometheusAPI } = require('./dataSource');
// const app = express();
const PORT = 9000;
/**
 * parse request body
 */
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(cookieParser());

/**
 * handle static files
 */
// app.use(express.static(path.resolve(__dirname, '../build')));

const typeDefs = gql`

  type Value{
    date: Int! 
    value: String!
  }

  type Values{
    Value: [Value]
  }

  type Data{
    resultType: String
    result:[Values]

  }
  type ResultObject{
    status: String!
    data: Data 
  }

  type Query{
    getCpuUsageSecondsTotal(): Data
  }
`
const resolvers = {
  Query:{
    async cpuUsage(_, _args, {dataSources}){
      dataSources.prometheusAPI.getCpuUsageSecondsTotal()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers, 
  dataSources: ()=>{
    return{
      prometheusAPI: new PrometheusAPI()
    } 
  }
})

const app = express()
server.applyMiddleware({app});

app.listen(PORT, console.log("listening on port: ", PORT));

//http://104.200.26.218:8080/api/v1/query_range?query=
//  sum(rate(container_cpu_usage_seconds_total{id=%22/%22}[1m]))
//  /sum((machine_cpu_cores)*100)&start=2021-03-18T19:12:52.00Z&end=2021-03-20T20:12:52.00Z&step=1m