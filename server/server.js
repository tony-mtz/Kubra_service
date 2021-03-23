const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express')
const {RESTDataSource} = require('apollo-datasource-rest')

const PORT = 9000;

const API_URL = 'http://104.200.26.218:8080/api/v1/';

class PrometheusAPI extends RESTDataSource{
  constructor(){
    super()
    this.baseURL = API_URL;
  }

  async getCpuUsageSecondsTotal(){
   
    const data = await this.get('query_range?query=sum(rate(container_cpu_usage_seconds_total{id="/"}[1m]))/sum((machine_cpu_cores)*100)&start=2021-03-19T19:12:52.00Z&end=2021-03-21T20:12:52.00Z&step=1m')
   //can fix data here to conver or just get correct data
   console.log(data.status)

   return data;
  }
}

const typeDefs = gql`
  type Data{
    status : String
  }  

  type Query{
    cpuUsage: Data
    
  }
`

const resolvers = {
  Query:{
    cpuUsage: async(_, _args, {dataSources})=>{
      return dataSources.prometheusAPI.getCpuUsageSecondsTotal()
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